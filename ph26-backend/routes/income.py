from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID
from models import IncomeDetailsUpsert, IncomeDetailsResponse
from dependencies import get_current_user, get_supabase
from .utils import assert_profile_owned

router_income = APIRouter(prefix="/financial-profiles/{profile_id}/income", tags=["Income"])

@router_income.get("/", response_model=IncomeDetailsResponse)
async def get_income_details(
    profile_id: UUID,
    current_user=Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    assert_profile_owned(supabase, profile_id, current_user.id)
    result = supabase.table("income_details").select("*").eq("profile_id", str(profile_id)).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Income details not found")
    return result.data

@router_income.put("/", response_model=IncomeDetailsResponse)
async def upsert_income_details(
    profile_id: UUID,
    body: IncomeDetailsUpsert,
    current_user=Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    assert_profile_owned(supabase, profile_id, current_user.id)
    result = (
        supabase.table("income_details")
        .upsert({"profile_id": str(profile_id), **body.dict()})
        .execute()
    )
    return result.data[0]
