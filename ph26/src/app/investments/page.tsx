"use client";

import Sidebar from "@/components/Sidebar";
import { TrendingUp } from "lucide-react";

export default function InvestmentsPage() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar activePage="investments" />

      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <div className="flex items-center justify-between h-[72px] px-8 bg-background border-b border-border shrink-0">
          <div className="flex flex-col gap-[2px]">
            <h1 className="text-foreground font-semibold text-lg">Investments</h1>
            <p className="text-muted-foreground text-[13px]">Overview of your investment allocations</p>
          </div>
        </div>

        <div className="flex flex-col gap-6 flex-1 overflow-y-auto p-7 bg-background">
          <div className="grid grid-cols-3 gap-4 w-full">
            <div className="flex flex-col gap-2 rounded-lg bg-card border border-border p-5">
              <span className="text-muted-foreground text-xs font-medium">Stocks</span>
              <span className="text-foreground font-bold text-[20px]">62%</span>
            </div>
            <div className="flex flex-col gap-2 rounded-lg bg-card border border-border p-5">
              <span className="text-muted-foreground text-xs font-medium">Bonds</span>
              <span className="text-foreground font-bold text-[20px]">18%</span>
            </div>
            <div className="flex flex-col gap-2 rounded-lg bg-card border border-border p-5">
              <span className="text-muted-foreground text-xs font-medium">Cash</span>
              <span className="text-foreground font-bold text-[20px]">20%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
