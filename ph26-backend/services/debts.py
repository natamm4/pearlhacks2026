from typing import Any, List, Optional
from uuid import UUID

def list_debts(supabase: Any, profile_id: UUID) -> List[dict]:
    result = supabase.table("debts").select("*").eq("profile_id", str(profile_id)).execute()
    return result.data


def create_debt(supabase: Any, profile_id: UUID, body: dict) -> dict:
    result = supabase.table("debts").insert({"profile_id": str(profile_id), **body}).execute()
    return result.data[0]


def update_debt(supabase: Any, profile_id: UUID, debt_id: UUID, updates: dict) -> Optional[dict]:
    result = (
        supabase.table("debts")
        .update(updates)
        .eq("id", str(debt_id))
        .eq("profile_id", str(profile_id))
        .execute()
    )
    return result.data[0] if result.data else None


def delete_debt(supabase: Any, profile_id: UUID, debt_id: UUID) -> None:
    supabase.table("debts").delete().eq("id", str(debt_id)).eq("profile_id", str(profile_id)).execute()
