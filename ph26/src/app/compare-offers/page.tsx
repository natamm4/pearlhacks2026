"use client";

import Sidebar from "@/components/Sidebar";

export default function CompareOffersPage() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar activePage="compare-offers" />

      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <div className="flex items-center justify-between h-[72px] px-8 bg-background border-b border-border shrink-0">
          <div className="flex flex-col gap-[2px]">
            <h1 className="text-foreground font-semibold text-lg">Compare Offers</h1>
            <p className="text-muted-foreground text-[13px]">Side-by-side offer comparison</p>
          </div>
        </div>

        <div className="flex flex-col gap-6 flex-1 overflow-y-auto p-7 bg-background">
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="flex flex-col gap-3 rounded-lg bg-card border border-border p-5">
              <span className="text-muted-foreground text-xs font-medium">Offer A</span>
              <span className="text-foreground font-bold text-[20px]">$150,000</span>
              <span className="text-muted-foreground text-xs">Includes $20k sign-on</span>
            </div>
            <div className="flex flex-col gap-3 rounded-lg bg-card border border-border p-5">
              <span className="text-muted-foreground text-xs font-medium">Offer B</span>
              <span className="text-foreground font-bold text-[20px]">$165,000</span>
              <span className="text-muted-foreground text-xs">Includes $10k sign-on</span>
            </div>
          </div>

          <div className="rounded-lg bg-card border border-border p-5">
            <h2 className="text-foreground font-semibold text-base">Recommendation</h2>
            <p className="text-muted-foreground text-sm mt-2">Quick highlights to help choose the best offer.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
