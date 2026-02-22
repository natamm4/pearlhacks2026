from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID

from models.comparison import OfferComparisonResponse
from dependencies import get_current_user, get_supabase
from routes.utils import assert_profile_owned
from services.budget import calculate_breakdown

router_comparison = APIRouter(prefix="/compare", tags=["Comparison"])


@router_comparison.get("/", response_model=OfferComparisonResponse)
def compare_offers(
    a: UUID,
    b: UUID,
    current_user=Depends(get_current_user),
    supabase=Depends(get_supabase),
):
    assert_profile_owned(supabase, a, current_user.id)
    assert_profile_owned(supabase, b, current_user.id)

    prefs_result = (
        supabase.table("user_preferences")
        .select("*")
        .eq("user_id", current_user.id)
        .single()
        .execute()
    )
    prefs = prefs_result.data or {}

    income_a_result = (
        supabase.table("income_details")
        .select("*")
        .eq("profile_id", str(a))
        .single()
        .execute()
    )
    if not income_a_result.data:
        raise HTTPException(status_code=404, detail=f"No income details for profile {a}")

    income_b_result = (
        supabase.table("income_details")
        .select("*")
        .eq("profile_id", str(b))
        .single()
        .execute()
    )
    if not income_b_result.data:
        raise HTTPException(status_code=404, detail=f"No income details for profile {b}")

    bd_a = calculate_breakdown(income_a_result.data, prefs, supabase)
    bd_b = calculate_breakdown(income_b_result.data, prefs, supabase)

    if "error" in bd_a:
        raise HTTPException(status_code=422, detail=f"Profile A: {bd_a['error']}")
    if "error" in bd_b:
        raise HTTPException(status_code=422, detail=f"Profile B: {bd_b['error']}")

    col_a = bd_a["col_adjusted_take_home"]
    col_b = bd_b["col_adjusted_take_home"]
    if col_a > col_b:
        winner = "a"
    elif col_b > col_a:
        winner = "b"
    else:
        winner = "tie"

    return {
        "offer_a":                  bd_a,
        "offer_b":                  bd_b,
        "col_adjusted_take_home_a": col_a,
        "col_adjusted_take_home_b": col_b,
        "total_comp_a":             bd_a["total_comp_annual"],
        "total_comp_b":             bd_b["total_comp_annual"],
        "winner":                   winner,
    }
