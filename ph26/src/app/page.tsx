import Link from "next/link";
import { Sparkles, ArrowRight, Twitter, Linkedin, Github } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="flex items-center justify-between w-full h-[72px] px-20 bg-background border-b border-border">
        <div className="flex items-center gap-[10px]">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
            <span className="text-primary-foreground font-semibold text-base">U</span>
          </div>
          <span className="text-foreground font-bold text-xl">UYO</span>
        </div>
        <nav className="flex items-center gap-8">
          <span className="text-muted-foreground text-sm cursor-pointer hover:text-foreground transition-colors">Features</span>
          <span className="text-muted-foreground text-sm cursor-pointer hover:text-foreground transition-colors">How It Works</span>
          <span className="text-muted-foreground text-sm cursor-pointer hover:text-foreground transition-colors">Pricing</span>
          <Link
            href="/dashboard"
            className="flex items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-medium px-4 py-2 hover:bg-primary/90 transition-colors"
          >
            Get Started Free
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center gap-6 w-full bg-background px-[200px] pt-20 pb-[60px]">
        <div className="flex items-center gap-[6px] rounded-full bg-muted border border-border px-4 py-[6px]">
          <Sparkles size={14} className="text-foreground" />
          <span className="text-foreground text-[13px] font-medium">Finally understand what you&apos;re really earning</span>
        </div>
        <h1
          className="text-foreground font-bold text-center leading-[1.1]"
          style={{ fontSize: 56, width: 800 }}
        >
          Know Your Worth,{"\n"}Down to the Dollar
        </h1>
        <p
          className="text-muted-foreground text-center leading-[1.5] text-lg"
          style={{ width: 620 }}
        >
          UYO breaks down your total compensation — salary, equity, taxes, and benefits — so you can negotiate smarter and plan with confidence.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 justify-center rounded-md bg-primary text-primary-foreground font-medium px-6 py-3 hover:bg-primary/90 transition-colors"
          >
            <span className="text-[15px]">Calculate My Offer</span>
            <ArrowRight size={18} className="text-primary-foreground" />
          </Link>
          <Link
            href="#demo"
            className="flex items-center justify-center rounded-md bg-background border border-border text-foreground font-medium px-6 py-3 hover:bg-muted transition-colors"
          >
            <span className="text-[15px]">See a Demo</span>
          </Link>
        </div>
      </section>

      {/* Features / How It Works */}
      <section className="flex flex-col items-center gap-12 w-full bg-background px-20 py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-full bg-muted border border-border px-[14px] py-[6px]">
            <span className="text-foreground text-xs font-medium">How It Works</span>
          </div>
          <h2 className="text-foreground font-bold text-[36px] text-center">Your offer, decoded in 3 steps</h2>
          <p className="text-muted-foreground text-base text-center">No spreadsheets. No guesswork. Just clarity.</p>
        </div>
        <div className="grid grid-cols-3 gap-6 w-full">
          {/* Card 1 */}
          <div className="flex flex-col gap-4 rounded-lg bg-card border border-border p-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted">
              <span className="text-foreground font-semibold text-sm">1</span>
            </div>
            <h3 className="text-card-foreground font-semibold text-lg">Enter Your Offer</h3>
            <p className="text-muted-foreground text-sm leading-[1.5]">
              Input your salary, equity, sign-on bonus, 401k match, and health premiums. Our guided tabs walk you through each step.
            </p>
          </div>
          {/* Card 2 */}
          <div className="flex flex-col gap-4 rounded-lg bg-card border border-border p-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted">
              <span className="text-foreground font-semibold text-sm">2</span>
            </div>
            <h3 className="text-card-foreground font-semibold text-lg">See the Breakdown</h3>
            <p className="text-muted-foreground text-sm leading-[1.5]">
              Watch your pie chart update in real-time as numbers flow in. See exactly where every dollar goes — take home, taxes, savings, and investments.
            </p>
          </div>
          {/* Card 3 */}
          <div className="flex flex-col gap-4 rounded-lg bg-card border border-border p-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted">
              <span className="text-foreground font-semibold text-sm">3</span>
            </div>
            <h3 className="text-card-foreground font-semibold text-lg">Negotiate with Confidence</h3>
            <p className="text-muted-foreground text-sm leading-[1.5]">
              Compare multiple offers side-by-side. Know your true worth and walk into every negotiation armed with clarity and data.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="flex flex-col items-center gap-6 w-full bg-foreground px-[200px] py-20">
        <h2
          className="text-background font-bold text-[40px] text-center leading-[1.15]"
          style={{ width: 600 }}
        >
          Ready to understand{"\n"}your offer?
        </h2>
        <p className="text-background text-base text-center opacity-70">
          Join thousands of professionals who negotiate smarter with UYO.
        </p>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 justify-center rounded-md bg-background text-foreground font-medium px-6 py-3 hover:bg-background/90 transition-colors"
        >
          <span className="text-[15px]">Get Started — It&apos;s Free</span>
          <ArrowRight size={18} className="text-foreground" />
        </Link>
        <p className="text-background text-[13px] text-center opacity-50">
          No credit card required. Free forever for individual use.
        </p>
      </section>

      {/* Footer */}
      <footer className="flex flex-col gap-10 w-full bg-card px-20 pt-12 pb-8">
        <div className="flex justify-between w-full">
          {/* Brand */}
          <div className="flex flex-col gap-3 w-[280px]">
            <div className="flex items-center gap-[10px]">
              <div className="flex items-center justify-center w-8 h-8 rounded-[6px] bg-primary">
                <span className="text-primary-foreground font-semibold text-base">U</span>
              </div>
              <span className="text-foreground font-bold text-xl">UYO</span>
            </div>
            <p className="text-muted-foreground text-sm leading-[1.5]" style={{ width: 260 }}>
              Understand Your Offer.{"\n"}Negotiate with confidence.
            </p>
          </div>
          {/* Product */}
          <div className="flex flex-col gap-3">
            <span className="text-foreground text-[13px] font-semibold">Product</span>
            <span className="text-muted-foreground text-[13px] cursor-pointer hover:text-foreground transition-colors">Features</span>
            <span className="text-muted-foreground text-[13px] cursor-pointer hover:text-foreground transition-colors">Pricing</span>
            <span className="text-muted-foreground text-[13px] cursor-pointer hover:text-foreground transition-colors">Changelog</span>
          </div>
          {/* Company */}
          <div className="flex flex-col gap-3">
            <span className="text-foreground text-[13px] font-semibold">Company</span>
            <span className="text-muted-foreground text-[13px] cursor-pointer hover:text-foreground transition-colors">About</span>
            <span className="text-muted-foreground text-[13px] cursor-pointer hover:text-foreground transition-colors">Blog</span>
            <span className="text-muted-foreground text-[13px] cursor-pointer hover:text-foreground transition-colors">Careers</span>
          </div>
          {/* Legal */}
          <div className="flex flex-col gap-3">
            <span className="text-foreground text-[13px] font-semibold">Legal</span>
            <span className="text-muted-foreground text-[13px] cursor-pointer hover:text-foreground transition-colors">Privacy</span>
            <span className="text-muted-foreground text-[13px] cursor-pointer hover:text-foreground transition-colors">Terms</span>
          </div>
        </div>
        {/* Bottom */}
        <div className="flex justify-between items-center w-full pt-5 border-t border-border">
          <span className="text-muted-foreground text-xs">2026 UYO. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Twitter size={16} className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
            <Linkedin size={16} className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
            <Github size={16} className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
}
