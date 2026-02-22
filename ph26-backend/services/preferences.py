from typing import Any, Optional
from uuid import UUID

def get_preferences(supabase: Any, user_id: str) -> Optional[dict]:
    result = supabase.table("user_preferences").select("*").eq("user_id", user_id).single().execute()
    return result.data


def update_preferences(supabase: Any, user_id: str, updates: dict) -> Optional[dict]:
    # handle active_profile_id change: toggle is_active on profiles
    if "active_profile_id" in updates:
        supabase.table("financial_profiles").update({"is_active": False}).eq("user_id", user_id).execute()
        supabase.table("financial_profiles").update({"is_active": True}).eq("id", str(updates["active_profile_id"])).eq("user_id", user_id).execute()

    # handle savings_split dict conversion if passed as object
    if "savings_split" in updates and hasattr(updates["savings_split"], "dict"):
        updates["savings_split"] = updates["savings_split"].dict()

    result = (
        supabase.table("user_preferences")
        .update(updates)
        .eq("user_id", user_id)
        .execute()
    )
    return result.data[0] if result.data else None
