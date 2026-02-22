from typing import Any, Optional
from uuid import UUID

def get_income_details(supabase: Any, profile_id: UUID) -> Optional[dict]:
    result = supabase.table("income_details").select("*").eq("profile_id", str(profile_id)).single().execute()
    return result.data


def upsert_income_details(supabase: Any, profile_id: UUID, body: dict) -> dict:
    result = (
        supabase.table("income_details")
        .upsert({"profile_id": str(profile_id), **body})
        .execute()
    )
    return result.data[0]
