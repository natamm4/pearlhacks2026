from fastapi import APIRouter, Depends, HTTPException
from models import ProfileUpdate, ProfileResponse
from dependencies import get_current_user, get_supabase
from services.profiles import ensure_user_records

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


@router_profiles.post("/ensure")
async def ensure_my_user_records(
    current_user=Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    # Create any missing rows for this authenticated user in a server-side, trusted context
    res = ensure_user_records(supabase, current_user.id)
    return res
