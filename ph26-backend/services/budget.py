# Master budget breakdown assembler

from typing import Any

from services.tax import calculate_federal_tax, calculate_fica
from services.col import get_location_data, resolve_budget_strategy, col_adjusted_take_home

SPLITS: dict[str, dict[str, float]] = {
    "60_30_10": {"essential": 0.60, "discretionary": 0.30, "savings": 0.10},
    "50_30_20": {"essential": 0.50, "discretionary": 0.30, "savings": 0.20},
}


def calculate_breakdown(income: dict, preferences: dict, supabase: Any) -> dict:
    """
    Compute the full monthly budget breakdown for a single financial profile.

    income      — row from income_details table
    preferences — row from user_preferences table (may be empty dict)
    supabase    — Supabase client instance
    """
    salary = float(income.get("base_salary") or 0)
    if not salary:
        return {"error": "No salary on record"}

    gross_monthly = salary / 12

    # ── 401k pre-tax deduction ────────────────────────────────────────────────
    contrib_pct = float(income.get("four01k_contribution_pct") or 0) / 100
    retirement_401k_monthly = gross_monthly * contrib_pct

    # ── Taxable income (post-401k) ────────────────────────────────────────────
    taxable_annual = (gross_monthly - retirement_401k_monthly) * 12

    # ── Federal tax ───────────────────────────────────────────────────────────
    filing = income.get("filing_status") or "single"
    federal_annual  = calculate_federal_tax(taxable_annual, filing)
    federal_monthly = federal_annual / 12

    # ── FICA (employee side, on full gross) ───────────────────────────────────
    fica          = calculate_fica(salary)
    fica_monthly  = fica["total"] / 12

    # ── State tax (from location_data) ────────────────────────────────────────
    location   = get_location_data(supabase, income.get("city") or "", income.get("state_abbr") or "")
    state_rate = float((location or {}).get("state_income_tax_rate") or 0)
    state_monthly = (taxable_annual * state_rate) / 12

    # ── Health insurance ──────────────────────────────────────────────────────
    health_monthly = float(income.get("health_insurance_mo") or 0)

    # ── Take-home ─────────────────────────────────────────────────────────────
    take_home_monthly = max(
        0.0,
        gross_monthly
        - retirement_401k_monthly
        - federal_monthly
        - fica_monthly
        - state_monthly
        - health_monthly,
    )

    # ── Budget strategy ───────────────────────────────────────────────────────
    rpp            = float((location or {}).get("rpp_index") or 100.0)
    strategy_pref  = preferences.get("budget_strategy") or "auto"
    strategy       = resolve_budget_strategy(strategy_pref, rpp)
    split          = SPLITS[strategy]

    return {
        "gross_monthly":           round(gross_monthly, 2),
        "gross_annual":            round(salary, 2),
        "total_comp_annual":       round(
            salary
            + float(income.get("sign_on_bonus") or 0)
            + float(income.get("equity_per_year") or 0),
            2,
        ),
        "retirement_monthly":      round(retirement_401k_monthly, 2),
        "federal_tax_monthly":     round(federal_monthly, 2),
        "state_tax_monthly":       round(state_monthly, 2),
        "fica_monthly":            round(fica_monthly, 2),
        "fica_breakdown":          fica,
        "health_insurance_monthly": round(health_monthly, 2),
        "take_home_monthly":       round(take_home_monthly, 2),
        "budget_strategy":         strategy,
        "essential_monthly":       round(take_home_monthly * split["essential"], 2),
        "discretionary_monthly":   round(take_home_monthly * split["discretionary"], 2),
        "savings_monthly":         round(take_home_monthly * split["savings"], 2),
        "col_adjusted_take_home":  round(col_adjusted_take_home(take_home_monthly, rpp), 2),
        "rpp_index":               rpp,
        "location": {
            "city":         income.get("city"),
            "state_abbr":   income.get("state_abbr"),
            "avg_rent_1br": (location or {}).get("avg_rent_1br"),
            "avg_rent_2br": (location or {}).get("avg_rent_2br"),
            "avg_groceries": (location or {}).get("avg_groceries"),
            "avg_transport": (location or {}).get("avg_transport"),
        },
    }
