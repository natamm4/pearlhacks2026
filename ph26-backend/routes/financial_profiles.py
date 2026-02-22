from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID
from typing import Optional
from models import FinancialProfileCreate, FinancialProfileUpdate, FinancialProfileResponse
from dependencies import get_current_user, get_supabase

router_financial_profiles = APIRouter(prefix="/financial-profiles", tags=["Financial Profiles"])

@router_financial_profiles.get("/", response_model=list[FinancialProfileResponse])
async def list_financial_profiles(
    current_user=Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    result = (
        supabase.table("financial_profiles")
        .select("*")
        .eq("user_id", current_user.id)
        .order("created_at", desc=False)
        .execute()
    )
    return result.data

@router_financial_profiles.post("/", response_model=FinancialProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_financial_profile(
    body: FinancialProfileCreate,
    current_user=Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    result = (
        supabase.table("financial_profiles")
        .insert({"user_id": current_user.id, **body.dict()})
        .execute()
    )
    return result.data[0]

@router_financial_profiles.get("/{profile_id}", response_model=FinancialProfileResponse)
async def get_financial_profile(
    profile_id: UUID,
    current_user=Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    result = (
        supabase.table("financial_profiles")
        .select("*")
        .eq("id", str(profile_id))
        .eq("user_id", current_user.id)
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Financial profile not found")
    return result.data

@router_financial_profiles.patch("/{profile_id}", response_model=FinancialProfileResponse)
async def update_financial_profile(
    profile_id: UUID,
    body: FinancialProfileUpdate,
    current_user=Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    result = (
        supabase.table("financial_profiles")
        .update(body.dict(exclude_none=True))
        .eq("id", str(profile_id))
        .eq("user_id", current_user.id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Financial profile not found")
    return result.data[0]

@router_financial_profiles.delete("/{profile_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_financial_profile(
    profile_id: UUID,
    current_user=Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    supabase.table("financial_profiles").delete().eq("id", str(profile_id)).eq("user_id", current_user.id).execute()

@router_financial_profiles.post("/{profile_id}/activate", response_model=FinancialProfileResponse)
async def activate_financial_profile(
    profile_id: UUID,
    current_user=Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    supabase.table("financial_profiles").update({"is_active": False}).eq("user_id", current_user.id).execute()
    result = (
        supabase.table("financial_profiles")
        .update({"is_active": True})
        .eq("id", str(profile_id))
        .eq("user_id", current_user.id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Financial profile not found")
    supabase.table("user_preferences").update({"active_profile_id": str(profile_id)}).eq("user_id", current_user.id).execute()
    return result.data[0]

@router_financial_profiles.post("/{profile_id}/duplicate", response_model=FinancialProfileResponse, status_code=status.HTTP_201_CREATED)
async def duplicate_financial_profile(
    profile_id: UUID,
    label: Optional[str] = None,
    current_user=Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    source = (
        supabase.table("financial_profiles")
        .select("*, income_details(*), debts(*), goals(*)")
        .eq("id", str(profile_id))
        .eq("user_id", current_user.id)
        .single()
        .execute()
    )
    if not source.data:
        raise HTTPException(status_code=404, detail="Financial profile not found")

    new_profile = (
        supabase.table("financial_profiles")
        .insert({
            "user_id": current_user.id,
            "label": label or f"{source.data['label']} (Copy)",
            "profile_type": "scenario",
            "is_active": False,
        })
        .execute()
    )
    new_id = new_profile.data[0]["id"]

    if source.data.get("income_details"):
        income = {k: v for k, v in source.data["income_details"].items() if k not in ("id", "profile_id", "updated_at")}
        supabase.table("income_details").insert({"profile_id": new_id, **income}).execute()

    for debt in source.data.get("debts", []):
        debt_copy = {k: v for k, v in debt.items() if k not in ("id", "profile_id", "created_at", "updated_at")}
        supabase.table("debts").insert({"profile_id": new_id, **debt_copy}).execute()

    for goal in source.data.get("goals", []):
        goal_copy = {k: v for k, v in goal.items() if k not in ("id", "profile_id", "created_at", "updated_at")}
        supabase.table("goals").insert({"profile_id": new_id, **goal_copy}).execute()

    return new_profile.data[0]
