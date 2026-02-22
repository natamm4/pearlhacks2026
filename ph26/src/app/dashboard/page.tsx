// "use client";

// import { useState } from "react";
// import { Check, Download, Share2, ArrowRight, RefreshCw, ChevronDown } from "lucide-react";
// import Sidebar from "@/components/Sidebar";
// import { PieChart, Pie, Cell } from "recharts";

// const chartData = [
//   { name: "Take Home", value: 6284, color: "#2563eb" },
//   { name: "Taxes", value: 2156, color: "#e11d48" },
//   { name: "Savings", value: 1200, color: "#16a34a" },
//   { name: "Investments", value: 800, color: "#ca8a04" },
// ];

// export default function DashboardPage() {
//   const [activeTab, setActiveTab] = useState<"earnings" | "taxes" | "savings">("earnings");

//   return (
//     <div className="flex h-screen w-screen overflow-hidden bg-background">
//       <Sidebar activePage="budget" />

//       {/* Main Area */}
//       <div className="flex flex-col flex-1 h-full overflow-hidden">
//         {/* Top Header */}
//         <div className="flex items-center justify-between h-[72px] px-8 bg-background border-b border-border shrink-0">
//           <div className="flex flex-col gap-[2px]">
//             <h1 className="text-foreground font-semibold text-lg">Budget Breakdown</h1>
//             <p className="text-muted-foreground text-[13px]">See where every dollar of your offer goes</p>
//           </div>
//           <div className="flex items-center gap-[10px]">
//             {/* Saved Badge */}
//             <div className="flex items-center gap-1 rounded-full bg-muted border border-border px-3 py-[6px]">
//               <Check size={12} className="text-foreground" />
//               <span className="text-foreground text-xs font-medium">Saved</span>
//             </div>
//             {/* Export */}
//             <button className="flex items-center gap-[6px] justify-center h-9 px-4 rounded-md bg-background border border-border hover:bg-muted transition-colors">
//               <Download size={14} className="text-muted-foreground" />
//               <span className="text-foreground text-[13px] font-medium">Export</span>
//             </button>
//             {/* Share */}
//             <button className="flex items-center gap-[6px] justify-center h-9 px-4 rounded-md bg-primary hover:bg-primary/90 transition-colors">
//               <Share2 size={14} className="text-primary-foreground" />
//               <span className="text-primary-foreground text-[13px] font-medium">Share</span>
//             </button>
//           </div>
//         </div>

//         {/* Content Body */}
//         <div className="flex flex-1 overflow-hidden">
//           {/* Form Panel */}
//           <div className="flex flex-col flex-1 h-full overflow-hidden">
//             {/* Tab Bar */}
//             <div className="flex items-end px-8 bg-background border-b border-border shrink-0">
//               {(["earnings", "taxes", "savings"] as const).map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   className={`px-5 py-[14px] text-[13px] transition-colors ${
//                     activeTab === tab
//                       ? "text-foreground font-semibold border-b-2 border-foreground"
//                       : "text-muted-foreground font-normal"
//                   }`}
//                 >
//                   {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                 </button>
//               ))}
//             </div>

