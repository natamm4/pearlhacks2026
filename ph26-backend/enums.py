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
    emergency_fund = "emergency_fund"
    house = "house"
    car = "car"
    vacation = "vacation"
    freedom_fund = "freedom_fund"
    retirement = "retirement"
    custom = "custom"

class DebtType(str, Enum):
    student_loan = "student_loan"
    car = "car"
    credit_card = "credit_card"
    personal = "personal"
    other = "other"

class BudgetStrategy(str, Enum):
    auto = "auto"
    fifty_30_20 = "50_30_20"
    sixty_30_10 = "60_30_10"