"use client";

import Sidebar from "@/components/Sidebar";
import { Landmark } from "lucide-react";

export default function RetirementPage() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar activePage="retirement" />

      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <div className="flex items-center justify-between h-[72px] px-8 bg-background border-b border-border shrink-0">
          <div className="flex flex-col gap-[2px]">
            <h1 className="text-foreground font-semibold text-lg">Retirement</h1>
            <p className="text-muted-foreground text-[13px]">Projection and contribution settings</p>
          </div>
        </div>

        <div className="flex flex-col gap-6 flex-1 overflow-y-auto p-7 bg-background">
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="flex flex-col gap-3 rounded-lg bg-card border border-border p-5">
              <span className="text-muted-foreground text-xs font-medium">Current Balance</span>
              <span className="text-foreground font-bold text-[24px]">$85,000</span>
            </div>
            <div className="flex flex-col gap-3 rounded-lg bg-card border border-border p-5">
              <span className="text-muted-foreground text-xs font-medium">Projected in 30 years</span>
              <span className="text-foreground font-bold text-[24px]">$1,200,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
