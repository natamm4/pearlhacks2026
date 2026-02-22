from typing import Any, Optional
from uuid import UUID

def get_my_profile(supabase: Any, user_id: str) -> Optional[dict]:
    result = supabase.table("profiles").select("*").eq("id", user_id).single().execute()
    return result.data


def update_my_profile(supabase: Any, user_id: str, updates: dict) -> Optional[dict]:
    result = (
        supabase.table("profiles")
        .update(updates)
        .eq("id", user_id)
        .execute()
    )
    return result.data[0] if result.data else None
