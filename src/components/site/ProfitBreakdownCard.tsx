import { Link } from "@tanstack/react-router";
import { ShieldCheck, ArrowRight, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export type BreakdownRow = {
  label: string;
  value: string;
  tone?: "neg" | "pos" | "neutral" | "muted";
};

export type HighlightCard = { label: string; value: string };

export type ProfitBreakdownProps = {
  platform: "walmart" | "tiktok" | "ebay";
  model: "dropshipping" | "2-step-wfs" | "2-step-fulfillment";
  title: string;
  badge?: string;
  rows: BreakdownRow[];
  highlightCards: HighlightCard[];
  splitLine: string;
  disclaimer?: string;
  ctaPrimary: { label: string; to: string };
  ctaSecondary: { label: string; to: string };
};

const DEFAULT_DISCLAIMER =
  "These examples are for illustration only. Actual performance depends on product selection, marketplace approval, demand, pricing, supplier cost, shipping cost, account health, competition, refund rate, and operational execution. Results are not guaranteed.";

export function ProfitBreakdownCard({
  title,
  badge,
  rows,
  highlightCards,
  splitLine,
  disclaimer = DEFAULT_DISCLAIMER,
  ctaPrimary,
  ctaSecondary,
}: ProfitBreakdownProps) {
  return (
    <section className="mx-auto max-w-4xl px-4 lg:px-0 py-16 md:py-20">
      {/* Eyebrow */}
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-[11px] font-semibold tracking-[0.15em] uppercase text-primary">
          Illustrative profit example
        </span>
        <h2 className="mt-4 text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        {badge && (
          <div className="mt-3 flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              {badge}
            </span>
          </div>
        )}
        <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          This example is for illustration only and shows how costs, platform
          fees, fulfillment, and the Ray Ecommerce 40/60 split may be calculated.
        </p>
      </div>

      {/* Main breakdown card */}
      <div
        className="mt-8 rounded-[20px] border border-border/70 bg-white shadow-[0_2px_24px_-12px_rgba(15,23,42,0.12)] overflow-hidden"
      >
        <ul className="divide-y divide-border/60">
          {rows.map((r) => {
            const isNetProfit = /net profit/i.test(r.label);
            return (
              <li
                key={r.label}
                className={`flex items-center justify-between px-5 md:px-7 py-3.5 text-sm md:text-[15px] ${
                  isNetProfit ? "bg-blue-50/60" : ""
                }`}
              >
                <span
                  className={
                    isNetProfit
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground"
                  }
                >
                  {r.label}
                </span>
                <span
                  className={
                    isNetProfit
                      ? "font-bold text-blue-700"
                      : r.tone === "neg"
                      ? "font-medium text-rose-600"
                      : r.tone === "muted"
                      ? "text-muted-foreground"
                      : "font-semibold text-foreground"
                  }
                >
                  {r.value}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Highlight cards */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {highlightCards.map((h) => (
          <div
            key={h.label}
            className="rounded-[20px] border border-border/70 bg-white p-4 text-center shadow-sm"
          >
            <div className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">
              {h.label}
            </div>
            <div className="mt-1 text-xl md:text-2xl font-extrabold tracking-tight text-blue-700">
              {h.value}
            </div>
          </div>
        ))}
      </div>

      {/* Split line */}
      <p className="mt-5 text-center text-sm text-foreground/80">
        {splitLine}
      </p>

      {/* Disclaimer */}
      <p className="mt-4 text-center text-xs text-muted-foreground max-w-3xl mx-auto leading-relaxed">
        {disclaimer}
      </p>

      {/* CTA Row */}
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg" className="rounded-full brand-gradient text-white btn-glow">
          <Link to={ctaPrimary.to}>
            {ctaPrimary.label} <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-full">
          <Link to={ctaSecondary.to}>
            <CalendarCheck className="mr-1 h-4 w-4" />
            {ctaSecondary.label}
          </Link>
        </Button>
      </div>
    </section>
  );
}
