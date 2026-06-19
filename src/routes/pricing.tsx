import { createFileRoute } from "@tanstack/react-router";
import { PricingSection } from "@/components/site/PricingSection";

import { FinalCTA } from "@/components/site/FinalCTA";
import { Section, Disclaimer } from "@/components/site/Section";
import { CheckCircle2, XCircle } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Marketplace Plan Pricing | Ray Ecommerce" },
      { name: "description", content: "Transparent pricing for Walmart Marketplace, TikTok Shop, and eBay operations plans from Ray Ecommerce." },
      { property: "og:title", content: "Marketplace Plan Pricing | Ray Ecommerce" },
      { property: "og:description", content: "Walmart $499, TikTok $299, eBay $99 starting plans." },
    ],
  }),
  component: PricingPage,
});

const ROWS = [
  ["Marketplace Setup Support", true, true, true],
  ["Product Research", true, true, true],
  ["Listing Management", true, true, true],
  ["Supplier Coordination", true, false, false],
  ["Order Management Support", true, true, true],
  ["Customer Support", true, true, true],
  ["Content Strategy Guidance", false, true, false],
  ["Dedicated Account Support", true, false, false],
  ["Transparent Reporting", true, true, "Monthly"],
  ["Scaling Strategy", true, false, false],
] as const;

function Cell({ v }: { v: boolean | string }) {
  if (typeof v === "string") return <span className="text-sm">{v}</span>;
  return v ? <CheckCircle2 className="h-5 w-5 text-success mx-auto" /> : <XCircle className="h-5 w-5 text-muted-foreground/50 mx-auto" />;
}

function PricingPage() {
  return (
    <>
      <section className="brand-gradient-soft">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-20 md:py-28 text-center">
          <div className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-primary">PLANS</div>
          <h1 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.05]">Marketplace Plans That Match Your Strategy</h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">Walmart Marketplace is our primary plan. TikTok Shop and eBay plans support multi-channel expansion.</p>
        </div>
      </section>

      <PricingSection />

      <Section eyebrow="Compare" title="Plan Comparison">
        <div className="overflow-x-auto">
          <table className="w-full rounded-3xl overflow-hidden border border-border bg-white">
            <thead className="bg-muted">
              <tr className="text-left">
                <th className="p-4 text-sm font-bold">What's Included</th>
                <th className="p-4 text-sm font-bold text-center bg-primary/10">Walmart $499</th>
                <th className="p-4 text-sm font-bold text-center">TikTok $299</th>
                <th className="p-4 text-sm font-bold text-center">eBay $99</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="p-4 text-sm font-medium">{r[0]}</td>
                  <td className="p-4 text-center bg-primary/5"><Cell v={r[1]} /></td>
                  <td className="p-4 text-center"><Cell v={r[2]} /></td>
                  <td className="p-4 text-center"><Cell v={r[3]} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Disclaimer>
          Prices may represent setup, onboarding, or management package starting points. Marketplace fees, supplier costs, advertising costs, software tools, and other operational expenses may apply separately.
        </Disclaimer>
      </Section>

      <Section eyebrow="What May Cost Extra" title="Operational Expenses Outside Plan Pricing" center={false}>
        <ul className="grid md:grid-cols-2 gap-3 text-sm text-foreground/80 max-w-3xl">
          {["Marketplace fees and commissions", "Supplier and product costs", "Shipping and fulfillment costs", "Advertising and promotional spend", "Optional software, tools, or subscriptions", "Taxes and regulatory fees"].map((t) => (
            <li key={t} className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /> {t}</li>
          ))}
        </ul>
      </Section>

      
      <FinalCTA />
    </>
  );
}
