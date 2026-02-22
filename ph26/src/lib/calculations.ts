import {
  FilingStatus,
  FEDERAL_BRACKETS_2024,
  STATE_TAX_RATES,
  SS_RATE,
  MEDICARE_RATE,
  SS_WAGE_BASE_2024,
} from "./taxData";
import { getCOLTier, COL_SPLITS, COLTier } from "./colData";

// ─── Input ────────────────────────────────────────────────────────────────────

export interface FinancialInput {
  annualSalary: number;
  payFrequency: "weekly" | "biweekly" | "semimonthly" | "monthly";
  signOnBonus: number;
  equityPerYear: number;
  stateCode: string;
  filingStatus: FilingStatus;
  employee401kPct: number;   // 0–1, e.g. 0.15 for 15%
  healthPremiumMonthly: number;
}

// ─── Tax breakdown (monthly + annual + effective rates) ───────────────────────

export interface TaxBreakdown {
  federalMonthly: number;
  stateMonthly: number;
  ficaMonthly: number;
  totalMonthly: number;
  federalAnnual: number;
  stateAnnual: number;
  ficaAnnual: number;
  totalAnnual: number;
  effectiveFederalRate: number;
  effectiveStateRate: number;
  effectiveTotalRate: number;
}

// ─── Full output ──────────────────────────────────────────────────────────────

export interface FinancialResult {
  // Monthly figures
  grossMonthly: number;
  retirementMonthly: number;         // 15% of gross (fixed recommendation)
  contribution401kMonthly: number;   // based on employee401kPct (for savings tab slider)
  taxableMonthly: number;            // gross - retirement
  taxes: TaxBreakdown;
  healthPremiumMonthly: number;
  // take-home = gross - retirement - taxes (health folded into expenses)
  takeHomeMonthly: number;
  // actual bank take-home = gross - retirement - taxes - health (for summary display)
  actualTakeHomeMonthly: number;

  // Annual
  grossAnnual: number;
  totalCompAnnual: number;           // salary + signOn + equity

  // COL / budget split
  colTier: COLTier;
  splitLabel: string;                // "60/30/10" | "50/30/20"
  essentialMonthly: number;          // takeHome × essential%
  discretionaryMonthly: number;      // takeHome × 30%
  savingsMonthly: number;            // takeHome × savings%
  expensesMonthly: number;           // essential + discretionary (one "Expenses" bucket for pie)

  // Summary page projections (based on employee's actual 401k contribution)
  yearlySavings: number;
  emergencyFund6Mo: number;
  fiveYearSavings: number;
  retirementIn10: number;
  retirementIn20: number;
  retirementIn30: number;
  retirementIn40: number;
  retirementContributions: number;   // total contributions over 40 years
  retirementGrowth: number;          // total growth over 40 years

  // Pie chart — 4 slices summing to grossMonthly
  pieData: Array<{ name: string; value: number; color: string }>;
}

// ─── Core calculation functions ───────────────────────────────────────────────

export function calculateFederalTax(taxableAnnual: number, filingStatus: FilingStatus): number {
  if (taxableAnnual <= 0) return 0;
  const brackets = FEDERAL_BRACKETS_2024[filingStatus];
  for (const bracket of brackets) {
    if (taxableAnnual <= bracket.max) {
      return bracket.baseTax + (taxableAnnual - bracket.min) * bracket.rate;
    }
  }
  return 0;
}

export function calculateFICA(grossAnnual: number): number {
  // Social Security applies only up to the wage base; Medicare is uncapped
  const ssWages = Math.min(grossAnnual, SS_WAGE_BASE_2024);
  return ssWages * SS_RATE + grossAnnual * MEDICARE_RATE;
}

// Future value of monthly annuity at 7% annual return (compounded monthly)
// FV = PMT × ((1 + r)^n − 1) / r
export function projectRetirement(monthlyContribution: number, years: number): number {
  if (monthlyContribution <= 0 || years <= 0) return 0;
  const r = 0.07 / 12; // monthly rate
  const n = years * 12;
  return monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
}

// ─── Master calculation function ──────────────────────────────────────────────

