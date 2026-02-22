from base import BaseModel, UUID4, Optional, datetime
from pydantic import Field
from enums import DebtType


class DebtCreate(BaseModel):
    # Use whatever columns you actually have in Supabase.
    # These are the common ones based on your earlier schema screenshot + route usage.
    label: str = Field(..., min_length=1)
    debt_type: DebtType  # e.g. "student_loan", "credit_card"
    principal: float = Field(..., ge=0)
    interest_rate: Optional[float] = Field(default=None, ge=0)  # APR percent, e.g. 6.5
    minimum_payment: Optional[float] = Field(default=None, ge=0)


class DebtUpdate(BaseModel):
    # all optional for PATCH
    label: Optional[str] = None
    debt_type: Optional[str] = None
    principal: Optional[float] = Field(default=None, ge=0)
    interest_rate: Optional[float] = Field(default=None, ge=0)
    minimum_payment: Optional[float] = Field(default=None, ge=0)


class DebtResponse(BaseModel):
    id: UUID4
    profile_id: UUID4

    label: str
    debt_type: Optional[str] = None
    principal: float
    interest_rate: Optional[float] = None
    minimum_payment: Optional[float] = None

    # Only include these if your debts table actually has them
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True