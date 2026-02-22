#!/usr/bin/env python3
"""
Seed location_data with BEA Regional Price Parity (RPP) data.

Usage:
    cd ph26-backend
    python scripts/seed_bea_rpp.py

Prerequisites:
    - Set BEA_API_KEY in .env.local (get a free key at https://apps.bea.gov/API/signup/)
    - Run SQL migration 001_location_data.sql first
    - pip install requests supabase

What it seeds:
    1. MSA-level RPP from BEA table MARPP (387 metro areas, 2022 vintage)
    2. State-level RPP from BEA table SARPP as "(Statewide)" fallback rows
"""

import os
import sys
import requests
from pathlib import Path

# ── Bootstrap env from .env.local ────────────────────────────────────────────
env_path = Path(__file__).resolve().parent.parent / ".env.local"
if env_path.exists():
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, _, value = line.partition("=")
            os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))

from supabase import create_client

SUPABASE_URL = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
SUPABASE_KEY = os.environ["NEXT_PUBLIC_SUPABASE_ANON_KEY"]
BEA_API_KEY  = os.environ.get("BEA_API_KEY", "")

if not BEA_API_KEY:
    print("ERROR: BEA_API_KEY not set. Get a free key at https://apps.bea.gov/API/signup/")
    sys.exit(1)

BEA_ENDPOINT = "https://apps.bea.gov/api/data"
YEAR = "2022"   # Latest year with complete RPP coverage

# Flat-rate state income tax approximations (mirrors taxData.ts on the frontend)
STATE_TAX_RATES: dict[str, float] = {
    "AL": 0.050, "AK": 0.000, "AZ": 0.025, "AR": 0.047, "CA": 0.093,
    "CO": 0.044, "CT": 0.050, "DE": 0.066, "FL": 0.000, "GA": 0.055,
    "HI": 0.090, "ID": 0.058, "IL": 0.049, "IN": 0.032, "IA": 0.060,
    "KS": 0.057, "KY": 0.045, "LA": 0.042, "ME": 0.075, "MD": 0.052,
    "MA": 0.050, "MI": 0.042, "MN": 0.099, "MS": 0.050, "MO": 0.054,
    "MT": 0.069, "NE": 0.068, "NV": 0.000, "NH": 0.000, "NJ": 0.097,
    "NM": 0.059, "NY": 0.109, "NC": 0.045, "ND": 0.029, "OH": 0.040,
    "OK": 0.050, "OR": 0.099, "PA": 0.031, "RI": 0.060, "SC": 0.070,
    "SD": 0.000, "TN": 0.000, "TX": 0.000, "UT": 0.047, "VT": 0.087,
    "VA": 0.058, "WA": 0.000, "WV": 0.065, "WI": 0.053, "WY": 0.000,
    "DC": 0.085,
}

# BEA returns full state names for state-level data
STATE_NAME_TO_ABBR: dict[str, str] = {
    "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
    "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
    "District of Columbia": "DC", "Florida": "FL", "Georgia": "GA", "Hawaii": "HI",
    "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS",
    "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
    "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS",
    "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV",
    "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
    "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK",
    "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
    "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT",
    "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV",
    "Wisconsin": "WI", "Wyoming": "WY",
}


def _bea_get(table: str, geo_fips: str) -> list[dict]:
    params = {
        "UserID":       BEA_API_KEY,
        "method":       "GetData",
        "datasetname":  "Regional",
        "TableName":    table,
        "LineCode":     "1",      # All-items RPP
        "GeoFips":      geo_fips,
        "Year":         YEAR,
        "ResultFormat": "JSON",
    }
    resp = requests.get(BEA_ENDPOINT, params=params, timeout=30)
    resp.raise_for_status()
    payload = resp.json()
    results = payload.get("BEAAPI", {}).get("Results", {})
    if "Error" in results:
        err = results["Error"]
        raise RuntimeError(f"BEA API error {err.get('APIErrorCode')}: {err.get('APIErrorDescription')}")
    return results.get("Data", [])


