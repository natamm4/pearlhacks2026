"use client";

import Link from "next/link";
import { PiggyBank, Landmark, Info, Download, ChevronDown } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useFinancial } from "@/context/FinancialContext";
import { fmt, fmtPct } from "@/lib/calculations";

export default function SummaryPage() {
  const { result, input } = useFinancial();
  const hasData = result.grossMonthly > 0;

  const metrics = [
    {
      label: "Gross Monthly",
      value: hasData ? fmt(result.grossMonthly) : "—",
      sub: hasData ? `${fmt(result.grossAnnual)} / 12` : "Enter salary in Budget",
    },
    {
      label: "Take Home",
      value: hasData ? fmt(result.actualTakeHomeMonthly) : "—",
      sub: hasData
        ? `${fmtPct(result.actualTakeHomeMonthly / result.grossMonthly)} of gross`
        : "",
    },
    {
      label: "Monthly Savings",
      value: hasData ? fmt(result.savingsMonthly) : "—",
      sub: hasData
        ? `${result.colTier === "high" ? "10" : "20"}% of take-home`
        : "",
    },
    {
      label: "401k Contribution",
      value: hasData ? fmt(result.contribution401kMonthly) : "—",
      sub: hasData ? `${Math.round(input.employee401kPct * 100)}% of paycheck` : "",
    },
  ];

  const retirementContribPct =
    result.retirementIn40 > 0
      ? Math.round((result.retirementContributions / result.retirementIn40) * 100)
      : 18;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar activePage="summary" />

      {/* Main Area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">

        {/* Top Bar */}
        <div className="flex items-center justify-between h-[72px] px-8 bg-background border-b border-border shrink-0">
          <div className="flex flex-col gap-[2px]">
            <h1 className="text-foreground font-semibold text-lg">Monthly Summary</h1>
            <p className="text-muted-foreground text-[13px]">
              {hasData
                ? `Based on ${fmt(result.totalCompAnnual)}/yr total compensation`
                : "Enter your offer details in Budget Breakdown"}
            </p>
          </div>
          <div className="flex items-center gap-[10px]">
            <button className="flex items-center gap-[6px] justify-center h-9 px-[14px] rounded-md bg-background border border-border hover:bg-muted transition-colors">
              <span className="text-foreground text-[13px] font-medium">February 2026</span>
              <ChevronDown size={14} className="text-muted-foreground" />
            </button>
            <button className="flex items-center gap-[6px] justify-center h-9 px-[14px] rounded-md bg-background border border-border hover:bg-muted transition-colors">
              <Download size={14} className="text-muted-foreground" />
              <span className="text-foreground text-[13px] font-medium">Export PDF</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6 flex-1 overflow-y-auto p-7 bg-background">

          {/* Empty state */}
          {!hasData && (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <p className="text-muted-foreground text-sm">
                No data yet —{" "}
                <Link href="/dashboard" className="text-primary underline">
                  fill in your offer
                </Link>{" "}
                in Budget Breakdown to see your summary.
              </p>
            </div>
          )}

          {/* Metric Cards */}
          <div className="grid grid-cols-4 gap-4 w-full">
            {metrics.map((m) => (
              <div key={m.label} className="flex flex-col gap-[6px] rounded-lg bg-card border border-border p-5">
                <span className="text-muted-foreground text-xs font-medium">{m.label}</span>
                <span className="text-foreground font-bold text-[26px] leading-none">{m.value}</span>
                <span className="text-muted-foreground text-[11px]">{m.sub}</span>
              </div>
            ))}
          </div>

          {/* Two Column Layout */}
          <div className="flex gap-5 flex-1 overflow-hidden min-h-0">
            {/* Left Column placeholder */}
            <div className="flex-1 overflow-y-auto" />

            {/* Right Column */}
            <div className="flex flex-col gap-5 w-[380px] shrink-0 overflow-y-auto">

              {/* Monthly Savings Card */}
              <div className="flex flex-col rounded-lg bg-card border border-border overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <span className="text-foreground font-semibold text-[15px]">Monthly Savings</span>
                  <PiggyBank size={18} className="text-muted-foreground" />
                </div>
                <div className="flex flex-col gap-4 p-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-foreground font-bold text-[32px] leading-none">
                      {hasData ? fmt(result.savingsMonthly) : "—"}
                    </span>
                    <span className="text-muted-foreground text-xs">saved this month</span>
                  </div>
                  <div className="flex flex-col w-full">
                    {[
                      {
                        label: "Yearly savings",
                        value: hasData ? fmt(result.yearlySavings) : "—",
                        border: true,
                      },
                      {
                        label: "Emergency fund (6 mo)",
                        value: hasData ? fmt(result.emergencyFund6Mo) : "—",
                        border: true,
                      },
                      {
                        label: "5-year savings goal",
                        value: hasData ? fmt(result.fiveYearSavings) : "—",
                        border: false,
                      },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className={`flex items-center justify-between py-2 ${row.border ? "border-b border-border" : ""}`}
                      >
                        <span className="text-muted-foreground text-xs font-medium">{row.label}</span>
                        <span className="text-foreground text-xs font-semibold">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Retirement Projection Card */}
              <div className="flex flex-col rounded-lg bg-card border border-border overflow-hidden flex-1">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <span className="text-foreground font-semibold text-[15px]">Retirement Projection</span>
                  <Landmark size={18} className="text-muted-foreground" />
                </div>
                <div className="flex flex-col gap-4 p-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-foreground font-bold text-[32px] leading-none">
                      {hasData ? fmt(result.retirementIn40) : "—"}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      projected in 40 years at 7% return
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {hasData && (
                    <div className="flex flex-col gap-[6px] w-full">
                      <div className="flex justify-between w-full">
                        <span className="text-muted-foreground text-[11px]">Your contributions</span>
                        <span className="text-muted-foreground text-[11px]">Growth</span>
                      </div>
                      <div className="relative w-full h-[10px] rounded-full bg-muted overflow-hidden">
                        <div
                          className="absolute left-0 top-0 h-full rounded-full bg-primary"
                          style={{ width: `${Math.min(retirementContribPct, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between w-full">
                        <span className="text-muted-foreground text-[11px] font-semibold">
                          {fmt(result.retirementContributions)}
                        </span>
                        <span className="text-foreground text-[11px] font-semibold">
                          {fmt(result.retirementGrowth)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Milestone Rows */}
                  <div className="flex flex-col w-full">
                    {[
                      { label: "In 10 years", value: result.retirementIn10, bold: false },
                      { label: "In 20 years", value: result.retirementIn20, bold: false },
                      { label: "In 30 years", value: result.retirementIn30, bold: false },
                      { label: "In 40 years", value: result.retirementIn40, bold: true },
                    ].map((ms, i, arr) => (
                      <div
                        key={ms.label}
                        className={`flex items-center justify-between py-2 ${i < arr.length - 1 ? "border-b border-border" : ""}`}
                      >
                        <span className="text-muted-foreground text-xs font-medium">{ms.label}</span>
                        <span className={`text-xs ${ms.bold ? "font-bold text-foreground" : "font-semibold text-foreground"}`}>
                          {hasData ? fmt(ms.value) : "—"}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Note */}
                  {hasData && (
                    <div className="flex items-center gap-[6px] rounded-[10px] bg-muted border border-border px-3 py-[10px]">
                      <Info size={14} className="text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground text-[11px] font-medium">
                        Includes {Math.round(Math.min(input.employee401kPct, 0.06) * 100)}% employer match on top of your {Math.round(input.employee401kPct * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
