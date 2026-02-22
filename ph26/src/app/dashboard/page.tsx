"use client";

import { useState } from "react";
import { Check, Download, Share2, ArrowRight, RefreshCw, ChevronDown } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { PieChart, Pie, Cell } from "recharts";

const chartData = [
  { name: "Take Home", value: 6284, color: "#2563eb" },
  { name: "Taxes", value: 2156, color: "#e11d48" },
  { name: "Savings", value: 1200, color: "#16a34a" },
  { name: "Investments", value: 800, color: "#ca8a04" },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"earnings" | "taxes" | "savings">("earnings");

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar activePage="budget" />

      {/* Main Area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between h-[72px] px-8 bg-background border-b border-border shrink-0">
          <div className="flex flex-col gap-[2px]">
            <h1 className="text-foreground font-semibold text-lg">Budget Breakdown</h1>
            <p className="text-muted-foreground text-[13px]">See where every dollar of your offer goes</p>
          </div>
          <div className="flex items-center gap-[10px]">
            {/* Saved Badge */}
            <div className="flex items-center gap-1 rounded-full bg-muted border border-border px-3 py-[6px]">
              <Check size={12} className="text-foreground" />
              <span className="text-foreground text-xs font-medium">Saved</span>
            </div>
            {/* Export */}
            <button className="flex items-center gap-[6px] justify-center h-9 px-4 rounded-md bg-background border border-border hover:bg-muted transition-colors">
              <Download size={14} className="text-muted-foreground" />
              <span className="text-foreground text-[13px] font-medium">Export</span>
            </button>
            {/* Share */}
            <button className="flex items-center gap-[6px] justify-center h-9 px-4 rounded-md bg-primary hover:bg-primary/90 transition-colors">
              <Share2 size={14} className="text-primary-foreground" />
              <span className="text-primary-foreground text-[13px] font-medium">Share</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Form Panel */}
          <div className="flex flex-col flex-1 h-full overflow-hidden">
            {/* Tab Bar */}
            <div className="flex items-end px-8 bg-background border-b border-border shrink-0">
              {(["earnings", "taxes", "savings"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-[14px] text-[13px] transition-colors ${
                    activeTab === tab
                      ? "text-foreground font-semibold border-b-2 border-foreground"
                      : "text-muted-foreground font-normal"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Form Content */}
            <div className="flex flex-col gap-7 flex-1 overflow-y-auto p-8">
              {/* Section 1: Base Compensation */}
              <div className="flex flex-col gap-[14px]">
                <h2 className="text-foreground font-semibold text-base">Base Compensation</h2>
                <div className="flex gap-4 w-full">
                  <div className="flex flex-col gap-[5px] flex-1">
                    <label className="text-muted-foreground text-xs font-medium">Base Salary</label>
                    <div className="flex items-center h-10 px-3 rounded-md bg-background border border-border">
                      <span className="text-[#1A1918] text-sm">$120,000</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[5px] flex-1">
                    <label className="text-muted-foreground text-xs font-medium">Pay Frequency</label>
                    <div className="flex items-center justify-between h-10 px-3 rounded-md bg-background border border-border">
                      <span className="text-[#1A1918] text-sm">Bi-weekly</span>
                      <ChevronDown size={14} className="text-[#9C9B99]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Additional Compensation */}
              <div className="flex flex-col gap-[14px]">
                <h2 className="text-foreground font-semibold text-base">Additional Compensation</h2>
                <div className="flex gap-4 w-full">
                  <div className="flex flex-col gap-[5px] flex-1">
                    <label className="text-muted-foreground text-xs font-medium">Sign-on Bonus</label>
                    <div className="flex items-center h-10 px-3 rounded-md bg-background border border-border">
                      <span className="text-[#1A1918] text-sm">$25,000</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[5px] flex-1">
                    <label className="text-muted-foreground text-xs font-medium">Equity (RSUs/year)</label>
                    <div className="flex items-center h-10 px-3 rounded-md bg-background border border-border">
                      <span className="text-[#1A1918] text-sm">$40,000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Benefits & Retirement */}
              <div className="flex flex-col gap-[14px]">
                <h2 className="text-foreground font-semibold text-base">Benefits &amp; Retirement</h2>
                <div className="flex gap-4 w-full">
                  <div className="flex flex-col gap-[5px] flex-1">
                    <label className="text-muted-foreground text-xs font-medium">401k Match %</label>
                    <div className="flex items-center h-10 px-3 rounded-md bg-background border border-border">
                      <span className="text-[#1A1918] text-sm">6%</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[5px] flex-1">
                    <label className="text-muted-foreground text-xs font-medium">Health Insurance / mo</label>
                    <div className="flex items-center h-10 px-3 rounded-md bg-background border border-border">
                      <span className="text-[#1A1918] text-sm">$250</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end">
                <button className="flex items-center gap-[6px] justify-center rounded-md bg-primary text-primary-foreground px-5 py-[10px] hover:bg-primary/90 transition-colors">
                  <span className="text-[13px] font-medium">Next: Taxes</span>
                  <ArrowRight size={14} className="text-primary-foreground" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex flex-col items-center gap-7 w-[380px] h-full overflow-y-auto p-7 bg-background border-l border-border shrink-0">
            <h2 className="text-foreground font-semibold text-base self-start">Your Paycheck Split</h2>

            {/* Donut Chart */}
            <div className="relative w-[220px] h-[220px] shrink-0">
              <PieChart width={220} height={220}>
                <Pie
                  data={chartData}
                  cx={110}
                  cy={110}
                  innerRadius={71}
                  outerRadius={110}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              {/* Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-muted-foreground text-[10px] font-medium">Take Home</span>
                <span className="text-foreground font-bold text-[22px]">$6,284</span>
                <span className="text-muted-foreground text-[10px]">/mo</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col w-full">
              {[
                { label: "Take Home", value: "$6,284", color: "#2563eb", textClass: "text-foreground" },
                { label: "Taxes", value: "-$2,156", color: "#e11d48", textClass: "text-destructive" },
                { label: "Savings", value: "$1,200", color: "#16a34a", textClass: "text-foreground" },
                { label: "Investments", value: "$800", color: "#ca8a04", textClass: "text-foreground" },
              ].map((item, i, arr) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between py-[10px] ${i < arr.length - 1 ? "border-b border-border" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-foreground text-[13px] font-medium">{item.label}</span>
                  </div>
                  <span className={`text-[13px] font-semibold ${item.textClass}`}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Total Box */}
            <div className="flex flex-col gap-[10px] w-full rounded-lg bg-muted p-4">
              <div className="flex justify-between items-center w-full">
                <span className="text-muted-foreground text-xs font-medium">Total Compensation</span>
                <span className="text-foreground font-bold text-[15px]">$185,000/yr</span>
              </div>
              <div className="flex items-center gap-[5px]">
                <RefreshCw size={11} className="text-muted-foreground" />
                <span className="text-muted-foreground text-[11px] font-medium">Totals recalculate as you type</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
