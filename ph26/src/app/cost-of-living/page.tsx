"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Search,
  MapPin,
  TrendingUp,
  TrendingDown,
  Minus,
  Home,
  ShoppingCart,
  Bus,
  ArrowRight,
  X,
  Info,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useFinancial } from "@/context/FinancialContext";
import { fmt } from "@/lib/calculations";
import { US_STATES, COL_SPLITS } from "@/lib/colData";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface LocationSearchResult {
  city: string;
  state_abbr: string;
  rpp_index: number | null;
}

interface LocationDetail {
  city: string;
  state_abbr: string;
  rpp_index: number | null;
  avg_rent_1br: number | null;
  avg_rent_2br: number | null;
  avg_groceries: number | null;
  avg_transport: number | null;
}

// ─── Fallback data by state when backend isn't available ──────────────────────
// Approximate median values sourced from BLS / NerdWallet 2024 data
const STATE_FALLBACK: Record<string, Omit<LocationDetail, "city" | "state_abbr">> = {
  CA: { rpp_index: 115.3, avg_rent_1br: 2150, avg_rent_2br: 2800, avg_groceries: 520, avg_transport: 160 },
  NY: { rpp_index: 116.0, avg_rent_1br: 2400, avg_rent_2br: 3100, avg_groceries: 510, avg_transport: 130 },
  TX: { rpp_index: 97.5,  avg_rent_1br: 1350, avg_rent_2br: 1700, avg_groceries: 430, avg_transport: 120 },
  FL: { rpp_index: 100.2, avg_rent_1br: 1600, avg_rent_2br: 2000, avg_groceries: 450, avg_transport: 130 },
  WA: { rpp_index: 108.4, avg_rent_1br: 1900, avg_rent_2br: 2450, avg_groceries: 490, avg_transport: 140 },
  IL: { rpp_index: 103.1, avg_rent_1br: 1400, avg_rent_2br: 1800, avg_groceries: 460, avg_transport: 120 },
  MA: { rpp_index: 110.7, avg_rent_1br: 2100, avg_rent_2br: 2700, avg_groceries: 510, avg_transport: 130 },
  CO: { rpp_index: 106.2, avg_rent_1br: 1750, avg_rent_2br: 2200, avg_groceries: 480, avg_transport: 125 },
  GA: { rpp_index: 95.1,  avg_rent_1br: 1300, avg_rent_2br: 1650, avg_groceries: 410, avg_transport: 115 },
  NC: { rpp_index: 94.8,  avg_rent_1br: 1250, avg_rent_2br: 1600, avg_groceries: 400, avg_transport: 110 },
  AZ: { rpp_index: 97.0,  avg_rent_1br: 1400, avg_rent_2br: 1800, avg_groceries: 430, avg_transport: 120 },
  OH: { rpp_index: 91.2,  avg_rent_1br: 950,  avg_rent_2br: 1200, avg_groceries: 390, avg_transport: 100 },
  PA: { rpp_index: 98.6,  avg_rent_1br: 1200, avg_rent_2br: 1550, avg_groceries: 430, avg_transport: 115 },
  VA: { rpp_index: 104.5, avg_rent_1br: 1600, avg_rent_2br: 2000, avg_groceries: 460, avg_transport: 125 },
  NJ: { rpp_index: 112.3, avg_rent_1br: 1900, avg_rent_2br: 2400, avg_groceries: 500, avg_transport: 140 },
  MI: { rpp_index: 90.8,  avg_rent_1br: 1000, avg_rent_2br: 1300, avg_groceries: 400, avg_transport: 105 },
  MN: { rpp_index: 98.9,  avg_rent_1br: 1200, avg_rent_2br: 1550, avg_groceries: 440, avg_transport: 115 },
  OR: { rpp_index: 107.0, avg_rent_1br: 1600, avg_rent_2br: 2050, avg_groceries: 480, avg_transport: 130 },
  TN: { rpp_index: 91.0,  avg_rent_1br: 1150, avg_rent_2br: 1450, avg_groceries: 400, avg_transport: 108 },
  DC: { rpp_index: 118.5, avg_rent_1br: 2500, avg_rent_2br: 3300, avg_groceries: 540, avg_transport: 120 },
};

