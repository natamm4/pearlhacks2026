from typing import Any


def search_locations(supabase: Any, q: str, limit: int = 10) -> list[dict]:
    """Full-text city search — returns lightweight rows for autocomplete."""
    result = (
        supabase.table("location_data")
        .select("city, state_abbr, rpp_index")
        .ilike("city", f"%{q}%")
        .limit(limit)
        .execute()
    )
    return result.data or []


def get_location(supabase: Any, city: str, state_abbr: str) -> dict | None:
    """Return a full location_data row by city + state."""
    result = (
        supabase.table("location_data")
        .select("*")
        .eq("city", city)
        .eq("state_abbr", state_abbr)
        .single()
        .execute()
    )
    return result.data
