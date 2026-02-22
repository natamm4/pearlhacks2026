from fastapi import HTTPException
from uuid import UUID

def assert_profile_owned(supabase, profile_id: UUID, user_id: str):
    result = (
        supabase.table("financial_profiles")
        .select("id")
        .eq("id", str(profile_id))
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Financial profile not found")