"use client";

import Sidebar from "@/components/Sidebar";

export default function CostOfLivingPage() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar activePage="cost-of-living" />

      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <div className="flex items-center justify-between h-[72px] px-8 bg-background border-b border-border shrink-0">
          <div className="flex flex-col gap-[2px]">
            <h1 className="text-foreground font-semibold text-lg">Cost of Living</h1>
            <p className="text-muted-foreground text-[13px]">Compare typical expenses across locations</p>
          </div>
        </div>

        <div className="flex flex-col gap-6 flex-1 overflow-y-auto p-7 bg-background">
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="flex flex-col gap-3 rounded-lg bg-card border border-border p-5">
              <span className="text-muted-foreground text-xs font-medium">City A - Rent (1BR)</span>
              <span className="text-foreground font-bold text-[20px]">$1,900</span>
            </div>
            <div className="flex flex-col gap-3 rounded-lg bg-card border border-border p-5">
              <span className="text-muted-foreground text-xs font-medium">City B - Rent (1BR)</span>
              <span className="text-foreground font-bold text-[20px]">$2,600</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-lg bg-card border border-border p-5">
              <h2 className="text-foreground font-semibold text-base">Estimate Monthly Difference</h2>
              <p className="text-muted-foreground text-sm mt-2">Placeholder inputs for quick comparisons.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
