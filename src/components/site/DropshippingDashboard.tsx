import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type BreakdownRow = { label: string; value: string; highlight?: boolean; tone?: "neg" | "pos" | "muted" };

export type CategoryCard = {
  title: string;
  monthlyOrders: string;
  avgSalePrice: string;
  grossRevenue: string;
  platformFee: string;
  supplierShipping: string;
  productCost: string;
  totalCosts: string;
  netProfitBeforeSplit: string;
  rayShare: string;
  clientKeeps: string;
};

export type StoryCard = {
  badge: string;
  title: string;
  text: string;
};

export type DropshippingDashboardProps = {
  platform: "walmart" | "tiktok" | "ebay";
  title: string;
  subtitle: string;
  rows: BreakdownRow[];
  margin: string;
  roi: string;
  rayShare: string;
  clientShare: string;
  splitNote?: string;
  categoryTitle?: string;
  categoryCards: CategoryCard[];
  story: StoryCard;
  applyTo?: string;
  strategyHref?: string;
};

const SECTION_DISCLAIMER =
  "These examples are for illustration only. Actual results depend on product selection, supplier pricing, marketplace approval, demand, competition, shipping cost, refund rate, account health, and execution. Sales, profit, approval, or performance results are not guaranteed.";

const BOTTOM_DISCLAIMER =
  "Disclaimer: All numbers shown are illustrative examples only and are not guarantees of sales, profit, marketplace approval, or business performance. Actual results depend on marketplace approval, product demand, supplier cost, shipping cost, competition, pricing, account health, refund rate, customer behavior, and execution. Ray Ecommerce provides marketplace support, product research, listing support, supplier coordination guidance, order flow support, shipping support, customer communication guidance, profit tracking, reporting, and application support.";

const HELPS = [
  "Product research and category selection",
  "Supplier cost review",
  "Listing optimization support",
  "Pricing and profit tracking",
  "Order flow coordination",
  "Shipping and fulfillment guidance",
  "Customer communication guidance",
  "Monthly performance reporting",
  "Profit split tracking",
];

const CALENDLY = "https://calendly.com/ecommerce-rayadvertising/30min";

