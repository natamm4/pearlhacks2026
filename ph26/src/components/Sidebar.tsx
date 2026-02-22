"use client";

import Link from "next/link";
import {
  CircleDollarSign,
  Target,
  Landmark,
  TrendingUp,
  LayoutDashboard,
  Calculator,
  GitCompare,
  Settings,
} from "lucide-react";

type ActivePage = "budget" | "goals" | "retirement" | "investments" | "summary" | "cost-of-living" | "compare-offers";

interface SidebarProps {
  activePage: ActivePage;
}

const navItems = [
  { key: "budget", label: "Budget", icon: CircleDollarSign, href: "/dashboard" },
  { key: "goals", label: "Goals", icon: Target, href: "/goals" },
  { key: "retirement", label: "Retirement", icon: Landmark, href: "/retirement" },
  { key: "investments", label: "Investments", icon: TrendingUp, href: "/investments" },
  { key: "summary", label: "Summary", icon: LayoutDashboard, href: "/summary" },
];

const toolItems = [
  { key: "cost-of-living", label: "Cost of Living", icon: Calculator, href: "/cost-of-living" },
  { key: "compare-offers", label: "Compare Offers", icon: GitCompare, href: "/compare-offers" },
];

export default function Sidebar({ activePage }: SidebarProps) {
  return (
    <div className="flex flex-col w-[260px] h-full bg-background border-r border-border shrink-0">
      {/* Header */}
      <div className="flex items-center gap-[10px] h-[72px] px-6 border-b border-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-[6px] bg-primary">
          <span className="text-primary-foreground font-semibold text-base">U</span>
        </div>
        <span className="text-foreground font-bold text-xl">UYO</span>
      </div>

      {/* Nav */}
      <div className="flex flex-col gap-1 px-4 py-6 w-full">
        <p className="text-muted-foreground text-[11px] font-medium tracking-wide mb-1">OVERVIEW</p>
        {navItems.map(({ key, label, icon: Icon, href }) => {
          const isActive = activePage === key;
          return (
            <Link
              key={key}
              href={href}
              className={`flex items-center gap-[10px] w-full rounded-[6px] px-3 py-[10px] transition-colors ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50 text-foreground"
              }`}
            >
              <Icon
                size={18}
                className={isActive ? "text-accent-foreground" : "text-muted-foreground"}
              />
              <span className={`text-sm ${isActive ? "font-semibold" : "font-normal"}`}>
                {label}
              </span>
            </Link>
          );
        })}

        <div className="h-px bg-border my-2 w-full" />

        <p className="text-muted-foreground text-[11px] font-medium tracking-wide mb-1">TOOLS</p>
        {toolItems.map(({ key, label, icon: Icon, href }) => {
          const isActive = activePage === key;
          return (
            <Link
              key={key}
              href={href}
              className={`flex items-center gap-[10px] w-full rounded-[10px] px-3 py-[10px] transition-colors ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50 text-foreground"
              }`}
            >
              <Icon
                size={18}
                className={isActive ? "text-accent-foreground" : "text-muted-foreground"}
              />
              <span className={`text-sm ${isActive ? "font-semibold" : "font-normal"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Footer */}
      <div className="flex items-center gap-[10px] px-6 py-4 border-t border-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary">
          <span className="text-primary-foreground text-xs font-semibold">JD</span>
        </div>
        <div className="flex flex-col gap-[2px] flex-1">
          <span className="text-foreground text-[13px] font-medium">Jane Doe</span>
          <span className="text-muted-foreground text-[11px]">jane@email.com</span>
        </div>
        <Settings size={16} className="text-muted-foreground" />
      </div>
    </div>
  );
}
