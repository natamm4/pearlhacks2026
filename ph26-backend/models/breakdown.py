from base import BaseModel, UUID4
from typing import Optional


class LocationInfo(BaseModel):
    city:         Optional[str]   = None
    state_abbr:   Optional[str]   = None
    avg_rent_1br: Optional[float] = None
    avg_rent_2br: Optional[float] = None
    avg_groceries: Optional[float] = None
    avg_transport: Optional[float] = None


class FicaBreakdown(BaseModel):
    social_security: float
    medicare:        float
    total:           float


class BudgetBreakdown(BaseModel):
    gross_monthly:            float
    gross_annual:             float
    total_comp_annual:        float
    retirement_monthly:       float
    federal_tax_monthly:      float
    state_tax_monthly:        float
    fica_monthly:             float
    fica_breakdown:           FicaBreakdown
    health_insurance_monthly: float
    take_home_monthly:        float
    budget_strategy:          str       # "60_30_10" | "50_30_20"
    essential_monthly:        float
    discretionary_monthly:    float
    savings_monthly:          float
    col_adjusted_take_home:   float
    rpp_index:                float
    location:                 LocationInfo


class BreakdownResponse(BaseModel):
    profile_id: UUID4
    breakdown:  BudgetBreakdown
