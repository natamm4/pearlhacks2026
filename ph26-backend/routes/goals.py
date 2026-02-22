from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID
from models import GoalCreate, GoalUpdate, GoalResponse
from dependencies import get_current_user, get_supabase
from .utils import assert_profile_owned

router_goals = APIRouter(prefix="/financial-profiles/{profile_id}/goals", tags=["Goals"])

@router_goals.get("/", response_model=list[GoalResponse])
async def list_goals(
    profile_id: UUID,
    current_user=Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    assert_profile_owned(supabase, profile_id, current_user.id)
    result = (
        supabase.table("goals")
        .select("*")
        .eq("profile_id", str(profile_id))
        .order("priority", desc=False)
        .execute()
    )
    return result.data

@router_goals.post("/", response_model=GoalResponse, status_code=status.HTTP_201_CREATED)
async def create_goal(
    profile_id: UUID,
    body: GoalCreate,
    current_user=Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    assert_profile_owned(supabase, profile_id, current_user.id)
    result = supabase.table("goals").insert({"profile_id": str(profile_id), **body.dict()}).execute()
    return result.data[0]

@router_goals.patch("/{goal_id}", response_model=GoalResponse)
async def update_goal(
    profile_id: UUID,
    goal_id: UUID,
    body: GoalUpdate,
    current_user=Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    assert_profile_owned(supabase, profile_id, current_user.id)
    result = (
        supabase.table("goals")
        .update(body.dict(exclude_none=True))
        .eq("id", str(goal_id))
        .eq("profile_id", str(profile_id))
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Goal not found")
    return result.data[0]

@router_goals.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_goal(
    profile_id: UUID,
    goal_id: UUID,
    current_user=Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    assert_profile_owned(supabase, profile_id, current_user.id)
    supabase.table("goals").delete().eq("id", str(goal_id)).eq("profile_id", str(profile_id)).execute()