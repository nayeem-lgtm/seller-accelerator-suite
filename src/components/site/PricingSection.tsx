import { Link } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Section, Disclaimer } from "./Section";
import { PlatformLogo } from "./PlatformLogo";

const PLANS = [
  {
    key: "walmart" as const,
    name: "Walmart",
    price: 499,
    badge: "Enterprise Choice",
    featured: true,
    cta: "Choose Walmart",
    ctaText: "Choose Walmart",
    features: [
      "Walmart Marketplace Setup Support",
      "Supplier Network Coordination",
      "Advanced Product Research",
      "Listing Optimization",
      "Order Management Support",
      "Dedicated Support",
      "Transparent Reporting",
      "Scaling Strategy",
    ],
  },
  {
    key: "tiktok" as const,
    name: "TikTok Shop",
    price: 299,
    badge: "Growth Channel",
    featured: false,
    cta: "Choose TikTok Shop",
    ctaText: "Choose TikTok Shop",
    features: [
      "TikTok Shop Setup Support",
      "Product Research",
      "Content Strategy Guidance",
      "Listing Management",
      "Order Management Support",
      "Customer Service Support",
      "Growth Reporting",
    ],
  },
  {
    key: "ebay" as const,
    name: "eBay",
    price: 99,
    badge: "Starter Channel",
    featured: false,
    cta: "Choose eBay",
    ctaText: "Choose eBay",
    features: [
      "Store Setup Support",
      "Product Research",
      "Listing Management",
      "Order Processing Support",
      "Customer Support",
      "Monthly Reporting",
    ],
  },
];


export function PricingSection() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    if (hovered !== null) return;
    const id = setInterval(() => setActive((a) => (a + 1) % PLANS.length), 3000);
    return () => clearInterval(id);
  }, [hovered]);

  const current = hovered ?? active;

  return (
    <Section
      id="pricing"
      eyebrow="PLANS"
      title="Choose Your Marketplace Plan"
      subtitle="Start with Walmart Marketplace for a premium marketplace strategy, or choose TikTok Shop or eBay based on your business goals."
    >
      <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {PLANS.map((p, i) => {
          const isActive = i === current;
          return (
            <div
              key={p.name}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={`relative rounded-3xl border cursor-pointer flex flex-col h-full transition-all duration-700 ease-in-out will-change-transform ${
                isActive
                  ? "brand-gradient text-white border-transparent shadow-[0_20px_50px_-12px_rgba(59,130,246,0.35)] -translate-y-2 scale-[1.02]"
                  : "bg-white border-border shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] hover:shadow-xl hover:-translate-y-0.5 text-foreground"
              }`}
            >
              {isActive && (
                <div
                  className="pointer-events-none absolute inset-0 rounded-3xl bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.08)_50%,transparent_75%)] bg-[length:200%_100%] animate-shimmer"
                  aria-hidden="true"
                />
              )}
              {p.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-spark text-navy text-xs font-bold inline-flex items-center gap-1 z-10">
                  <Sparkles className="h-3 w-3" /> Featured
                </div>
              )}
              <div className="relative z-10 p-7 md:p-8 flex flex-col h-full">
                <div className="flex items-center justify-between gap-3">
                  <div className={`inline-flex text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full transition-colors duration-700 ${isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>
                    {p.badge}
                  </div>
                  <div className={`inline-flex items-center justify-center rounded-xl px-2.5 py-1.5 transition-colors duration-700 ${isActive ? "bg-white" : "bg-white border border-border"}`}>
                    <PlatformLogo platform={p.key} className="h-5 w-auto" />
                  </div>
                </div>
                <h3 className={`mt-4 text-xl font-bold transition-colors duration-700 ${isActive ? "text-white" : "text-foreground"}`}>
                  {p.name}
                </h3>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className={`text-5xl font-bold transition-colors duration-700 ${isActive ? "text-white" : "text-foreground"}`}>
                    ${p.price}
                  </span>
                  <span className={`text-sm transition-colors duration-700 ${isActive ? "text-white/70" : "text-muted-foreground"}`}>
                    starting
                  </span>
                </div>
                <ul className="mt-6 space-y-2.5 flex-grow">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2 items-start text-sm">
                      <Check className={`h-4 w-4 mt-0.5 shrink-0 transition-colors duration-700 ${isActive ? "text-white" : "text-success"}`} />
                      <span className={`transition-colors duration-700 ${isActive ? "text-white/90" : "text-foreground/80"}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className={`mt-7 w-full rounded-full transition-all duration-700 ${
                    isActive ? "bg-white text-primary hover:bg-white/90" : "brand-gradient text-white btn-glow"
                  }`}
                >
                  <Link
                    to="/seller-onboarding"
                    onClick={() => { try { sessionStorage.setItem("ray_selected_plan", p.name); } catch {} }}
                  >
                    {p.cta}
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <Disclaimer>
        Prices may represent setup, onboarding, or management package starting points. Marketplace fees,
        supplier costs, advertising costs, software tools, and other operational expenses may apply separately.
      </Disclaimer>
    </Section>
  );
}
