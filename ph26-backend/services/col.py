# Cost-of-Living helpers: DB lookups + budget strategy resolution

from typing import Any, Optional


def get_location_data(supabase: Any, city: str, state_abbr: str) -> Optional[dict]:
    """
    Try exact city+state match first.
    Falls back to a statewide row (city = '(Statewide)') if not found.
    Returns None if neither is available.
    """
    if city and state_abbr:
        result = (
            supabase.table("location_data")
            .select("*")
            .eq("city", city)
            .eq("state_abbr", state_abbr)
            .single()
            .execute()
        )
        if result.data:
            return result.data

    if state_abbr:
        fallback = (
            supabase.table("location_data")
            .select("*")
            .eq("state_abbr", state_abbr)
            .eq("city", "(Statewide)")
            .single()
            .execute()
        )
        if fallback.data:
            return fallback.data

    return None


def resolve_budget_strategy(strategy: str, rpp_index: Optional[float]) -> str:
    """
    Returns "60_30_10" or "50_30_20".
    "auto" picks 60_30_10 when rpp_index > 105 (high-cost area), else 50_30_20.
    Any other explicit value is passed through unchanged.
    """
    if strategy == "auto":
        return "60_30_10" if (rpp_index or 100.0) > 105 else "50_30_20"
    return strategy


def col_adjusted_take_home(take_home: float, rpp_index: Optional[float]) -> float:
    """
    Adjust nominal take-home for purchasing power.
    rpp_index = 100 means national average; > 100 means more expensive.
    """
    if not rpp_index:
        return take_home
    return take_home / (rpp_index / 100.0)
