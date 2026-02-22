"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  FinancialInput,
  FinancialResult,
  calculateFinancials,
  ZERO_RESULT,
} from "@/lib/calculations";

const DEFAULT_INPUT: FinancialInput = {
  annualSalary: 0,
  payFrequency: "biweekly",
  signOnBonus: 0,
  equityPerYear: 0,
  stateCode: "CA",
  filingStatus: "single",
  employee401kPct: 0.06,
  healthPremiumMonthly: 0,
};

interface FinancialContextValue {
  input: FinancialInput;
  result: FinancialResult;
  updateInput: (patch: Partial<FinancialInput>) => void;
}

const FinancialContext = createContext<FinancialContextValue | null>(null);

export function FinancialProvider({ children }: { children: React.ReactNode }) {
  const [input, setInput] = useState<FinancialInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<FinancialResult>(ZERO_RESULT);

  const updateInput = useCallback((patch: Partial<FinancialInput>) => {
    setInput((prev) => {
      const next = { ...prev, ...patch };
      setResult(calculateFinancials(next));
      return next;
    });
  }, []);

  return (
    <FinancialContext.Provider value={{ input, result, updateInput }}>
      {children}
    </FinancialContext.Provider>
  );
}

export function useFinancial(): FinancialContextValue {
  const ctx = useContext(FinancialContext);
  if (!ctx) throw new Error("useFinancial must be used within FinancialProvider");
  return ctx;
}