function getFallback(stateAbbr: string): Omit<LocationDetail, "city" | "state_abbr"> {
  return (
    STATE_FALLBACK[stateAbbr] ?? {
      rpp_index: 100,
      avg_rent_1br: 1100,
      avg_rent_2br: 1400,
      avg_groceries: 420,
      avg_transport: 110,
    }
  );
}

// ─── API helpers ───────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function searchLocations(q: string): Promise<LocationSearchResult[]> {
  try {
    const res = await fetch(`${API_BASE}/location/search?q=${encodeURIComponent(q)}&limit=8`);
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    return data.results ?? [];
  } catch {
    // Offline fallback — filter states by name/abbr
    const lower = q.toLowerCase();
    return US_STATES.filter(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        s.code.toLowerCase().includes(lower)
    )
      .slice(0, 8)
      .map((s) => ({
        city: "(Statewide)",
        state_abbr: s.code,
        rpp_index: getFallback(s.code).rpp_index,
      }));
  }
}

async function getLocationDetail(stateAbbr: string, city: string): Promise<LocationDetail> {
  try {
    const res = await fetch(
      `${API_BASE}/location/${encodeURIComponent(stateAbbr)}/${encodeURIComponent(city)}`
    );
    if (!res.ok) throw new Error("not found");
    return await res.json();
  } catch {
    const fallback = getFallback(stateAbbr);
    return { city, state_abbr: stateAbbr, ...fallback };
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function rppLabel(rpp: number | null) {
  if (rpp == null) return "N/A";
  if (rpp > 110) return "Very High";
  if (rpp > 105) return "High";
  if (rpp > 95) return "Average";
  if (rpp > 88) return "Low";
  return "Very Low";
}

function rppColor(rpp: number | null) {
  if (rpp == null) return "var(--muted-foreground)";
  if (rpp > 110) return "#e11d48";
  if (rpp > 105) return "#f97316";
  if (rpp > 95) return "#16a34a";
  if (rpp > 88) return "#2563eb";
  return "#7c3aed";
}

function delta(a: number, b: number): number {
  return ((a - b) / b) * 100;
}

function DeltaBadge({ pct }: { pct: number }) {
  const abs = Math.abs(pct).toFixed(1);
  if (Math.abs(pct) < 0.5) {
    return (
      <span className="flex items-center gap-[3px] text-xs font-semibold text-muted-foreground">
        <Minus size={12} /> Similar
      </span>
    );
  }
  if (pct > 0) {
    return (
      <span className="flex items-center gap-[3px] text-xs font-semibold text-[#e11d48]">
        <TrendingUp size={12} /> +{abs}% more expensive
      </span>
    );
  }
  return (
    <span className="flex items-center gap-[3px] text-xs font-semibold text-[#16a34a]">
      <TrendingDown size={12} /> {abs}% cheaper
    </span>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CostOfLivingPage() {
  const { result, input } = useFinancial();
  const hasFinancialData = result.grossMonthly > 0;

  // Search state
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Selected location
  const [selected, setSelected] = useState<LocationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Current (home) location detail — derived from FinancialContext stateCode
  const homeState = input.stateCode;
  const homeStateName = US_STATES.find((s) => s.code === homeState)?.name ?? homeState;
  const homeFallback = getFallback(homeState);
  const homeDetail: LocationDetail = {
    city: "(Statewide)",
    state_abbr: homeState,
    ...homeFallback,
  };

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    const t = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchLocations(query.trim());
      setSuggestions(results);
      setShowDropdown(results.length > 0);
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelectSuggestion = useCallback(async (s: LocationSearchResult) => {
    setShowDropdown(false);
    setQuery(`${s.city === "(Statewide)" ? "" : s.city + ", "}${s.state_abbr}`);
    setIsLoading(true);
    const detail = await getLocationDetail(s.state_abbr, s.city);
    setSelected(detail);
    setIsLoading(false);
  }, []);

  const clearSelection = () => {
    setSelected(null);
    setQuery("");
    setSuggestions([]);
  };

  // ─── Derived comparison numbers ────────────────────────────────────────────
  const compareTarget = selected ?? null;

  // COL-adjusted take-home in new location
  const adjustedTakeHome =
    compareTarget?.rpp_index && result.takeHomeMonthly > 0
      ? result.takeHomeMonthly / (compareTarget.rpp_index / 100)
      : null;

  const homeTakeHome = result.takeHomeMonthly;

  // Budget splits for new location based on RPP tier
  const targetTier = compareTarget
    ? compareTarget.rpp_index && compareTarget.rpp_index > 105
      ? "high"
      : "standard"
    : null;
  const targetSplit = targetTier ? COL_SPLITS[targetTier] : null;
  const homeSplit = COL_SPLITS[result.colTier];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar activePage="cost-of-living" />

      {/* Main */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between h-[72px] px-8 bg-background border-b border-border shrink-0">
          <div className="flex flex-col gap-[2px]">
            <h1 className="text-foreground font-semibold text-lg">Cost of Living</h1>
            <p className="text-muted-foreground text-[13px]">
              Compare living costs between cities and see how your money stretches
            </p>
          </div>
          {!hasFinancialData && (
            <a
              href="/dashboard"
              className="flex items-center gap-[6px] h-9 px-4 rounded-md border border-border bg-background hover:bg-muted transition-colors text-[13px] font-medium text-foreground"
            >
              Add your salary first
              <ArrowRight size={13} />
            </a>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">

          {/* Left Panel — Search + Details */}
          <div className="flex flex-col flex-1 h-full overflow-y-auto p-7 gap-6">

            {/* Search */}
            <div className="flex flex-col gap-[10px]">
              <h2 className="text-foreground font-semibold text-base">Search a Location</h2>
              <div ref={searchRef} className="relative w-full max-w-[520px]">
                <div className="relative flex items-center">
                  <Search size={15} className="absolute left-3 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                    placeholder="Search city or state (e.g. Austin, TX)"
                    className="w-full h-10 pl-9 pr-10 rounded-md border border-border bg-background text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
                  />
                  {query && (
                    <button
                      onClick={clearSelection}
                      className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Dropdown */}
                {showDropdown && (
                  <div className="absolute z-50 top-[calc(100%+4px)] left-0 w-full rounded-md border border-border bg-background shadow-lg overflow-hidden">
                    {isSearching ? (
                      <div className="px-4 py-3 text-xs text-muted-foreground">Searching...</div>
                    ) : (
                      suggestions.map((s, i) => (
                        <button
                          key={i}
                          onMouseDown={() => handleSelectSuggestion(s)}
                          className="flex items-center justify-between w-full px-4 py-[10px] text-left hover:bg-muted transition-colors border-b border-border last:border-0"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin size={13} className="text-muted-foreground shrink-0" />
                            <span className="text-[13px] font-medium text-foreground">
                              {s.city === "(Statewide)"
                                ? US_STATES.find((st) => st.code === s.state_abbr)?.name ?? s.state_abbr
                                : `${s.city}, ${s.state_abbr}`}
                            </span>
                          </div>
                          {s.rpp_index != null && (
                            <span
                              className="text-xs font-semibold"
                              style={{ color: rppColor(s.rpp_index) }}
                            >
                              RPP {s.rpp_index.toFixed(1)}
                            </span>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Loading skeleton */}
            {isLoading && (
              <div className="flex flex-col gap-3 max-w-[520px] animate-pulse">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-[72px] rounded-lg bg-muted" />
                ))}
              </div>
            )}

            {/* Location Detail Cards */}
            {!isLoading && compareTarget && (
              <div className="flex flex-col gap-5">

                {/* Location Header */}
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-primary" />
                      <h3 className="text-foreground font-bold text-xl">
                        {compareTarget.city === "(Statewide)"
                          ? US_STATES.find((s) => s.code === compareTarget.state_abbr)?.name ?? compareTarget.state_abbr
                          : `${compareTarget.city}, ${compareTarget.state_abbr}`}
                      </h3>
                    </div>
                    <p className="text-muted-foreground text-[13px] ml-6">
                      {compareTarget.city === "(Statewide)"
                        ? "Statewide average"
                        : `${compareTarget.state_abbr} — city-level data`}
                    </p>
                  </div>
                  {compareTarget.rpp_index != null && (
                    <div
                      className="flex flex-col items-end gap-[2px] rounded-lg px-4 py-[10px] border"
                      style={{
                        borderColor: rppColor(compareTarget.rpp_index),
                        backgroundColor: `${rppColor(compareTarget.rpp_index)}14`,
                      }}
                    >
                      <span
                        className="text-[22px] font-bold leading-none"
                        style={{ color: rppColor(compareTarget.rpp_index) }}
                      >
                        {compareTarget.rpp_index.toFixed(1)}
                      </span>
                      <span
                        className="text-[11px] font-semibold"
                        style={{ color: rppColor(compareTarget.rpp_index) }}
                      >
                        {rppLabel(compareTarget.rpp_index)} COL
                      </span>
                    </div>
                  )}
                </div>

                {/* COL Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      icon: Home,
                      label: "1BR Rent",
                      value: compareTarget.avg_rent_1br,
                      homeValue: homeDetail.avg_rent_1br,
                      suffix: "/mo",
                    },
                    {
                      icon: Home,
                      label: "2BR Rent",
                      value: compareTarget.avg_rent_2br,
                      homeValue: homeDetail.avg_rent_2br,
                      suffix: "/mo",
                    },
                    {
                      icon: ShoppingCart,
                      label: "Groceries",
                      value: compareTarget.avg_groceries,
                      homeValue: homeDetail.avg_groceries,
                      suffix: "/mo",
                    },
                    {
                      icon: Bus,
                      label: "Transportation",
                      value: compareTarget.avg_transport,
                      homeValue: homeDetail.avg_transport,
                      suffix: "/mo",
                    },
                  ].map((stat) => {
                    const pct =
                      stat.value != null && stat.homeValue != null
                        ? delta(stat.value, stat.homeValue)
                        : null;
                    return (
                      <div
                        key={stat.label}
                        className="flex flex-col gap-2 rounded-lg bg-card border border-border p-4"
                      >
                        <div className="flex items-center gap-2">
                          <stat.icon size={14} className="text-muted-foreground" />
                          <span className="text-muted-foreground text-xs font-medium">{stat.label}</span>
                        </div>
                        <span className="text-foreground font-bold text-[22px] leading-none">
                          {stat.value != null ? `${fmt(stat.value)}` : "—"}
                          <span className="text-muted-foreground text-[11px] font-normal ml-1">{stat.suffix}</span>
                        </span>
                        {pct != null && <DeltaBadge pct={pct} />}
                      </div>
                    );
                  })}
                </div>

                {/* RPP Explanation */}
                <div className="flex items-start gap-[6px] rounded-lg bg-muted border border-border px-4 py-3 max-w-[520px]">
                  <Info size={14} className="text-muted-foreground shrink-0 mt-[1px]" />
                  <p className="text-muted-foreground text-[12px] leading-relaxed">
                    <span className="font-semibold text-foreground">RPP (Regional Price Parity)</span> measures
                    local prices relative to the national average (100). A score of{" "}
                    {compareTarget.rpp_index?.toFixed(0) ?? "N/A"} means goods and services cost{" "}
                    {compareTarget.rpp_index != null
                      ? compareTarget.rpp_index > 100
                        ? `${(compareTarget.rpp_index - 100).toFixed(1)}% more`
                        : `${(100 - compareTarget.rpp_index).toFixed(1)}% less`
                      : "about the same"}{" "}
                    than the national average.
                  </p>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !compareTarget && (
              <div className="flex flex-col items-center gap-3 py-16 text-center max-w-[400px] mx-auto">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-muted border border-border">
                  <MapPin size={24} className="text-muted-foreground" />
                </div>
                <p className="text-foreground font-semibold text-base">Search a city or state</p>
                <p className="text-muted-foreground text-[13px] leading-relaxed">
                  Compare cost of living across the US and see how your salary would stretch in a new location.
                </p>
              </div>
            )}
          </div>

          {/* Right Panel — Comparison */}
          <div className="flex flex-col w-[380px] h-full overflow-y-auto border-l border-border bg-background shrink-0 p-6 gap-6">

            {/* Your Current Location */}
            <div className="flex flex-col gap-3">
              <h2 className="text-foreground font-semibold text-base">Your Current Location</h2>
              <div className="flex items-center justify-between rounded-lg bg-muted border border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-primary" />
                  <span className="text-foreground text-[13px] font-semibold">{homeStateName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: rppColor(homeDetail.rpp_index) }}
                  >
                    RPP {homeDetail.rpp_index?.toFixed(1) ?? "—"}
                  </span>
                  <span
                    className="rounded-full text-[10px] font-bold px-2 py-[2px]"
                    style={{
                      color: rppColor(homeDetail.rpp_index),
                      backgroundColor: `${rppColor(homeDetail.rpp_index)}18`,
                    }}
                  >
                    {rppLabel(homeDetail.rpp_index)}
                  </span>
                </div>
              </div>
            </div>

            {/* No financial data notice */}
            {!hasFinancialData && (
              <div className="flex flex-col gap-2 rounded-lg bg-muted border border-border p-4">
                <p className="text-muted-foreground text-[12px] leading-relaxed">
                  Add your salary in{" "}
                  <a href="/dashboard" className="text-primary underline font-medium">
                    Budget Breakdown
                  </a>{" "}
                  to see personalized take-home comparisons.
                </p>
              </div>
            )}

            {/* Comparison section — only when a location is selected */}
            {compareTarget ? (
              <>
                {/* Side-by-Side Rent Comparison */}
                <div className="flex flex-col gap-3">
                  <h2 className="text-foreground font-semibold text-[13px] uppercase tracking-wide text-muted-foreground">
                    Monthly Costs
                  </h2>
                  {[
                    {
                      label: "1BR Rent",
                      home: homeDetail.avg_rent_1br,
                      target: compareTarget.avg_rent_1br,
                    },
                    {
                      label: "2BR Rent",
                      home: homeDetail.avg_rent_2br,
                      target: compareTarget.avg_rent_2br,
                    },
                    {
                      label: "Groceries",
                      home: homeDetail.avg_groceries,
                      target: compareTarget.avg_groceries,
                    },
                    {
                      label: "Transport",
                      home: homeDetail.avg_transport,
                      target: compareTarget.avg_transport,
                    },
                  ].map((row, i, arr) => {
                    const pct =
                      row.home != null && row.target != null
                        ? delta(row.target, row.home)
                        : null;
                    return (
                      <div
                        key={row.label}
                        className={`flex flex-col gap-[6px] py-3 ${i < arr.length - 1 ? "border-b border-border" : ""}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-xs font-medium">{row.label}</span>
                          {pct != null && <DeltaBadge pct={pct} />}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground">{homeStateName}</span>
                            <span className="text-foreground font-semibold text-sm">
                              {row.home != null ? fmt(row.home) : "—"}
                            </span>
                          </div>
                          <ArrowRight size={12} className="text-muted-foreground mx-2" />
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] text-muted-foreground">
                              {compareTarget.city === "(Statewide)"
                                ? US_STATES.find((s) => s.code === compareTarget.state_abbr)?.name ?? compareTarget.state_abbr
                                : compareTarget.city}
                            </span>
                            <span
                              className="font-semibold text-sm"
                              style={{
                                color:
                                  pct == null
                                    ? "var(--foreground)"
                                    : pct > 2
                                    ? "#e11d48"
                                    : pct < -2
                                    ? "#16a34a"
                                    : "var(--foreground)",
                              }}
                            >
                              {row.target != null ? fmt(row.target) : "—"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Purchasing Power */}
                {hasFinancialData && adjustedTakeHome != null && (
                  <div className="flex flex-col gap-3 rounded-lg bg-card border border-border overflow-hidden">
                    <div className="px-4 py-3 border-b border-border">
                      <span className="text-foreground font-semibold text-[13px]">
                        Purchasing Power
                      </span>
                    </div>
                    <div className="flex flex-col gap-3 px-4 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-[2px]">
                          <span className="text-muted-foreground text-xs">Your take-home in {homeStateName}</span>
                          <span className="text-foreground font-bold text-[20px] leading-none">
                            {fmt(homeTakeHome)}
                          </span>
                          <span className="text-muted-foreground text-[10px]">per month (nominal)</span>
                        </div>
                        <ArrowRight size={14} className="text-muted-foreground mx-1" />
                        <div className="flex flex-col items-end gap-[2px]">
                          <span className="text-muted-foreground text-xs">
                            Equivalent in{" "}
                            {compareTarget.city === "(Statewide)"
                              ? US_STATES.find((s) => s.code === compareTarget.state_abbr)?.name ?? compareTarget.state_abbr
                              : compareTarget.city}
                          </span>
                          <span
                            className="font-bold text-[20px] leading-none"
                            style={{
                              color:
                                adjustedTakeHome > homeTakeHome
                                  ? "#16a34a"
                                  : adjustedTakeHome < homeTakeHome * 0.95
                                  ? "#e11d48"
                                  : "var(--foreground)",
                            }}
                          >
                            {fmt(adjustedTakeHome)}
                          </span>
                          <span className="text-muted-foreground text-[10px]">purchasing power</span>
                        </div>
                      </div>

                      {/* Change line */}
                      <div
                        className="rounded-md px-3 py-2 text-[11px] font-medium"
                        style={{
                          backgroundColor:
                            adjustedTakeHome >= homeTakeHome
                              ? "#16a34a18"
                              : "#e11d4818",
                          color:
                            adjustedTakeHome >= homeTakeHome ? "#16a34a" : "#e11d48",
                        }}
                      >
                        {adjustedTakeHome >= homeTakeHome
                          ? `Your money goes ${((adjustedTakeHome / homeTakeHome - 1) * 100).toFixed(1)}% further in this location.`
                          : `Your money goes ${((1 - adjustedTakeHome / homeTakeHome) * 100).toFixed(1)}% less far in this location.`}
                      </div>
                    </div>
                  </div>
                )}

                {/* Budget Split Comparison */}
                {targetSplit && (
                  <div className="flex flex-col gap-3">
                    <h2 className="text-foreground font-semibold text-[13px] uppercase tracking-wide text-muted-foreground">
                      Recommended Budget Split
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                      {(["essential", "discretionary", "savings"] as const).map((key) => {
                        const homeVal = homeSplit[key];
                        const targetVal = targetSplit[key];
                        const diff = ((targetVal - homeVal) * 100).toFixed(0);
                        const labels: Record<string, string> = {
                          essential: "Essentials",
                          discretionary: "Discretionary",
                          savings: "Savings",
                        };
                        const colors: Record<string, string> = {
                          essential: "#2563eb",
                          discretionary: "#7c3aed",
                          savings: "#16a34a",
                        };
                        return (
                          <div
                            key={key}
                            className="flex flex-col gap-1 rounded-lg border border-border bg-muted p-3"
                          >
                            <span className="text-muted-foreground text-[10px] font-medium">{labels[key]}</span>
                            <div className="flex items-baseline gap-1">
                              <span
                                className="font-bold text-[18px] leading-none"
                                style={{ color: colors[key] }}
                              >
                                {Math.round(targetVal * 100)}%
                              </span>
                              {Number(diff) !== 0 && (
                                <span
                                  className="text-[10px] font-semibold"
                                  style={{ color: Number(diff) > 0 && key !== "savings" ? "#e11d48" : "#16a34a" }}
                                >
                                  {Number(diff) > 0 ? `+${diff}pp` : `${diff}pp`}
                                </span>
                              )}
                            </div>
                            <span className="text-muted-foreground text-[10px]">
                              vs {Math.round(homeVal * 100)}% current
                            </span>
                          </div>
                        );
                      })}
                      <div className="flex flex-col gap-1 rounded-lg border border-primary/30 bg-primary/5 p-3">
                        <span className="text-muted-foreground text-[10px] font-medium">Strategy</span>
                        <span className="font-bold text-[15px] leading-none text-foreground">
                          {targetTier === "high" ? "60/30/10" : "50/30/20"}
                        </span>
                        <span className="text-muted-foreground text-[10px]">
                          {targetTier === "high" ? "High COL" : "Standard COL"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Right panel empty state */
              <div className="flex flex-col gap-2 py-8 text-center">
                <p className="text-muted-foreground text-[13px]">
                  Search and select a location on the left to see a side-by-side comparison.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
