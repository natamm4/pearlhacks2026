from fastapi import APIRouter, Depends, HTTPException
from models import UserPreferencesUpdate, UserPreferencesResponse
from dependencies import get_current_user, get_supabase

router_preferences = APIRouter(prefix="/preferences", tags=["Preferences"])

@router_preferences.get("/", response_model=UserPreferencesResponse)
async def get_preferences(
    current_user=Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    result = supabase.table("user_preferences").select("*").eq("user_id", current_user.id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Preferences not found")
    return result.data

@router_preferences.patch("/", response_model=UserPreferencesResponse)
async def update_preferences(
    body: UserPreferencesUpdate,
    current_user=Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    updates = body.dict(exclude_none=True)

    if "active_profile_id" in updates:
        supabase.table("financial_profiles").update({"is_active": False}).eq("user_id", current_user.id).execute()
        supabase.table("financial_profiles").update({"is_active": True}).eq("id", str(updates["active_profile_id"])).eq("user_id", current_user.id).execute()

    if "savings_split" in updates:
        updates["savings_split"] = body.savings_split.dict()

    result = (
        supabase.table("user_preferences")
        .update(updates)
        .eq("user_id", current_user.id)
        .execute()
    )
    return result.data[0]
