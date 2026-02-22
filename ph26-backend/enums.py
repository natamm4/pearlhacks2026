from enum import Enum

class PayFrequency(str, Enum):
    WEEKLY = "weekly"
    BIWEEKLY = "biweekly"
    SEMIMONTHLY = "semimonthly"
    MONTHLY = "monthly"

class ProfileType(str, Enum):
    current_job = "current_job"
    offer = "offer"
    scenario = "scenario"

class GoalType(str, Enum):
    retirement = "retirement"
    home_purchase = "home_purchase"
    education = "education"
    other = "other"

class BudgetStrategy(str, Enum):
    balanced = "balanced"
    aggressive = "aggressive"
    conservative = "conservative"