export function calculateFinancials(input: FinancialInput): FinancialResult {
  const { annualSalary, filingStatus, stateCode, employee401kPct, healthPremiumMonthly } = input;

  if (!annualSalary || annualSalary <= 0) return ZERO_RESULT;

  const grossMonthly = annualSalary / 12;
  const grossAnnual = annualSalary;

  // Retirement: fixed 15% of gross (pre-tax, the recommended amount for the pie chart)
  const retirementMonthly = grossMonthly * 0.15;
  const taxableMonthly = grossMonthly - retirementMonthly;
  const taxableAnnual = taxableMonthly * 12;

  // Federal tax — on taxable income (post-retirement)
  const federalAnnual = calculateFederalTax(taxableAnnual, filingStatus);
  const federalMonthly = federalAnnual / 12;

  // FICA — on full gross wages (401k and retirement don't reduce FICA)
  const ficaAnnual = calculateFICA(grossAnnual);
  const ficaMonthly = ficaAnnual / 12;

  // State tax — on taxable income (post-retirement)
  const stateRate = STATE_TAX_RATES[stateCode] ?? 0;
  const stateAnnual = taxableAnnual * stateRate;
  const stateMonthly = stateAnnual / 12;

  const totalTaxAnnual = federalAnnual + ficaAnnual + stateAnnual;
  const totalTaxMonthly = totalTaxAnnual / 12;

  const taxes: TaxBreakdown = {
    federalMonthly, stateMonthly, ficaMonthly, totalMonthly: totalTaxMonthly,
    federalAnnual, stateAnnual, ficaAnnual, totalAnnual: totalTaxAnnual,
    effectiveFederalRate: federalAnnual / grossAnnual,
    effectiveStateRate: stateAnnual / grossAnnual,
    effectiveTotalRate: totalTaxAnnual / grossAnnual,
  };

  // take-home for pie chart (health is folded into Expenses bucket)
  const takeHomeMonthly = Math.max(0, grossMonthly - retirementMonthly - totalTaxMonthly);

  // actual take-home to bank account (subtracts health premium)
  const actualTakeHomeMonthly = Math.max(0, takeHomeMonthly - healthPremiumMonthly);

  // COL-based budget split applied to take-home
  const colTier = getCOLTier(stateCode);
  const split = COL_SPLITS[colTier];
  const splitLabel = colTier === "high" ? "60/30/10" : "50/30/20";

  const essentialMonthly = takeHomeMonthly * split.essential;
  const discretionaryMonthly = takeHomeMonthly * split.discretionary;
  const savingsMonthly = takeHomeMonthly * split.savings;
  const expensesMonthly = essentialMonthly + discretionaryMonthly; // one combined "Expenses" pie slice

  // Projections (based on employee401kPct, with employer match capped at 6%)
  const contribution401kMonthly = grossMonthly * employee401kPct;
  const employerMatchPct = Math.min(employee401kPct, 0.06);
  const employerMatchMonthly = grossMonthly * employerMatchPct;
  const totalMonthly401k = contribution401kMonthly + employerMatchMonthly;

  const yearlySavings = savingsMonthly * 12;
  const emergencyFund6Mo = actualTakeHomeMonthly * 6;
  const fiveYearSavings = savingsMonthly * 60;

  const retirementIn10 = projectRetirement(totalMonthly401k, 10);
  const retirementIn20 = projectRetirement(totalMonthly401k, 20);
  const retirementIn30 = projectRetirement(totalMonthly401k, 30);
  const retirementIn40 = projectRetirement(totalMonthly401k, 40);
  const retirementContributions = totalMonthly401k * 12 * 40;
  const retirementGrowth = Math.max(0, retirementIn40 - retirementContributions);

  const totalCompAnnual = grossAnnual + input.signOnBonus + input.equityPerYear;

  // Pie: 4 slices summing to grossMonthly
  const pieData = [
    { name: "Taxes",      value: Math.max(0, totalTaxMonthly),   color: "#e11d48" },
    { name: "Savings",    value: Math.max(0, savingsMonthly),     color: "#16a34a" },
    { name: "Expenses",   value: Math.max(0, expensesMonthly),    color: "#2563eb" },
    { name: "Retirement", value: Math.max(0, retirementMonthly),  color: "#ca8a04" },
  ];

  return {
    grossMonthly, retirementMonthly, contribution401kMonthly,
    taxableMonthly, taxes, healthPremiumMonthly,
    takeHomeMonthly, actualTakeHomeMonthly,
    grossAnnual, totalCompAnnual,
    colTier, splitLabel,
    essentialMonthly, discretionaryMonthly, savingsMonthly, expensesMonthly,
    yearlySavings, emergencyFund6Mo, fiveYearSavings,
    retirementIn10, retirementIn20, retirementIn30, retirementIn40,
    retirementContributions, retirementGrowth,
    pieData,
  };
}

// ─── Zero state (before user enters salary) ───────────────────────────────────

export const ZERO_RESULT: FinancialResult = {
  grossMonthly: 0, retirementMonthly: 0, contribution401kMonthly: 0,
  taxableMonthly: 0,
  taxes: {
    federalMonthly: 0, stateMonthly: 0, ficaMonthly: 0, totalMonthly: 0,
    federalAnnual: 0, stateAnnual: 0, ficaAnnual: 0, totalAnnual: 0,
    effectiveFederalRate: 0, effectiveStateRate: 0, effectiveTotalRate: 0,
  },
  healthPremiumMonthly: 0,
  takeHomeMonthly: 0, actualTakeHomeMonthly: 0,
  grossAnnual: 0, totalCompAnnual: 0,
  colTier: "standard", splitLabel: "50/30/20",
  essentialMonthly: 0, discretionaryMonthly: 0, savingsMonthly: 0, expensesMonthly: 0,
  yearlySavings: 0, emergencyFund6Mo: 0, fiveYearSavings: 0,
  retirementIn10: 0, retirementIn20: 0, retirementIn30: 0, retirementIn40: 0,
  retirementContributions: 0, retirementGrowth: 0,
  pieData: [],
};

// ─── Formatters ───────────────────────────────────────────────────────────────

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function fmt(n: number): string {
  return currencyFormatter.format(n);
}

export function fmtPct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}