//             {/* Form Content - tab specific */}
//             <div className="flex flex-col gap-7 flex-1 overflow-y-auto p-8">
//               {activeTab === "earnings" && (
//                 <>
//                   {/* Section 1: Base Compensation */}
//                   <div className="flex flex-col gap-[14px]">d
//                     <input className="text-foreground font-semibold text-base" value="Base Compensation" />
//                     <div className="flex gap-4 w-full">
//                       <div className="flex flex-col gap-[5px] flex-1">
//                         <label className="text-muted-foreground text-xs font-medium">Base Salary</label>
//                         <div className="flex items-center h-10 px-3 rounded-md bg-background border border-border">
//                           <span className="text-[#1A1918] text-sm">$120,000</span>
//                         </div>
//                       </div>
//                       <div className="flex flex-col gap-[5px] flex-1">
//                         <label className="text-muted-foreground text-xs font-medium">Pay Frequency</label>
//                         <div className="flex items-center justify-between h-10 px-3 rounded-md bg-background border border-border">
//                           <span className="text-[#1A1918] text-sm">Bi-weekly</span>
//                           <ChevronDown size={14} className="text-[#9C9B99]" />
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Section 2: Additional Compensation */}
//                   <div className="flex flex-col gap-[14px]">
//                     <h2 className="text-foreground font-semibold text-base">Additional Compensation</h2>
//                     <div className="flex gap-4 w-full">
//                       <div className="flex flex-col gap-[5px] flex-1">
//                         <label className="text-muted-foreground text-xs font-medium">Sign-on Bonus</label>
//                         <div className="flex items-center h-10 px-3 rounded-md bg-background border border-border">
//                           <span className="text-[#1A1918] text-sm">$25,000</span>
//                         </div>
//                       </div>
//                       <div className="flex flex-col gap-[5px] flex-1">
//                         <label className="text-muted-foreground text-xs font-medium">Equity (RSUs/year)</label>
//                         <div className="flex items-center h-10 px-3 rounded-md bg-background border border-border">
//                           <span className="text-[#1A1918] text-sm">$40,000</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Section 3: Benefits & Retirement */}
//                   <div className="flex flex-col gap-[14px]">
//                     <h2 className="text-foreground font-semibold text-base">Benefits &amp; Retirement</h2>
//                     <div className="flex gap-4 w-full">
//                       <div className="flex flex-col gap-[5px] flex-1">
//                         <label className="text-muted-foreground text-xs font-medium">401k Match %</label>
//                         <div className="flex items-center h-10 px-3 rounded-md bg-background border border-border">
//                           <span className="text-[#1A1918] text-sm">6%</span>
//                         </div>
//                       </div>
//                       <div className="flex flex-col gap-[5px] flex-1">
//                         <label className="text-muted-foreground text-xs font-medium">Health Insurance / mo</label>
//                         <div className="flex items-center h-10 px-3 rounded-md bg-background border border-border">
//                           <span className="text-[#1A1918] text-sm">$250</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Form Actions */}
//                   <div className="flex justify-end">
//                     <button className="flex items-center gap-[6px] justify-center rounded-md bg-primary text-primary-foreground px-5 py-[10px] hover:bg-primary/90 transition-colors">
//                       <span className="text-[13px] font-medium">Next: Taxes</span>
//                       <ArrowRight size={14} className="text-primary-foreground" />
//                     </button>
//                   </div>
//                 </>
//               )}

//               {activeTab === "taxes" && (
//                 <>
//                   <div className="flex flex-col gap-[14px]">
//                     <h2 className="text-foreground font-semibold text-base">Taxes</h2>
//                     <div className="flex gap-4 w-full">
//                       <div className="flex flex-col gap-[5px] flex-1">
//                         <label className="text-muted-foreground text-xs font-medium">Federal Tax %</label>
//                         <div className="flex items-center h-10 px-3 rounded-md bg-background border border-border">
//                           <span className="text-[#1A1918] text-sm">22%</span>
//                         </div>
//                       </div>
//                       <div className="flex flex-col gap-[5px] flex-1">
//                         <label className="text-muted-foreground text-xs font-medium">State Tax %</label>
//                         <div className="flex items-center h-10 px-3 rounded-md bg-background border border-border">
//                           <span className="text-[#1A1918] text-sm">5%</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex justify-end">
//                     <button className="flex items-center gap-[6px] justify-center rounded-md bg-primary text-primary-foreground px-5 py-[10px] hover:bg-primary/90 transition-colors">
//                       <span className="text-[13px] font-medium">Save Taxes</span>
//                     </button>
//                   </div>
//                 </>
//               )}

