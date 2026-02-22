from typing import Any, List, Optional
from uuid import UUID

def list_financial_profiles(supabase: Any, user_id: str) -> List[dict]:
    result = (
        supabase.table("financial_profiles")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=False)
        .execute()
    )
    return result.data


def create_financial_profile(supabase: Any, user_id: str, body: dict) -> dict:
    result = (
        supabase.table("financial_profiles")
        .insert({"user_id": user_id, **body})
        .execute()
    )
    return result.data[0]


def get_financial_profile(supabase: Any, profile_id: UUID, user_id: str) -> Optional[dict]:
    result = (
        supabase.table("financial_profiles")
        .select("*")
        .eq("id", str(profile_id))
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    return result.data


def update_financial_profile(supabase: Any, profile_id: UUID, user_id: str, updates: dict) -> Optional[dict]:
    result = (
        supabase.table("financial_profiles")
        .update(updates)
        .eq("id", str(profile_id))
        .eq("user_id", user_id)
        .execute()
    )
    return result.data[0] if result.data else None


def delete_financial_profile(supabase: Any, profile_id: UUID, user_id: str) -> None:
    supabase.table("financial_profiles").delete().eq("id", str(profile_id)).eq("user_id", user_id).execute()


def activate_financial_profile(supabase: Any, profile_id: UUID, user_id: str) -> Optional[dict]:
    # deactivate others
    supabase.table("financial_profiles").update({"is_active": False}).eq("user_id", user_id).execute()
    result = (
        supabase.table("financial_profiles")
        .update({"is_active": True})
        .eq("id", str(profile_id))
        .eq("user_id", user_id)
        .execute()
    )
    if not result.data:
        return None
    supabase.table("user_preferences").update({"active_profile_id": str(profile_id)}).eq("user_id", user_id).execute()
    return result.data[0]


def duplicate_financial_profile(supabase: Any, profile_id: UUID, user_id: str, label: Optional[str] = None) -> Optional[dict]:
    source = (
        supabase.table("financial_profiles")
        .select("*, income_details(*), debts(*), goals(*)")
        .eq("id", str(profile_id))
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    if not source.data:
        return None

    new_profile = (
        supabase.table("financial_profiles")
        .insert({
            "user_id": user_id,
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
