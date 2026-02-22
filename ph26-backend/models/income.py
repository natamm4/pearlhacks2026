from ph26_backend.base import BaseModel, UUID4, Field, Optional, datetime
from ph26_backend.enums import PayFrequency


class IncomeDetailsUpsert(BaseModel):
    # Core income
    base_salary: float = Field(default=0, ge=0)
    pay_frequency: PayFrequency = PayFrequency.biweekly

    # Additional comp — all optional
    sign_on_bonus: Optional[float] = Field(default=None, ge=0)
    annual_bonus_pct: Optional[float] = Field(default=None, ge=0, le=100)
    equity_per_year: Optional[float] = Field(default=None, ge=0)
    additional_investments: Optional[float] = Field(default=None, ge=0)  # personal monthly investments

    # 401k
    four01k_contribution_pct: float = Field(default=0, ge=0, le=100)
    four01k_balance: float = Field(default=0, ge=0)
    four01k_match_pct: float = Field(default=0, ge=0, le=100)
    four01k_match_cap_pct: float = Field(default=0, ge=0, le=100)
    health_insurance_mo: float = Field(default=0, ge=0)

    # Roth IRA
    roth_ira_annual_contrib: float = Field(default=0, ge=0)
    roth_ira_balance: float = Field(default=0, ge=0)

    # Location
    city: Optional[str] = None
    state_abbr: Optional[str] = Field(default=None, min_length=2, max_length=2)
    geo_fips: Optional[str] = None

class IncomeDetailsResponse(IncomeDetailsUpsert):
    id: UUID4
    profile_id: UUID4
    updated_at: datetime
    
    class Config:
        from_attributes = True