//               {activeTab === "savings" && (
//                 <>
//                   <div className="flex flex-col gap-[14px]">
//                     <h2 className="text-foreground font-semibold text-base">Savings</h2>
//                     <div className="flex gap-4 w-full">
//                       <div className="flex flex-col gap-[5px] flex-1">
//                         <label className="text-muted-foreground text-xs font-medium">Emergency Fund / mo</label>
//                         <div className="flex items-center h-10 px-3 rounded-md bg-background border border-border">
//                           <span className="text-[#1A1918] text-sm">$300</span>
//                         </div>
//                       </div>
//                       <div className="flex flex-col gap-[5px] flex-1">
//                         <label className="text-muted-foreground text-xs font-medium">Retirement Savings / mo</label>
//                         <div className="flex items-center h-10 px-3 rounded-md bg-background border border-border">
//                           <span className="text-[#1A1918] text-sm">$400</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex justify-end">
//                     <button className="flex items-center gap-[6px] justify-center rounded-md bg-primary text-primary-foreground px-5 py-[10px] hover:bg-primary/90 transition-colors">
//                       <span className="text-[13px] font-medium">Save Savings</span>
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Right Panel */}
//           <div className="flex flex-col items-center gap-7 w-[380px] h-full overflow-y-auto p-7 bg-background border-l border-border shrink-0">
//             <h2 className="text-foreground font-semibold text-base self-start">Your Paycheck Split</h2>

//             {/* Donut Chart */}
//             <div className="relative w-[220px] h-[220px] shrink-0">
//               <PieChart width={220} height={220}>
//                 <Pie
//                   data={chartData}
//                   cx={110}
//                   cy={110}
//                   innerRadius={71}
//                   outerRadius={110}
//                   startAngle={90}
//                   endAngle={-270}
//                   dataKey="value"
//                   strokeWidth={0}
//                 >
//                   {chartData.map((entry, index) => (
//                     <Cell key={index} fill={entry.color} />
//                   ))}
//                 </Pie>
//               </PieChart>
//               {/* Center Label */}
//               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
//                 <span className="text-muted-foreground text-[10px] font-medium">Take Home</span>
//                 <span className="text-foreground font-bold text-[22px]">$6,284</span>
//                 <span className="text-muted-foreground text-[10px]">/mo</span>
//               </div>
//             </div>

//             {/* Legend */}
//             <div className="flex flex-col w-full">
//               {[
//                 { label: "Take Home", value: "$6,284", color: "#2563eb", textClass: "text-foreground" },
//                 { label: "Taxes", value: "-$2,156", color: "#e11d48", textClass: "text-destructive" },
//                 { label: "Savings", value: "$1,200", color: "#16a34a", textClass: "text-foreground" },
//                 { label: "Investments", value: "$800", color: "#ca8a04", textClass: "text-foreground" },
//               ].map((item, i, arr) => (
//                 <div
//                   key={item.label}
//                   className={`flex items-center justify-between py-[10px] ${i < arr.length - 1 ? "border-b border-border" : ""}`}
//                 >
//                   <div className="flex items-center gap-2">
//                     <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
//                     <span className="text-foreground text-[13px] font-medium">{item.label}</span>
//                   </div>
//                   <span className={`text-[13px] font-semibold ${item.textClass}`}>{item.value}</span>
//                 </div>
//               ))}
//             </div>

//             {/* Total Box */}
//             <div className="flex flex-col gap-[10px] w-full rounded-lg bg-muted p-4">
//               <div className="flex justify-between items-center w-full">
//                 <span className="text-muted-foreground text-xs font-medium">Total Compensation</span>
//                 <span className="text-foreground font-bold text-[15px]">$185,000/yr</span>
//               </div>
//               <div className="flex items-center gap-[5px]">
//                 <RefreshCw size={11} className="text-muted-foreground" />
//                 <span className="text-muted-foreground text-[11px] font-medium">Totals recalculate as you type</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Download, Share2, ArrowRight, RefreshCw, ChevronDown } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { PieChart, Pie, Cell } from "recharts";
import { supabase } from "@/lib/supabaseClient";

const chartData = [
  { name: "Take Home", value: 6284, color: "#2563eb" },
  { name: "Taxes", value: 2156, color: "#e11d48" },
  { name: "Savings", value: 1200, color: "#16a34a" },
  { name: "Investments", value: 800, color: "#ca8a04" },
];

type IncomeDetailsRow = {
  id: string;
  profile_id: string;

  base_salary: number | null;
  pay_frequency: string | null;
  sign_on_bonus: number | null;
  annual_bonus_pct: number | null;
  equity_per_year: number | null;

  additional_investments: number | null;

  four01k_contribution_annual: number | null;
  four01k_balance: number | null;
  four01k_match_pct: number | null;
  four01k_match_cap_pct: number | null;

  health_insurance_mo: number | null;

  roth_ira_annual_contribution: number | null;
  roth_ira_balance: number | null;

  city: string | null;
  state_abbr: string | null;
  geo_fips: string | null;
};

