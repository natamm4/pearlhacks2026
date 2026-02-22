"use client";

import Sidebar from "@/components/Sidebar";
import { Target } from "lucide-react";

export default function GoalsPage() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar activePage="goals" />

      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <div className="flex items-center justify-between h-[72px] px-8 bg-background border-b border-border shrink-0">
          <div className="flex flex-col gap-[2px]">
            <h1 className="text-foreground font-semibold text-lg">Goals</h1>
            <p className="text-muted-foreground text-[13px]">Track short and long term financial goals</p>
          </div>
        </div>

        <div className="flex flex-col gap-6 flex-1 overflow-y-auto p-7 bg-background">
          <div className="grid grid-cols-3 gap-4 w-full">
            <div className="flex flex-col gap-2 rounded-lg bg-card border border-border p-5">
              <span className="text-muted-foreground text-xs font-medium">Emergency Fund</span>
              <span className="text-foreground font-bold text-[20px]">$12,000</span>
            </div>
            <div className="flex flex-col gap-2 rounded-lg bg-card border border-border p-5">
              <span className="text-muted-foreground text-xs font-medium">Vacation Fund</span>
              <span className="text-foreground font-bold text-[20px]">$3,500</span>
            </div>
            <div className="flex flex-col gap-2 rounded-lg bg-card border border-border p-5">
              <span className="text-muted-foreground text-xs font-medium">Down Payment</span>
              <span className="text-foreground font-bold text-[20px]">$40,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
