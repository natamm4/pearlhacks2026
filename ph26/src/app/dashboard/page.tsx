"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Download, Share2, ArrowRight, RefreshCw } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useFinancial } from "@/context/FinancialContext";
import { fmt, fmtPct } from "@/lib/calculations";
import { US_STATES } from "@/lib/colData";

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const formSchema = z.object({
  annualSalary:         z.number().min(0).max(10_000_000),
  payFrequency:         z.enum(["weekly", "biweekly", "semimonthly", "monthly"]),
  signOnBonus:          z.number().min(0),
  equityPerYear:        z.number().min(0),
  stateCode:            z.string().min(2).max(2),
  filingStatus:         z.enum(["single", "married_jointly"]),
  employee401kPct:      z.number().min(0).max(0.23),
  healthPremiumMonthly: z.number().min(0),
});

type FormValues = z.infer<typeof formSchema>;

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md bg-background border border-border px-3 py-2 shadow text-sm">
      <p className="font-semibold">{payload[0].name}</p>
      <p className="text-muted-foreground">{fmt(payload[0].value)}/mo</p>
    </div>
  );
}

// ─── Field Row helper ─────────────────────────────────────────────────────────

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[5px] flex-1">
      <Label className="text-muted-foreground text-xs font-medium">{label}</Label>
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"earnings" | "taxes" | "savings">("earnings");
  const { result, updateInput } = useFinancial();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      annualSalary: 0,
      payFrequency: "biweekly",
      signOnBonus: 0,
      equityPerYear: 0,
      stateCode: "CA",
      filingStatus: "single",
      employee401kPct: 0.06,
      healthPremiumMonthly: 0,
    },
    mode: "onChange",
  });

  // Sync every field change to context (live recalculation)
  useEffect(() => {
    const subscription = form.watch((values) => {
      updateInput({
        annualSalary:         isNaN(values.annualSalary as number) ? 0 : (values.annualSalary ?? 0),
        payFrequency:         values.payFrequency ?? "biweekly",
        signOnBonus:          isNaN(values.signOnBonus as number) ? 0 : (values.signOnBonus ?? 0),
        equityPerYear:        isNaN(values.equityPerYear as number) ? 0 : (values.equityPerYear ?? 0),
        stateCode:            values.stateCode ?? "CA",
        filingStatus:         values.filingStatus ?? "single",
        employee401kPct:      isNaN(values.employee401kPct as number) ? 0.06 : (values.employee401kPct ?? 0.06),
        healthPremiumMonthly: isNaN(values.healthPremiumMonthly as number) ? 0 : (values.healthPremiumMonthly ?? 0),
      });
    });
    return () => subscription.unsubscribe();
  }, [form, updateInput]);

  const watchedValues = form.watch();
  const hasData = result.grossMonthly > 0;

  const colBadgeColor = result.colTier === "high" ? "#e11d48" : "#16a34a";

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
            {hasData && (
              <div className="flex items-center gap-1 rounded-full bg-muted border border-border px-3 py-[6px]">
                <Check size={12} className="text-foreground" />
                <span className="text-foreground text-xs font-medium">Saved</span>
              </div>
            )}
            <button className="flex items-center gap-[6px] justify-center h-9 px-4 rounded-md bg-background border border-border hover:bg-muted transition-colors">
              <Download size={14} className="text-muted-foreground" />
              <span className="text-foreground text-[13px] font-medium">Export</span>
            </button>
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
                      : "text-muted-foreground hover:text-foreground font-normal"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Form Content — scrollable */}
            <div className="flex flex-col gap-7 flex-1 overflow-y-auto p-8">

              {/* ── Earnings Tab ─────────────────────────────────────────── */}
              {activeTab === "earnings" && (
                <>
                  {/* Base Compensation */}
                  <div className="flex flex-col gap-[14px]">
                    <h2 className="text-foreground font-semibold text-base">Base Compensation</h2>
                    <div className="flex gap-4 w-full">
                      <FieldGroup label="Base Salary">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                          <Input
                            type="number"
                            placeholder="120000"
                            className="pl-6 h-10"
                            {...form.register("annualSalary", { valueAsNumber: true })}
                          />
                        </div>
                      </FieldGroup>
                      <FieldGroup label="Pay Frequency">
                        <Controller
                          name="payFrequency"
                          control={form.control}
                          render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="h-10 w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                                <SelectItem value="semimonthly">Semi-monthly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </FieldGroup>
                    </div>
                  </div>

                  {/* Additional Compensation */}
                  <div className="flex flex-col gap-[14px]">
                    <h2 className="text-foreground font-semibold text-base">Additional Compensation</h2>
                    <div className="flex gap-4 w-full">
                      <FieldGroup label="Sign-on Bonus">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                          <Input
                            type="number"
                            placeholder="0"
                            className="pl-6 h-10"
                            {...form.register("signOnBonus", { valueAsNumber: true })}
                          />
                        </div>
                      </FieldGroup>
                      <FieldGroup label="Equity (RSUs/year)">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                          <Input
                            type="number"
                            placeholder="0"
                            className="pl-6 h-10"
                            {...form.register("equityPerYear", { valueAsNumber: true })}
                          />
                        </div>
                      </FieldGroup>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="flex flex-col gap-[14px]">
                    <h2 className="text-foreground font-semibold text-base">Benefits</h2>
                    <div className="flex gap-4 w-full">
                      <FieldGroup label="Health Insurance / mo">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                          <Input
                            type="number"
                            placeholder="0"
                            className="pl-6 h-10"
                            {...form.register("healthPremiumMonthly", { valueAsNumber: true })}
                          />
                        </div>
                      </FieldGroup>
                      <div className="flex-1" />
                    </div>
                  </div>

                  {/* Next button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => setActiveTab("taxes")}
                      className="flex items-center gap-[6px] justify-center rounded-md bg-primary text-primary-foreground px-5 py-[10px] hover:bg-primary/90 transition-colors"
                    >
                      <span className="text-[13px] font-medium">Next: Taxes</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </>
              )}

              {/* ── Taxes Tab ────────────────────────────────────────────── */}
              {activeTab === "taxes" && (
                <>
                  {/* Location */}
                  <div className="flex flex-col gap-[14px]">
                    <h2 className="text-foreground font-semibold text-base">Location</h2>
                    <div className="flex gap-4 w-full">
                      <FieldGroup label="State">
                        <Controller
                          name="stateCode"
                          control={form.control}
                          render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="h-10 w-full">
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                              <SelectContent className="max-h-60">
                                {US_STATES.map((s) => (
                                  <SelectItem key={s.code} value={s.code}>
                                    {s.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </FieldGroup>
                      <FieldGroup label="Filing Status">
                        <Controller
                          name="filingStatus"
                          control={form.control}
                          render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="h-10 w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="single">Single</SelectItem>
                                <SelectItem value="married_jointly">Married Filing Jointly</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </FieldGroup>
                    </div>
                  </div>

                  {/* COL Badge */}
                  <div
                    className="flex items-center gap-2 rounded-full border px-4 py-[6px] w-fit text-xs font-semibold"
                    style={{ borderColor: colBadgeColor, color: colBadgeColor }}
                  >
                    {result.colTier === "high"
                      ? "🏙 High COL — Using 60/30/10 Split"
                      : "✅ Standard COL — Using 50/30/20 Split"}
                  </div>

                  {/* Tax Breakdown */}
                  <div className="flex flex-col gap-[14px]">
                    <h2 className="text-foreground font-semibold text-base">Estimated Monthly Taxes</h2>
                    {hasData ? (
                      <div className="flex flex-col gap-3">
                        {[
                          {
                            label: "Federal Income Tax",
                            sub: `${fmtPct(result.taxes.effectiveFederalRate)} effective rate`,
                            value: result.taxes.federalMonthly,
                          },
                          {
                            label: `${watchedValues.stateCode} State Income Tax`,
                            sub: `${fmtPct(result.taxes.effectiveStateRate)} effective rate`,
                            value: result.taxes.stateMonthly,
                          },
                          {
                            label: "FICA (Social Security + Medicare)",
                            sub: "7.65% of gross wages",
                            value: result.taxes.ficaMonthly,
                          },
                        ].map((row) => (
                          <div
                            key={row.label}
                            className="flex items-center justify-between px-4 py-3 rounded-lg bg-muted border border-border"
                          >
                            <div>
                              <p className="text-sm font-medium">{row.label}</p>
                              <p className="text-xs text-muted-foreground">{row.sub}</p>
                            </div>
                            <span className="text-destructive font-semibold text-sm">
                              -{fmt(row.value)}/mo
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20">
                          <span className="font-semibold text-sm">Total Monthly Taxes</span>
                          <span className="text-destructive font-bold text-sm">
                            -{fmt(result.taxes.totalMonthly)}/mo
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        Enter your salary in the Earnings tab to see your tax estimate.
                      </p>
                    )}
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex justify-between">
                    <button
                      onClick={() => setActiveTab("earnings")}
                      className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      ← Back: Earnings
                    </button>
                    <button
                      onClick={() => setActiveTab("savings")}
                      className="flex items-center gap-[6px] justify-center rounded-md bg-primary text-primary-foreground px-5 py-[10px] hover:bg-primary/90 transition-colors"
                    >
                      <span className="text-[13px] font-medium">Next: Savings</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </>
              )}

              {/* ── Savings Tab ──────────────────────────────────────────── */}
              {activeTab === "savings" && (
                <>
                  {/* 401k Slider */}
                  <div className="flex flex-col gap-[14px]">
                    <h2 className="text-foreground font-semibold text-base">Your 401k Contribution</h2>
                    <div className="flex flex-col gap-3 p-4 rounded-lg bg-muted border border-border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {Math.round((watchedValues.employee401kPct ?? 0.06) * 100)}% of gross
                        </span>
                        <span className="text-sm font-bold">
                          {fmt(result.contribution401kMonthly)}/mo
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={0.23}
                        step={0.01}
                        className="w-full accent-primary"
                        {...form.register("employee401kPct", { valueAsNumber: true })}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0%</span>
                        <span>IRS max 23%</span>
                      </div>
                      {hasData && (
                        <p className="text-xs text-muted-foreground">
                          Your employer matches up to 6% — that&apos;s{" "}
                          <span className="font-semibold text-foreground">
                            {fmt(Math.min((watchedValues.employee401kPct ?? 0.06), 0.06) * result.grossMonthly)}/mo
                          </span>{" "}
                          free money.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Budget Split Display */}
                  <div className="flex flex-col gap-[14px]">
                    <div className="flex items-center gap-2">
                      <h2 className="text-foreground font-semibold text-base">Your Budget Split</h2>
                      <span className="rounded-full text-xs font-semibold px-3 py-[3px] bg-primary text-primary-foreground">
                        {result.splitLabel}
                      </span>
                    </div>
                    {hasData ? (
                      <div className="flex flex-col gap-3">
                        {[
                          {
                            label: "Retirement",
                            sub: "15% of gross (recommended)",
                            value: result.retirementMonthly,
                            color: "#ca8a04",
                            pct: "15%",
                          },
                          {
                            label: "Taxes",
                            sub: `${fmtPct(result.taxes.effectiveTotalRate)} effective rate`,
                            value: result.taxes.totalMonthly,
                            color: "#e11d48",
                            pct: fmtPct(result.taxes.effectiveTotalRate),
                          },
                          {
                            label: "Essential Expenses",
                            sub: `${result.colTier === "high" ? "60" : "50"}% of take-home`,
                            value: result.essentialMonthly,
                            color: "#2563eb",
                            pct: result.colTier === "high" ? "60%" : "50%",
                          },
                          {
                            label: "Discretionary",
                            sub: "30% of take-home",
                            value: result.discretionaryMonthly,
                            color: "#7c3aed",
                            pct: "30%",
                          },
                          {
                            label: "Savings",
                            sub: `${result.colTier === "high" ? "10" : "20"}% of take-home`,
                            value: result.savingsMonthly,
                            color: "#16a34a",
                            pct: result.colTier === "high" ? "10%" : "20%",
                          },
                        ].map((row) => (
                          <div
                            key={row.label}
                            className="flex items-center justify-between px-4 py-3 rounded-lg bg-muted border border-border"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: row.color }}
                              />
                              <div>
                                <p className="text-sm font-medium">{row.label}</p>
                                <p className="text-xs text-muted-foreground">{row.sub}</p>
                              </div>
                            </div>
                            <span className="font-semibold text-sm">{fmt(row.value)}/mo</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        Enter your salary in the Earnings tab to see your budget split.
                      </p>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between">
                    <button
                      onClick={() => setActiveTab("taxes")}
                      className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      ← Back: Taxes
                    </button>
                    <Link
                      href="/summary"
                      className="flex items-center gap-[6px] justify-center rounded-md bg-primary text-primary-foreground px-5 py-[10px] hover:bg-primary/90 transition-colors text-[13px] font-medium"
                    >
                      View Summary
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Right Panel ─────────────────────────────────────────────── */}
          <div className="flex flex-col items-center gap-7 w-[380px] h-full overflow-y-auto p-7 bg-background border-l border-border shrink-0">
            <h2 className="text-foreground font-semibold text-base self-start">Your Paycheck Split</h2>

            {/* Donut Chart */}
            <div className="relative w-[220px] h-[220px] shrink-0">
              {hasData ? (
                <PieChart width={220} height={220}>
                  <Pie
                    data={result.pieData}
                    cx={110}
                    cy={110}
                    innerRadius={71}
                    outerRadius={110}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {result.pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              ) : (
                <div className="w-[220px] h-[220px] rounded-full border-[39px] border-muted" />
              )}

              {/* Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-muted-foreground text-[10px] font-medium">Take Home</span>
                <span className="text-foreground font-bold text-[22px] leading-none">
                  {hasData ? fmt(result.takeHomeMonthly) : "—"}
                </span>
                <span className="text-muted-foreground text-[10px]">/mo</span>
              </div>
            </div>

            {/* COL Badge */}
            {hasData && (
              <div
                className="flex items-center gap-1 rounded-full border px-3 py-[5px] text-xs font-semibold self-start"
                style={{ borderColor: colBadgeColor, color: colBadgeColor }}
              >
                {result.colTier === "high" ? "High COL" : "Standard COL"} — {result.splitLabel} Split
              </div>
            )}

            {/* Legend */}
            <div className="flex flex-col w-full">
              {result.pieData.length > 0
                ? result.pieData.map((item, i, arr) => (
                    <div
                      key={item.name}
                      className={`flex items-center justify-between py-[10px] ${
                        i < arr.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-foreground text-[13px] font-medium">{item.name}</span>
                      </div>
                      <span
                        className="text-[13px] font-semibold"
                        style={{ color: item.name === "Taxes" ? "var(--destructive)" : "var(--foreground)" }}
                      >
                        {item.name === "Taxes" ? `-${fmt(item.value)}` : fmt(item.value)}
                      </span>
                    </div>
                  ))
                : (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    Enter your salary to see the breakdown.
                  </p>
                )}
            </div>

            {/* Total Box */}
            <div className="flex flex-col gap-[10px] w-full rounded-lg bg-muted p-4">
              <div className="flex justify-between items-center w-full">
                <span className="text-muted-foreground text-xs font-medium">Total Compensation</span>
                <span className="text-foreground font-bold text-[15px]">
                  {hasData ? `${fmt(result.totalCompAnnual)}/yr` : "—"}
                </span>
              </div>
              <div className="flex items-center gap-[5px]">
                <RefreshCw size={11} className="text-muted-foreground" />
                <span className="text-muted-foreground text-[11px] font-medium">
                  Totals recalculate as you type
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
