from base import BaseModel, UUID4, Field, Optional, datetime
from enums import DebtType

class DebtCreate(BaseModel):
    debt_type: DebtType
    label: str
    balance: float = Field(ge=0)
    interest_rate: Optional[float] = Field(default=None, ge=0, le=100)
    monthly_payment: Optional[float] = Field(default=None, ge=0)

class DebtUpdate(BaseModel):
    debt_type: Optional[DebtType] = None
    label: Optional[str] = None
    balance: Optional[float] = Field(default=None, ge=0)
    interest_rate: Optional[float] = Field(default=None, ge=0, le=100)
    monthly_payment: Optional[float] = Field(default=None, ge=0)

class DebtResponse(DebtCreate):
    id: UUID4
    profile_id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
