from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID

from models.breakdown import BreakdownResponse
from dependencies import get_current_user, get_supabase
from routes.utils import assert_profile_owned
from services.budget import calculate_breakdown

router_breakdown = APIRouter(prefix="/financial-profiles", tags=["Breakdown"])


@router_breakdown.get("/{profile_id}/breakdown", response_model=BreakdownResponse)
def get_breakdown(
    profile_id: UUID,
    current_user=Depends(get_current_user),
    supabase=Depends(get_supabase),
):
    assert_profile_owned(supabase, profile_id, current_user.id)

    income_result = (
        supabase.table("income_details")
        .select("*")
        .eq("profile_id", str(profile_id))
        .single()
        .execute()
    )
    if not income_result.data:
        raise HTTPException(status_code=404, detail="No income details for this profile")

    prefs_result = (
        supabase.table("user_preferences")
        .select("*")
        .eq("user_id", current_user.id)
        .single()
        .execute()
    )

    breakdown = calculate_breakdown(
        income_result.data,
        prefs_result.data or {},
        supabase,
    )

    if "error" in breakdown:
        raise HTTPException(status_code=422, detail=breakdown["error"])

    return {"profile_id": profile_id, "breakdown": breakdown}
