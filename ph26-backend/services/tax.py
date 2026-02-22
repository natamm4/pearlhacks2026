# 2024 US federal income tax calculation (inline constants — no DB round-trip)

FEDERAL_BRACKETS_2024: dict[str, list[tuple[float, float, float]]] = {
    "single": [
        (0,        11_600,        0.10),
        (11_600,   47_150,        0.12),
        (47_150,   100_525,       0.22),
        (100_525,  191_950,       0.24),
        (191_950,  243_725,       0.32),
        (243_725,  609_350,       0.35),
        (609_350,  float("inf"), 0.37),
    ],
    "married_joint": [
        (0,        23_200,        0.10),
        (23_200,   94_300,        0.12),
        (94_300,   201_050,       0.22),
        (201_050,  383_900,       0.24),
        (383_900,  487_450,       0.32),
        (487_450,  731_200,       0.35),
        (731_200,  float("inf"), 0.37),
    ],
}

STANDARD_DEDUCTIONS_2024: dict[str, float] = {
    "single":        14_600.0,
    "married_joint": 29_200.0,
}

SS_RATE        = 0.062
MEDICARE_RATE  = 0.0145
SS_WAGE_BASE   = 168_600.0


def calculate_federal_tax(gross_annual: float, filing_status: str) -> float:
    """Progressive federal income tax after standard deduction."""
    filing_status = filing_status or "single"
    std_ded = STANDARD_DEDUCTIONS_2024.get(filing_status, 14_600.0)
    agi = max(0.0, gross_annual - std_ded)
    brackets = FEDERAL_BRACKETS_2024.get(filing_status, FEDERAL_BRACKETS_2024["single"])
    tax = 0.0
    for low, high, rate in brackets:
        if agi <= low:
            break
        tax += (min(agi, high) - low) * rate
    return tax


def calculate_fica(gross_annual: float) -> dict:
    """Employee-side FICA: Social Security (capped) + Medicare (uncapped)."""
    ss = min(gross_annual, SS_WAGE_BASE) * SS_RATE
    mc = gross_annual * MEDICARE_RATE
    return {
        "social_security": round(ss, 2),
        "medicare":        round(mc, 2),
        "total":           round(ss + mc, 2),
    }
