// 2024 US Federal & State Tax Data
// State rates are simplified flat-rate approximations of effective marginal rates.
// Intended for planning estimation, not precise tax filing.

export type FilingStatus = "single" | "married_jointly";

export interface TaxBracket {
  min: number;
  max: number;      // Infinity for the top bracket
  rate: number;     // e.g. 0.22 for 22%
  baseTax: number;  // pre-accumulated tax at the bottom of this bracket
}

// 2024 Federal Income Tax Brackets
export const FEDERAL_BRACKETS_2024: Record<FilingStatus, TaxBracket[]> = {
  single: [
    { min: 0,        max: 11_600,   rate: 0.10, baseTax: 0         },
    { min: 11_600,   max: 47_150,   rate: 0.12, baseTax: 1_160     },
    { min: 47_150,   max: 100_525,  rate: 0.22, baseTax: 5_426     },
    { min: 100_525,  max: 191_950,  rate: 0.24, baseTax: 17_169    },
    { min: 191_950,  max: 243_725,  rate: 0.32, baseTax: 39_111    },
    { min: 243_725,  max: 609_350,  rate: 0.35, baseTax: 55_679    },
    { min: 609_350,  max: Infinity, rate: 0.37, baseTax: 183_648   },
  ],
  married_jointly: [
    { min: 0,        max: 23_200,   rate: 0.10, baseTax: 0         },
    { min: 23_200,   max: 94_300,   rate: 0.12, baseTax: 2_320     },
    { min: 94_300,   max: 201_050,  rate: 0.22, baseTax: 10_852    },
    { min: 201_050,  max: 383_900,  rate: 0.24, baseTax: 34_338    },
    { min: 383_900,  max: 487_450,  rate: 0.32, baseTax: 78_222    },
    { min: 487_450,  max: 731_200,  rate: 0.35, baseTax: 111_358   },
    { min: 731_200,  max: Infinity, rate: 0.37, baseTax: 196_670   },
  ],
};

// Flat-rate approximations of effective state income tax rates (2024)
// No-income-tax states: AK, FL, NV, NH, SD, TN, TX, WA, WY = 0.000
export const STATE_TAX_RATES: Record<string, number> = {
  AL: 0.050,
  AK: 0.000,
  AZ: 0.025,
  AR: 0.047,
  CA: 0.093,
  CO: 0.044,
  CT: 0.050,
  DE: 0.066,
  FL: 0.000,
  GA: 0.055,
  HI: 0.090,
  ID: 0.058,
  IL: 0.049,
  IN: 0.032,
  IA: 0.060,
  KS: 0.057,
  KY: 0.045,
  LA: 0.042,
  ME: 0.075,
  MD: 0.052,
  MA: 0.050,
  MI: 0.042,
  MN: 0.099,
  MS: 0.050,
  MO: 0.054,
  MT: 0.069,
  NE: 0.068,
  NV: 0.000,
  NH: 0.000,
  NJ: 0.097,
  NM: 0.059,
  NY: 0.109,
  NC: 0.045,
  ND: 0.029,
  OH: 0.040,
  OK: 0.050,
  OR: 0.099,
  PA: 0.031,
  RI: 0.060,
  SC: 0.070,
  SD: 0.000,
  TN: 0.000,
  TX: 0.000,
  UT: 0.047,
  VT: 0.087,
  VA: 0.058,
  WA: 0.000,
  WV: 0.065,
  WI: 0.053,
  WY: 0.000,
  DC: 0.085,
};

// FICA (Social Security + Medicare) — 2024 employee portion
export const SS_RATE = 0.062;
export const MEDICARE_RATE = 0.0145;
export const FICA_RATE = SS_RATE + MEDICARE_RATE; // 0.0765
export const SS_WAGE_BASE_2024 = 168_600; // Social Security applies only up to this amount