export function DropshippingDashboard({
  platform,
  title,
  subtitle,
  rows,
  margin,
  roi,
  rayShare,
  clientShare,
  splitNote = "Per-sale split — Ray Ecommerce 40%, Client 60%.",
  categoryTitle = "Category-Wise Sales & Profit Management",
  categoryCards,
  story,
  strategyHref = CALENDLY,
}: DropshippingDashboardProps) {
  const navigate = useNavigate();
  const handleSeeNow = () => {
    try {
      sessionStorage.setItem(
        "ray_jump_to_payment",
        JSON.stringify({
          platform,
          margin,
          roi,
          rayShare,
          clientShare,
        }),
      );
    } catch {}
    navigate({ to: "/seller-onboarding" });
  };
  return (
    <section className="relative bg-white">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50/60 via-white to-white" />
      <div className="mx-auto max-w-6xl px-4 lg:px-6 py-16 md:py-24 space-y-16">
        {/* HEADER */}
        <header className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
          <p className="mt-4 text-xs md:text-sm text-muted-foreground/90 italic leading-relaxed">
            {SECTION_DISCLAIMER}
          </p>
        </header>

        {/* PER-SALE BREAKDOWN */}
        <div className="grid lg:grid-cols-5 gap-6 items-start">
          <div className="lg:col-span-3 rounded-3xl border border-blue-100/80 bg-white shadow-[0_8px_40px_-20px_rgba(37,99,235,0.25)] overflow-hidden">
            <div className="px-6 md:px-8 py-5 border-b border-border/60 bg-gradient-to-r from-blue-50/80 to-white">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-blue-600/10 text-blue-700 grid place-items-center">
                  <TrendingUp className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-foreground">Per-Sale Profit Breakdown</h3>
                  <p className="text-xs text-muted-foreground">Illustrative single-order example</p>
                </div>
              </div>
            </div>
            <ul className="divide-y divide-border/60">
              {rows.map((r) => (
                <li
                  key={r.label}
                  className={`flex items-center justify-between px-6 md:px-8 py-4 text-sm md:text-[15px] transition ${
                    r.highlight ? "bg-blue-50/70" : "hover:bg-muted/20"
                  }`}
                >
                  <span className={r.highlight ? "font-semibold text-foreground" : "text-muted-foreground"}>
                    {r.label}
                  </span>
                  <span
                    className={
                      r.highlight
                        ? "font-bold text-blue-700 text-base md:text-lg tabular-nums"
                        : r.tone === "neg"
                          ? "font-medium text-foreground tabular-nums"
                          : "font-medium text-foreground tabular-nums"
                    }
                  >
                    {r.value}
                  </span>
                </li>
              ))}
            </ul>
            <div className="px-6 md:px-8 py-4 bg-muted/20 border-t border-border/60 text-xs text-muted-foreground">
              {splitNote}
            </div>
          </div>

          {/* Highlight metrics */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-3">
            {[
              { label: "Margin", value: margin, blue: false },
              { label: "ROI", value: roi, blue: true },
              { label: "Ray Ecommerce 40%", value: rayShare, blue: false },
              { label: "Client Share 60%", value: clientShare, blue: true },
            ].map((m) => (
              <div
                key={m.label}
                className={`rounded-2xl border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md ${
                  m.blue
                    ? "border-blue-200 shadow-[0_0_0_4px_rgba(59,130,246,0.06)]"
                    : "border-border/70 shadow-sm"
                }`}
              >
                <div className="text-[10.5px] font-semibold tracking-wider uppercase text-muted-foreground">
                  {m.label}
                </div>
                <div className={`mt-1 text-xl md:text-2xl font-extrabold tracking-tight tabular-nums ${m.blue ? "text-blue-700" : "text-foreground"}`}>
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CATEGORY-WISE */}
        <div>
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{categoryTitle}</h3>
            <p className="mt-3 text-sm md:text-base text-muted-foreground">
              Illustrative monthly snapshots showing category-level revenue, cost, and profit split.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categoryCards.map((c) => (
              <article
                key={c.title}
                className="rounded-2xl border border-border/70 bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-foreground">{c.title}</h4>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10.5px] font-semibold">
                    <CheckCircle2 className="h-3 w-3" /> Active
                  </span>
                </div>

                <dl className="mt-5 space-y-2 text-sm">
                  {[
                    ["Monthly orders", c.monthlyOrders],
                    ["Avg. sale price", c.avgSalePrice],
                    ["Gross revenue", c.grossRevenue],
                    ["Platform fee", c.platformFee],
                    ["Supplier shipping", c.supplierShipping],
                    ["Product cost", c.productCost],
                    ["Total costs", c.totalCosts],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="font-medium text-foreground tabular-nums">{v}</dd>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2.5 border-t border-border/60">
                    <dt className="font-semibold text-foreground">Net profit before split</dt>
                    <dd className="font-bold text-foreground tabular-nums">{c.netProfitBeforeSplit}</dd>
                  </div>
                </dl>

                {/* Profit split bar */}
                <div className="mt-4">
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden flex">
                    <div className="h-full bg-blue-300/70" style={{ width: "40%" }} />
                    <div className="h-full bg-blue-600" style={{ width: "60%" }} />
                  </div>
                  <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                    <span>Ray 40% · <span className="font-semibold text-foreground tabular-nums">{c.rayShare}</span></span>
                    <span>Client 60% · <span className="font-semibold text-blue-700 tabular-nums">{c.clientKeeps}</span></span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* STORY CARD */}
        <div className="relative rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/80 via-white to-white p-8 md:p-10 shadow-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600/10 text-blue-700 px-3 py-1 text-[11px] font-semibold tracking-wider uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            {story.badge}
          </span>
          <h3 className="mt-4 text-2xl md:text-3xl font-bold tracking-tight">{story.title}</h3>
          <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl">
            {story.text}
          </p>
        </div>

        {/* PROFIT SPLIT VISUAL */}
        <div className="rounded-3xl border border-border/70 bg-white p-8 md:p-10 shadow-sm">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-xl md:text-2xl font-bold tracking-tight">Profit Split</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Client share is calculated after marketplace fees, product cost, supplier shipping, and other direct order costs.
            </p>
          </div>
          <div className="mt-6 max-w-2xl mx-auto">
            <div className="h-5 w-full rounded-full bg-muted overflow-hidden flex shadow-inner">
              <div className="h-full bg-blue-300/80 grid place-items-center text-[11px] font-semibold text-blue-900" style={{ width: "40%" }}>
                Ray 40%
              </div>
              <div className="h-full bg-blue-600 grid place-items-center text-[11px] font-semibold text-white" style={{ width: "60%" }}>
                Client 60%
              </div>
            </div>
          </div>
        </div>

        {/* WHAT RAY HELPS MANAGE */}
        <div className="rounded-3xl border border-border/70 bg-white p-8 md:p-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-700 grid place-items-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight">What Ray Ecommerce Helps Manage</h3>
          </div>
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {HELPS.map((h) => (
              <li
                key={h}
                className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-white p-4 hover:border-blue-200 hover:bg-blue-50/40 transition"
              >
                <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* FINAL CTA */}
        <div className="rounded-3xl brand-gradient text-white p-8 md:p-12 text-center shadow-xl">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
            Want to See Your Estimated Dropshipping Profit?
          </h3>
          <p className="mt-3 text-sm md:text-base text-white/90 max-w-2xl mx-auto">
            Apply now and Ray Ecommerce can review your selected platform, product category, and estimated cost structure before you start.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              onClick={handleSeeNow}
              className="rounded-full bg-white text-blue-700 hover:bg-white/90"
            >
              See Now <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* BOTTOM DISCLAIMER */}
        <p className="text-[11.5px] leading-relaxed text-muted-foreground text-center max-w-4xl mx-auto">
          {BOTTOM_DISCLAIMER}
        </p>
      </div>
    </section>
  );
}
