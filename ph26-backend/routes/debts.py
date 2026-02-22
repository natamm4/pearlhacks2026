from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID
from models import DebtCreate, DebtUpdate, DebtResponse
from dependencies import get_current_user, get_supabase
from .utils import assert_profile_owned

router_debts = APIRouter(prefix="/financial-profiles/{profile_id}/debts", tags=["Debts"])

@router_debts.get("/", response_model=list[DebtResponse])
async def list_debts(
    profile_id: UUID,
    current_user=Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    assert_profile_owned(supabase, profile_id, current_user.id)
    result = supabase.table("debts").select("*").eq("profile_id", str(profile_id)).execute()
    return result.data

@router_debts.post("/", response_model=DebtResponse, status_code=status.HTTP_201_CREATED)
async def create_debt(
    profile_id: UUID,
    body: DebtCreate,
    current_user=Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    assert_profile_owned(supabase, profile_id, current_user.id)
    result = supabase.table("debts").insert({"profile_id": str(profile_id), **body.dict()}).execute()
    return result.data[0]

@router_debts.patch("/{debt_id}", response_model=DebtResponse)
async def update_debt(
    profile_id: UUID,
    debt_id: UUID,
    body: DebtUpdate,
    current_user=Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    assert_profile_owned(supabase, profile_id, current_user.id)
    result = (
        supabase.table("debts")
        .update(body.dict(exclude_none=True))
        .eq("id", str(debt_id))
        .eq("profile_id", str(profile_id))
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Debt not found")
    return result.data[0]

@router_debts.delete("/{debt_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_debt(
    profile_id: UUID,
    debt_id: UUID,
    current_user=Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    assert_profile_owned(supabase, profile_id, current_user.id)
    supabase.table("debts").delete().eq("id", str(debt_id)).eq("profile_id", str(profile_id)).execute()