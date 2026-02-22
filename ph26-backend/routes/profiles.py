from fastapi import APIRouter, Depends, HTTPException
from models import ProfileUpdate, ProfileResponse
from dependencies import get_current_user, get_supabase

router_profiles = APIRouter(prefix="/profiles", tags=["Profiles"])

@router_profiles.get("/me", response_model=ProfileResponse)
async def get_my_profile(
    current_user=Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    result = supabase.table("profiles").select("*").eq("id", current_user.id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return result.data

@router_profiles.patch("/me", response_model=ProfileResponse)
async def update_my_profile(
    body: ProfileUpdate,
    current_user=Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    result = (
        supabase.table("profiles")
        .update(body.dict(exclude_none=True))
        .eq("id", current_user.id)
        .execute()
    )
    return result.data[0]
