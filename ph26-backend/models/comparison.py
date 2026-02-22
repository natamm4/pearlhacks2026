from base import BaseModel
from models.breakdown import BudgetBreakdown


class OfferComparisonResponse(BaseModel):
    offer_a:                  BudgetBreakdown
    offer_b:                  BudgetBreakdown
    col_adjusted_take_home_a: float
    col_adjusted_take_home_b: float
    total_comp_a:             float
    total_comp_b:             float
    winner:                   str   # "a" | "b" | "tie"
