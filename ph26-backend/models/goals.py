from base import BaseModel, UUID4, Field, Optional, datetime, date
from enums import GoalType

class GoalCreate(BaseModel):
    goal_type: GoalType
    label: str
    target_amount: float = Field(ge=0)
    target_date: Optional[date] = None
    priority: int = Field(default=0, ge=0)
    monthly_contrib: Optional[float] = Field(default=None, ge=0)

class GoalUpdate(BaseModel):
    goal_type: Optional[GoalType] = None
    label: Optional[str] = None
    target_amount: Optional[float] = Field(default=None, ge=0)
    target_date: Optional[date] = None
    priority: Optional[int] = Field(default=None, ge=0)
    monthly_contrib: Optional[float] = Field(default=None, ge=0)

class GoalResponse(GoalCreate):
    id: UUID4
    profile_id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True