def _safe_float(val: object) -> float | None:
    try:
        return float(str(val).replace(",", ""))
    except (ValueError, TypeError):
        return None


def parse_msa_name(geo_name: str) -> tuple[str, str] | None:
    """
    BEA MSA geo names look like:
      "Abilene, TX (Metropolitan Statistical Area)"
      "New York-Newark-Jersey City, NY-NJ-PA (Metropolitan Statistical Area)"
    Returns (primary_city, first_state_abbr) or None.
    """
    # Strip the trailing "(Metropolitan Statistical Area)" or similar suffix
    name = geo_name.split("(")[0].strip().rstrip(",")

    parts = name.rsplit(",", 1)
    if len(parts) != 2:
        return None

    city_part  = parts[0].strip()
    state_part = parts[1].strip()

    # Multi-state MSAs like "NY-NJ-PA" — take the first
    state_abbr = state_part.split("-")[0].strip()
    if len(state_abbr) != 2 or not state_abbr.isalpha():
        return None

    # Multi-city names like "San Francisco-Oakland-Berkeley" — take the first
    primary_city = city_part.split("-")[0].strip()
    return primary_city, state_abbr.upper()


def seed_msa(supabase) -> tuple[int, int]:
    print("Fetching MSA-level RPP (MARPP)…")
    rows = _bea_get("MARPP", "MSA")
    print(f"  {len(rows)} raw MSA data points received.")

    upserted = skipped = 0
    for row in rows:
        val = row.get("DataValue")
        if not val or val in ("(NA)", "(D)", ""):
            skipped += 1
            continue

        parsed = parse_msa_name(row.get("GeoName", ""))
        if not parsed:
            skipped += 1
            continue

        city, state_abbr = parsed
        rpp = _safe_float(val)
        if rpp is None:
            skipped += 1
            continue

        record = {
            "city":                  city,
            "state_abbr":            state_abbr,
            "rpp_index":             rpp,
            "state_income_tax_rate": STATE_TAX_RATES.get(state_abbr, 0.0),
        }
        supabase.table("location_data").upsert(record, on_conflict="city,state_abbr").execute()
        upserted += 1

    return upserted, skipped


def seed_states(supabase) -> tuple[int, int]:
    """Seed state-level RPP as '(Statewide)' rows — used as city fallback."""
    print("Fetching state-level RPP (SARPP) for statewide fallbacks…")
    rows = _bea_get("SARPP", "STATE")
    print(f"  {len(rows)} raw state data points received.")

    upserted = skipped = 0
    for row in rows:
        geo_name = row.get("GeoName", "")
        val      = row.get("DataValue")

        if not val or val in ("(NA)", "(D)", ""):
            skipped += 1
            continue

        # State rows have names like "California", "United States"
        state_abbr = STATE_NAME_TO_ABBR.get(geo_name)
        if not state_abbr:
            skipped += 1
            continue

        rpp = _safe_float(val)
        if rpp is None:
            skipped += 1
            continue

        record = {
            "city":                  "(Statewide)",
            "state_abbr":            state_abbr,
            "rpp_index":             rpp,
            "state_income_tax_rate": STATE_TAX_RATES.get(state_abbr, 0.0),
        }
        supabase.table("location_data").upsert(record, on_conflict="city,state_abbr").execute()
        upserted += 1

    return upserted, skipped


def seed() -> None:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    msa_up, msa_skip   = seed_msa(supabase)
    st_up,  st_skip    = seed_states(supabase)

    print(
        f"\nDone."
        f"\n  MSA rows   — upserted: {msa_up}, skipped: {msa_skip}"
        f"\n  State rows — upserted: {st_up}, skipped: {st_skip}"
        f"\n  Total upserted: {msa_up + st_up}"
    )


if __name__ == "__main__":
    seed()
