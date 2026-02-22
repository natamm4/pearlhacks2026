from base import BaseModel, UUID4, Field, validator, Optional, datetime
from enums import BudgetStrategy

class SavingsSplit(BaseModel):
    emergency_fund: float = Field(ge=0, le=1)
    goals: float = Field(ge=0, le=1)
    freedom_fund: float = Field(ge=0, le=1)

    @validator("freedom_fund")
    def must_sum_to_one(cls, v, values):
        total = values.get("emergency_fund", 0) + values.get("goals", 0) + v
        if round(total, 4) != 1.0:
            raise ValueError("savings_split values must sum to 1.0")
        return v

class UserPreferencesUpdate(BaseModel):
    budget_strategy: Optional[BudgetStrategy] = None
    emergency_fund_months: Optional[int] = Field(default=None, ge=3, le=12)
    savings_split: Optional[SavingsSplit] = None
    retirement_target_age: Optional[int] = Field(default=None, ge=50, le=80)
    active_profile_id: Optional[UUID4] = None

class UserPreferencesResponse(BaseModel):
    user_id: UUID4
    updated_at: datetime
    budget_strategy: BudgetStrategy
    emergency_fund_months: int
    savings_split: SavingsSplit
    retirement_target_age: int
    active_profile_id: Optional[UUID4]

    class Config:
        from_attributes = True