type UserPrefsRow = {
  user_id: string;
  budget_strategy: string | null;
  emergency_fund_mo: number | null;
  savings_split: any | null;
  retirement_target_age: number | null;
  active_profile_id: string | null;
};

type DebtRow = {
  id: string;
  profile_id: string;
  label: string | null;
  debt_type: string | null;
  principal: number | null;
  interest_rate: number | null;
  minimum_payment: number | null;
};

function n(v: string) {
  const x = Number(v.replace(/,/g, ""));
  return Number.isFinite(x) ? x : 0;
}

function money(v: number) {
  return v.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

async function requireUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error("Not signed in. Go to /auth first.");
  return data.user;
}

export default function DashboardPage() {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [activeTab, setActiveTab] = useState<"earnings" | "taxes" | "savings">("earnings");
  const [activeProfileId, setActiveProfileId] = useState<string>("");

  // income inputs
  const [baseSalary, setBaseSalary] = useState("120000");
  const [payFrequency, setPayFrequency] = useState("Bi-weekly");
  const [signOnBonus, setSignOnBonus] = useState("25000");
  const [annualBonusPct, setAnnualBonusPct] = useState("10");
  const [equityPerYear, setEquityPerYear] = useState("40000");
  const [healthInsuranceMo, setHealthInsuranceMo] = useState("250");

  const [additionalInvestments, setAdditionalInvestments] = useState("800");
  const [four01kContributionAnnual, setFour01kContributionAnnual] = useState("12000");
  const [four01kMatchPct, setFour01kMatchPct] = useState("6");
  const [four01kMatchCapPct, setFour01kMatchCapPct] = useState("6");
  const [four01kBalance, setFour01kBalance] = useState("0");
  const [rothAnnualContribution, setRothAnnualContribution] = useState("7000");
  const [rothBalance, setRothBalance] = useState("0");

  const [city, setCity] = useState("");
  const [stateAbbr, setStateAbbr] = useState("");

  // user prefs
  const [budgetStrategy, setBudgetStrategy] = useState("balanced");
  const [emergencyFundMo, setEmergencyFundMo] = useState("300");
  const [retirementTargetAge, setRetirementTargetAge] = useState("65");

  const [debts, setDebts] = useState<DebtRow[]>([]);
  const [newDebt, setNewDebt] = useState({
    label: "",
    debt_type: "",
    principal: "",
    interest_rate: "",
    minimum_payment: "",
  });

  const derived = useMemo(() => {
    const grossMo = n(baseSalary) / 12 + n(equityPerYear) / 12 + n(signOnBonus) / 12;
    const investMo = n(additionalInvestments);
    const healthMo = n(healthInsuranceMo);
    const emerMo = n(emergencyFundMo);

    const retirementMo = n(four01kContributionAnnual) / 12 + n(rothAnnualContribution) / 12;
    const totalSavedMo = emerMo + retirementMo;
    const remainderMo = Math.max(0, grossMo - investMo - healthMo - totalSavedMo);

    return { grossMo, investMo, healthMo, emerMo, retirementMo, totalSavedMo, remainderMo };
  }, [
    baseSalary,
    equityPerYear,
    signOnBonus,
    additionalInvestments,
    healthInsuranceMo,
    emergencyFundMo,
    four01kContributionAnnual,
    rothAnnualContribution,
  ]);

  async function resolveActiveProfileId(userId: string) {
    const prefsRes = await supabase
      .from("user_preferences")
      .select("active_profile_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (prefsRes.error) throw prefsRes.error;
    const prefProfileId = prefsRes.data?.active_profile_id;
    if (prefProfileId) return prefProfileId;

    const fpRes = await supabase
      .from("financial_profiles")
      .select("id,is_active,created_at")
      .eq("user_id", userId)
      .order("is_active", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(1);

    if (fpRes.error) throw fpRes.error;
    const fp = fpRes.data?.[0];
    if (!fp) throw new Error("No financial profile found. Create one in financial_profiles.");
    return fp.id as string;
  }

  async function ensureUserRecords(userId: string) {
    // ensure `profiles` row exists (profiles.id == auth.users.id)
    const profRes = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle();
    if (profRes.error) throw profRes.error;
    if (!profRes.data) {
      const insertProf = await supabase.from("profiles").insert({ id: userId, onboarded: false }).select().maybeSingle();
      if (insertProf.error) throw insertProf.error;
    }

    // ensure user_preferences exists
    const prefsRes = await supabase.from("user_preferences").select("user_id,active_profile_id").eq("user_id", userId).maybeSingle();
    if (prefsRes.error) throw prefsRes.error;
    let prefProfileId: string | null = prefsRes.data?.active_profile_id ?? null;
    if (!prefsRes.data) {
      const createPref = await supabase.from("user_preferences").insert({ user_id: userId }).select().maybeSingle();
      if (createPref.error) throw createPref.error;
      prefProfileId = createPref.data?.active_profile_id ?? null;
    }

    // ensure there's at least one financial_profile for the user
    const fpRes = await supabase.from("financial_profiles").select("id").eq("user_id", userId).limit(1).maybeSingle();
    if (fpRes.error) throw fpRes.error;
    if (!fpRes.data) {
      const newFp = await supabase
        .from("financial_profiles")
        .insert({ user_id: userId, label: "My Profile", profile_type: "current_job", is_active: true })
        .select()
        .maybeSingle();
      if (newFp.error) throw newFp.error;
      const newId = newFp.data?.id;
      // update preferences.active_profile_id if not set
      if (newId && !prefProfileId) {
        await supabase.from("user_preferences").update({ active_profile_id: newId }).eq("user_id", userId);
      }
    }
  }

  async function loadAll() {
    setMsg("");
    setLoading(true);
    try {
      const user = await requireUser();
      // ensure user-related rows exist for persistence across sessions
      await ensureUserRecords(user.id);
      const profileId = await resolveActiveProfileId(user.id);
      setActiveProfileId(profileId);

      const incomeRes = await supabase
        .from("income_details")
        .select(
          "base_salary,pay_frequency,sign_on_bonus,annual_bonus_pct,equity_per_year,additional_investments,four01k_contribution_annual,four01k_balance,four01k_match_pct,four01k_match_cap_pct,health_insurance_mo,roth_ira_annual_contribution,roth_ira_balance,city,state_abbr,geo_fips"
        )
        .eq("profile_id", profileId)
        .maybeSingle();

      if (incomeRes.error) throw incomeRes.error;
      const inc = incomeRes.data as Partial<IncomeDetailsRow> | null;

      if (inc) {
        if (inc.base_salary != null) setBaseSalary(String(inc.base_salary));
        if (inc.pay_frequency != null) setPayFrequency(String(inc.pay_frequency));
        if (inc.sign_on_bonus != null) setSignOnBonus(String(inc.sign_on_bonus));
        if (inc.annual_bonus_pct != null) setAnnualBonusPct(String(inc.annual_bonus_pct));
        if (inc.equity_per_year != null) setEquityPerYear(String(inc.equity_per_year));
        if (inc.additional_investments != null) setAdditionalInvestments(String(inc.additional_investments));
        if (inc.four01k_contribution_annual != null) setFour01kContributionAnnual(String(inc.four01k_contribution_annual));
        if (inc.four01k_balance != null) setFour01kBalance(String(inc.four01k_balance));
        if (inc.four01k_match_pct != null) setFour01kMatchPct(String(inc.four01k_match_pct));
        if (inc.four01k_match_cap_pct != null) setFour01kMatchCapPct(String(inc.four01k_match_cap_pct));
        if (inc.health_insurance_mo != null) setHealthInsuranceMo(String(inc.health_insurance_mo));
        if (inc.roth_ira_annual_contribution != null) setRothAnnualContribution(String(inc.roth_ira_annual_contribution));
        if (inc.roth_ira_balance != null) setRothBalance(String(inc.roth_ira_balance));
        if (inc.city != null) setCity(String(inc.city));
        if (inc.state_abbr != null) setStateAbbr(String(inc.state_abbr));
      }

      const prefsRes = await supabase
        .from("user_preferences")
        .select("budget_strategy,emergency_fund_mo,retirement_target_age,active_profile_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (prefsRes.error) throw prefsRes.error;
      const prefs = prefsRes.data as Partial<UserPrefsRow> | null;
      if (prefs) {
        if (prefs.budget_strategy != null) setBudgetStrategy(String(prefs.budget_strategy));
        if (prefs.emergency_fund_mo != null) setEmergencyFundMo(String(prefs.emergency_fund_mo));
        if (prefs.retirement_target_age != null) setRetirementTargetAge(String(prefs.retirement_target_age));
      }

      const debtsRes = await supabase
        .from("debts")
        .select("id,profile_id,label,debt_type,principal,interest_rate,minimum_payment")
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false });

      if (debtsRes.error) throw debtsRes.error;
      setDebts((debtsRes.data as DebtRow[]) ?? []);
    } catch (err: any) {
      setMsg(err?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function saveIncomeDetails() {
    setMsg("");
    setSaving(true);
    try {
      const user = await requireUser();
      const profileId = activeProfileId || (await resolveActiveProfileId(user.id));

      const { error } = await supabase.from("income_details").upsert(
        {
          profile_id: profileId,
          base_salary: n(baseSalary),
          pay_frequency: payFrequency,
          sign_on_bonus: n(signOnBonus),
          annual_bonus_pct: n(annualBonusPct),
          equity_per_year: n(equityPerYear),
          additional_investments: n(additionalInvestments),

          four01k_contribution_annual: n(four01kContributionAnnual),
          four01k_balance: n(four01kBalance),
          four01k_match_pct: n(four01kMatchPct),
          four01k_match_cap_pct: n(four01kMatchCapPct),

          health_insurance_mo: n(healthInsuranceMo),

          roth_ira_annual_contribution: n(rothAnnualContribution),
          roth_ira_balance: n(rothBalance),

          city: city || null,
          state_abbr: stateAbbr || null,
        },
        { onConflict: "profile_id" }
      );

      if (error) throw error;
      setMsg("Saved income details");
    } catch (err: any) {
      setMsg(err?.message ?? "Failed to save income_details");
    } finally {
      setSaving(false);
    }
  }

  async function saveUserPreferences() {
    setMsg("");
    setSaving(true);
    try {
      const user = await requireUser();

      const { error } = await supabase.from("user_preferences").upsert(
        {
          user_id: user.id,
          budget_strategy: budgetStrategy,
          emergency_fund_mo: n(emergencyFundMo),
          retirement_target_age: n(retirementTargetAge),
          active_profile_id: activeProfileId || null,
        },
        { onConflict: "user_id" }
      );

      if (error) throw error;
      setMsg("Saved preferences");
    } catch (err: any) {
      setMsg(err?.message ?? "Failed to save user_preferences");
    } finally {
      setSaving(false);
    }
  }

  async function addDebt() {
    setMsg("");
    setSaving(true);
    try {
      const user = await requireUser();
      const profileId = activeProfileId || (await resolveActiveProfileId(user.id));

      const { error } = await supabase.from("debts").insert({
        profile_id: profileId,
        label: newDebt.label || null,
        debt_type: newDebt.debt_type || null,
        principal: n(newDebt.principal),
        interest_rate: n(newDebt.interest_rate),
        minimum_payment: n(newDebt.minimum_payment),
      });

      if (error) throw error;

      setNewDebt({ label: "", debt_type: "", principal: "", interest_rate: "", minimum_payment: "" });
      await loadAll();
      setMsg("Added debt");
    } catch (err: any) {
      setMsg(err?.message ?? "Failed to add debt");
    } finally {
      setSaving(false);
    }
  }

  async function updateDebt(id: string, patch: Partial<DebtRow>) {
    setMsg("");
    setSaving(true);
    try {
      const { error } = await supabase.from("debts").update(patch).eq("id", id);
      if (error) throw error;
      setDebts((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
    } catch (err: any) {
      setMsg(err?.message ?? "Failed to update debt");
    } finally {
      setSaving(false);
    }
  }

  async function deleteDebt(id: string) {
    setMsg("");
    setSaving(true);
    try {
      const { error } = await supabase.from("debts").delete().eq("id", id);
      if (error) throw error;
      setDebts((prev) => prev.filter((d) => d.id !== id));
    } catch (err: any) {
      setMsg(err?.message ?? "Failed to delete debt");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar activePage="budget" />

      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <div className="flex items-center justify-between h-[72px] px-8 bg-background border-b border-border shrink-0">
          <div className="flex flex-col gap-[2px]">
            <h1 className="text-foreground font-semibold text-lg">Budget Breakdown</h1>
            <p className="text-muted-foreground text-[13px]">See where every dollar of your offer goes</p>
          </div>
          <div className="flex items-center gap-[10px]">
            <div className="flex items-center gap-1 rounded-full bg-muted border border-border px-3 py-[6px]">
              <Check size={12} className="text-foreground" />
              <span className="text-foreground text-xs font-medium">Saved</span>
            </div>
            <button className="flex items-center gap-[6px] justify-center h-9 px-4 rounded-md bg-background border border-border hover:bg-muted transition-colors" onClick={loadAll}>
              <Download size={14} className="text-muted-foreground" />
              <span className="text-foreground text-[13px] font-medium">Reload</span>
            </button>
            <button className="flex items-center gap-[6px] justify-center h-9 px-4 rounded-md bg-primary hover:bg-primary/90 transition-colors">
              <Share2 size={14} className="text-primary-foreground" />
              <span className="text-primary-foreground text-[13px] font-medium">Share</span>
            </button>
          </div>
        </div>

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

            {/* Form Content - tab specific */}
            <div className="flex flex-col gap-7 flex-1 overflow-y-auto p-8">
              {activeTab === "earnings" && (
                <>
                  <div className="flex flex-col gap-[14px]">
                    <h2 className="text-foreground font-semibold text-base">Base Compensation</h2>
                    <div className="flex gap-4 w-full">
                      <div className="flex flex-col gap-[5px] flex-1">
                        <label className="text-muted-foreground text-xs font-medium">Base Salary</label>
                        <div className="flex items-center h-10 px-3 rounded-md bg-background border border-border">
                          <input className="w-full bg-transparent outline-none" value={baseSalary} onChange={(e) => setBaseSalary(e.target.value)} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-[5px] flex-1">
                        <label className="text-muted-foreground text-xs font-medium">Pay Frequency</label>
                        <div className="flex items-center justify-between h-10 px-3 rounded-md bg-background border border-border">
                              <select className="bg-transparent outline-none w-full" value={payFrequency} onChange={(e) => setPayFrequency(e.target.value)}>
                                <option value="Weekly">Weekly</option>
                                <option value="Bi-weekly">Bi-weekly</option>
                                <option value="Semi-monthly">Semi-monthly</option>
                                <option value="Monthly">Monthly</option>
                              </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[14px]">
                    <h2 className="text-foreground font-semibold text-base">Additional Compensation</h2>
                    <div className="flex gap-4 w-full">
                      <div className="flex flex-col gap-[5px] flex-1">
                        <label className="text-muted-foreground text-xs font-medium">Sign-on Bonus</label>
                        <div className="flex items-center h-10 px-3 rounded-md bg-background border border-border">
                          <input className="w-full bg-transparent outline-none" value={signOnBonus} onChange={(e) => setSignOnBonus(e.target.value)} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-[5px] flex-1">
                        <label className="text-muted-foreground text-xs font-medium">Equity (RSUs/year)</label>
                        <div className="flex items-center h-10 px-3 rounded-md bg-background border border-border">
                          <input className="w-full bg-transparent outline-none" value={equityPerYear} onChange={(e) => setEquityPerYear(e.target.value)} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[14px]">
                    <h2 className="text-foreground font-semibold text-base">Benefits &amp; Retirement</h2>
                    <div className="flex gap-4 w-full">
                      <div className="flex flex-col gap-[5px] flex-1">
                        <label className="text-muted-foreground text-xs font-medium">401k Match %</label>
                        <div className="flex items-center h-10 px-3 rounded-md bg-background border border-border">
                          <input className="w-full bg-transparent outline-none" value={four01kMatchPct} onChange={(e) => setFour01kMatchPct(e.target.value)} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-[5px] flex-1">
                        <label className="text-muted-foreground text-xs font-medium">Health Insurance / mo</label>
                        <div className="flex items-center h-10 px-3 rounded-md bg-background border border-border">
                          <input className="w-full bg-transparent outline-none" value={healthInsuranceMo} onChange={(e) => setHealthInsuranceMo(e.target.value)} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button onClick={saveIncomeDetails} className="flex items-center gap-[6px] justify-center rounded-md bg-primary text-primary-foreground px-5 py-[10px] hover:bg-primary/90 transition-colors">
                      <span className="text-[13px] font-medium">Save Income</span>
                      <ArrowRight size={14} className="text-primary-foreground" />
                    </button>
                  </div>
                </>
              )}

              {activeTab === "taxes" && (
                <>
                  <div className="flex flex-col gap-[14px]">
                    <h2 className="text-foreground font-semibold text-base">Taxes</h2>
                    <div className="flex gap-4 w-full">
                      <div className="flex flex-col gap-[5px] flex-1">
                        <label className="text-muted-foreground text-xs font-medium">Federal Tax %</label>
                        <div className="flex items-center h-10 px-3 rounded-md bg-background border border-border">
                          <input className="w-full bg-transparent outline-none" value={annualBonusPct} onChange={(e) => setAnnualBonusPct(e.target.value)} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-[5px] flex-1">
                        <label className="text-muted-foreground text-xs font-medium">State Tax %</label>
                        <div className="flex items-center h-10 px-3 rounded-md bg-background border border-border">
                          <input className="w-full bg-transparent outline-none" value={four01kMatchCapPct} onChange={(e) => setFour01kMatchCapPct(e.target.value)} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button onClick={saveUserPreferences} className="flex items-center gap-[6px] justify-center rounded-md bg-primary text-primary-foreground px-5 py-[10px] hover:bg-primary/90 transition-colors">
                      <span className="text-[13px] font-medium">Save Taxes</span>
                    </button>
                  </div>
                </>
              )}

              {activeTab === "savings" && (
                <>
                  <div className="flex flex-col gap-[14px]">
                    <h2 className="text-foreground font-semibold text-base">Savings</h2>
                    <div className="flex gap-4 w-full">
                      <div className="flex flex-col gap-[5px] flex-1">
                        <label className="text-muted-foreground text-xs font-medium">Emergency Fund / mo</label>
                        <div className="flex items-center h-10 px-3 rounded-md bg-background border border-border">
                          <input className="w-full bg-transparent outline-none" value={emergencyFundMo} onChange={(e) => setEmergencyFundMo(e.target.value)} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-[5px] flex-1">
                        <label className="text-muted-foreground text-xs font-medium">Retirement Savings / mo</label>
                        <div className="flex items-center h-10 px-3 rounded-md bg-background border border-border">
                          <input className="w-full bg-transparent outline-none" value={four01kContributionAnnual} onChange={(e) => setFour01kContributionAnnual(e.target.value)} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button onClick={saveUserPreferences} className="flex items-center gap-[6px] justify-center rounded-md bg-primary text-primary-foreground px-5 py-[10px] hover:bg-primary/90 transition-colors">
                      <span className="text-[13px] font-medium">Save Savings</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex flex-col items-center gap-7 w-[380px] h-full overflow-y-auto p-7 bg-background border-l border-border shrink-0">
            <h2 className="text-foreground font-semibold text-base self-start">Your Paycheck Split</h2>

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
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-muted-foreground text-[10px] font-medium">Take Home</span>
                <span className="text-foreground font-bold text-[22px]">$6,284</span>
                <span className="text-muted-foreground text-[10px]">/mo</span>
              </div>
            </div>

            <div className="flex flex-col w-full">
              {[
                { label: "Take Home", value: "$6,284", color: "#2563eb", textClass: "text-foreground" },
                { label: "Taxes", value: "-$2,156", color: "#e11d48", textClass: "text-destructive" },
                { label: "Savings", value: "$1,200", color: "#16a34a", textClass: "text-foreground" },
                { label: "Investments", value: "$800", color: "#ca8a04", textClass: "text-foreground" },
              ].map((item, i, arr) => (
                <div key={item.label} className={`flex items-center justify-between py-[10px] ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-foreground text-[13px] font-medium">{item.label}</span>
                  </div>
                  <span className={`text-[13px] font-semibold ${item.textClass}`}>{item.value}</span>
                </div>
              ))}
            </div>

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