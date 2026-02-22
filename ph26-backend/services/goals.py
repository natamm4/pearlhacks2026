from typing import Any, List, Optional
from uuid import UUID

def list_goals(supabase: Any, profile_id: UUID) -> List[dict]:
    result = (
        supabase.table("goals")
        .select("*")
        .eq("profile_id", str(profile_id))
        .order("priority", desc=False)
        .execute()
    )
    return result.data


def create_goal(supabase: Any, profile_id: UUID, body: dict) -> dict:
    result = supabase.table("goals").insert({"profile_id": str(profile_id), **body}).execute()
    return result.data[0]


def update_goal(supabase: Any, profile_id: UUID, goal_id: UUID, updates: dict) -> Optional[dict]:
    result = (
        supabase.table("goals")
        .update(updates)
        .eq("id", str(goal_id))
        .eq("profile_id", str(profile_id))
        .execute()
    )
    return result.data[0] if result.data else None


def delete_goal(supabase: Any, profile_id: UUID, goal_id: UUID) -> None:
    supabase.table("goals").delete().eq("id", str(goal_id)).eq("profile_id", str(profile_id)).execute()
