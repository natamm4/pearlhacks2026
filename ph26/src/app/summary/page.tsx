"use client";

import { PiggyBank, Landmark, Info, Download, ChevronDown } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const metrics = [
  {
    label: "Gross Monthly",
    value: "$15,417",
    sub: "$185,000 / 12",
  },
  {
    label: "Take Home",
    value: "$8,538",
    sub: "55.4% of gross",
  },
  {
    label: "Monthly Savings",
    value: "$854",
    sub: "10% of take home",
  },
  {
    label: "401k Contribution",
    value: "$2,313",
    sub: "15% of paycheck",
  },
];

const retirementMilestones = [
  { label: "In 10 years", value: "$479,128" },
  { label: "In 20 years", value: "$1,424,601" },
  { label: "In 30 years", value: "$3,307,494" },
  { label: "In 40 years", value: "$6,137,520", bold: true },
];

export default function SummaryPage() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar activePage="summary" />

      {/* Main Area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-[72px] px-8 bg-background border-b border-border shrink-0">
          <div className="flex flex-col gap-[2px]">
            <h1 className="text-foreground font-semibold text-lg">Monthly Summary</h1>
            <p className="text-muted-foreground text-[13px]">Based on $185,000/yr total compensation</p>
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
          {/* Metric Cards Row */}
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
            {/* Left Column — takes remaining space */}
            <div className="flex-1 overflow-y-auto">
              {/* placeholder for left column content (charts, etc.) */}
            </div>

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
                    <span className="text-foreground font-bold text-[32px] leading-none">$854</span>
                    <span className="text-muted-foreground text-xs">saved this month</span>
                  </div>
                  <div className="flex flex-col w-full">
                    {[
                      { label: "Yearly savings", value: "$10,248", border: true },
                      { label: "Emergency fund (6 mo)", value: "$51,228", border: true },
                      { label: "5-year savings goal", value: "$51,240", border: false },
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
                    <span className="text-foreground font-bold text-[32px] leading-none">$6,137,520</span>
                    <span className="text-muted-foreground text-xs">projected in 40 years at 7% return</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex flex-col gap-[6px] w-full">
                    <div className="flex justify-between w-full">
                      <span className="text-muted-foreground text-[11px]">Your contributions</span>
                      <span className="text-muted-foreground text-[11px]">Growth</span>
                    </div>
                    <div className="relative w-full h-[10px] rounded-full bg-muted overflow-hidden">
                      <div className="absolute left-0 top-0 h-full rounded-full bg-primary" style={{ width: "18%" }} />
                    </div>
                    <div className="flex justify-between w-full">
                      <span className="text-muted-foreground text-[11px] font-semibold">$1,110,000</span>
                      <span className="text-foreground text-[11px] font-semibold">$5,027,520</span>
                    </div>
                  </div>

                  {/* Milestone Rows */}
                  <div className="flex flex-col w-full">
                    {retirementMilestones.map((ms, i, arr) => (
                      <div
                        key={ms.label}
                        className={`flex items-center justify-between py-2 ${i < arr.length - 1 ? "border-b border-border" : ""}`}
                      >
                        <span className="text-muted-foreground text-xs font-medium">{ms.label}</span>
                        <span className={`text-xs font-${ms.bold ? "700" : "600"} ${ms.bold ? "text-foreground" : "text-foreground"}`}>
                          {ms.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Note */}
                  <div className="flex items-center gap-[6px] rounded-[10px] bg-muted border border-border px-3 py-[10px]">
                    <Info size={14} className="text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground text-[11px] font-medium">
                      Includes 6% employer match on top of your 15%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
