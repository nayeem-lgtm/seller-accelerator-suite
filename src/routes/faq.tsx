import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Rocket,
  Store,
  Settings,
  CreditCard,
  MessageSquare,
  ChevronDown,
  LifeBuoy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Ray Ecommerce Support Center" },
      {
        name: "description",
        content:
          "Clear answers about Ray Ecommerce services, marketplace setup, store management, onboarding, payments, and support for Walmart, TikTok Shop, and eBay sellers.",
      },
      { property: "og:title", content: "FAQ — Ray Ecommerce Support Center" },
      {
        property: "og:description",
        content:
          "Frequently asked questions about Ray Ecommerce marketplace services, plans, and seller support.",
      },
    ],
  }),
  component: FaqPage,
});

type FaqGroup = {
  id: string;
  label: string;
  Icon: typeof Rocket;
  description: string;
  items: { q: string; a: string }[];
};

const GROUPS: FaqGroup[] = [
  {
    id: "getting-started",
    label: "Getting Started",
    Icon: Rocket,
    description: "How Ray Ecommerce works and how to begin.",
    items: [
      {
        q: "What does Ray Ecommerce help sellers with?",
        a: "Ray Ecommerce helps sellers with marketplace setup, store management, product research, listing support, fulfillment planning, reporting, and ongoing service support for platforms like Walmart, TikTok Shop, and eBay.",
      },
      {
        q: "Which marketplaces does Ray Ecommerce support?",
        a: "Ray Ecommerce currently focuses on Walmart Marketplace, TikTok Shop, and eBay. Each platform has its own service page, plan options, and onboarding process.",
      },
      {
        q: "Do I need an existing seller account to get started?",
        a: "No. If you already have a seller account, we can help with store management and service setup. If you do not have an account yet, our team can guide you through the required onboarding steps.",
      },
    ],
  },
  {
    id: "marketplace-services",
    label: "Marketplace Services",
    Icon: Store,
    description: "What our marketplace services include.",
    items: [
      {
        q: "Is Ray Ecommerce focused on Walmart, TikTok Shop, and eBay?",
        a: "Yes. Our services are built around helping sellers launch, manage, and grow on Walmart Marketplace, TikTok Shop, and eBay with a structured and professional process.",
      },
      {
        q: "Does Ray Ecommerce guarantee approval or sales?",
        a: "No. We do not guarantee marketplace approval, revenue, or sales results. Our role is to provide professional support, guidance, setup assistance, management services, and growth-focused execution based on each platform's process.",
      },
      {
        q: "Who owns the marketplace account?",
        a: "The seller owns their marketplace account. Ray Ecommerce only provides service support and management based on the selected plan and authorization.",
      },
    ],
  },
  {
    id: "account-management",
    label: "Account & Store Management",
    Icon: Settings,
    description: "How store access and management works.",
    items: [
      {
        q: "Will Ray Ecommerce need access to my seller account?",
        a: "If store management support is required, we may need authorized access to perform service-related tasks. Access is used only for approved work such as listings, reporting, store updates, and management support.",
      },
      {
        q: "Can I keep control of my store?",
        a: "Yes. The seller remains the owner of the account and keeps full control. Ray Ecommerce supports the store based on the service agreement and selected plan.",
      },
      {
        q: "What kind of tasks can Ray Ecommerce manage?",
        a: "Depending on the platform and plan, our team may assist with product research, listing optimization, store updates, inventory coordination, order-related support, reporting, and communication guidance.",
      },
    ],
  },
  {
    id: "payments-plans",
    label: "Payments & Plans",
    Icon: CreditCard,
    description: "Service plans, pricing, and payouts.",
    items: [
      {
        q: "Where can I see the service plans?",
        a: "You can view available plans on the Plans page. Each plan is designed to help sellers choose the right level of support based on their marketplace goals.",
      },
      {
        q: "Are payments connected to the marketplace account?",
        a: "Marketplace payouts and account payments are handled through the seller's own marketplace account. Ray Ecommerce service payments are separate and based on the selected service plan.",
      },
      {
        q: "Can I speak with someone before choosing a plan?",
        a: "Yes. You can contact Ray Ecommerce or schedule a consultation before selecting a plan so our team can better understand your needs.",
      },
    ],
  },
  {
    id: "support",
    label: "Support & Communication",
    Icon: MessageSquare,
    description: "How our team supports you after signup.",
    items: [
      {
        q: "How does communication work after I sign up?",
        a: "After signup, our team will guide you through the next steps, required details, and service process. Communication may happen through email, calls, or the preferred contact method available on the website.",
      },
      {
        q: "How fast will someone contact me?",
        a: "Our team aims to respond as quickly as possible during business hours. For service-related inquiries, a Ray Ecommerce representative will follow up with the next steps.",
      },
      {
        q: "Where should I go if I still have questions?",
        a: "You can use the Contact Us page to reach the Ray Ecommerce team directly.",
      },
    ],
  },
];

function FaqPage() {
  const [active, setActive] = useState<string>(GROUPS[0].id);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 brand-gradient-soft" />
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 backdrop-blur px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase text-primary">
            <LifeBuoy className="h-3.5 w-3.5" /> Ray Ecommerce Support Center
          </div>
          <h1 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.05]">
            Frequently Asked{" "}
            <span className="bg-clip-text text-transparent brand-gradient">
              Questions
            </span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Clear answers about Ray Ecommerce services, marketplace setup, store
            management, onboarding, payments, and support.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-full brand-gradient text-white btn-glow">
              <Link to="/contact">
                Contact Us <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CATEGORY CARDS */}
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {GROUPS.map((g) => {
              const isActive = active === g.id;
              return (
                <a
                  key={g.id}
                  href={`#${g.id}`}
                  onClick={() => setActive(g.id)}
                  className={`group rounded-2xl border bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-20px_rgba(59,130,246,0.35)] ${
                    isActive
                      ? "border-primary/40 shadow-[0_18px_40px_-20px_rgba(59,130,246,0.35)]"
                      : "border-border"
                  }`}
                >
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                      isActive
                        ? "bg-primary text-white"
                        : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                    }`}
                  >
                    <g.Icon className="h-5 w-5" />
                  </span>
                  <div className="mt-4 text-sm font-semibold text-foreground">
                    {g.label}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {g.description}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ACCORDION SECTIONS */}
      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-3xl px-4 lg:px-8 space-y-12">
          {GROUPS.map((g) => (
            <div key={g.id} id={g.id} className="scroll-mt-24">
              <div className="mb-5 flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <g.Icon className="h-4 w-4" />
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                  {g.label}
                </h2>
              </div>
              <Accordion type="single" collapsible className="space-y-3">
                {g.items.map((it, i) => (
                  <AccordionItem
                    key={i}
                    value={`${g.id}-${i}`}
                    className="rounded-2xl border border-border bg-white px-5 data-[state=open]:shadow-md data-[state=open]:border-primary/30 transition-all"
                  >
                    <AccordionTrigger className="text-left font-semibold hover:no-underline">
                      {it.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {it.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-white p-8 md:p-12 shadow-[0_30px_80px_-40px_rgba(59,130,246,0.45)]">
            <div className="absolute inset-0 -z-10 brand-gradient-soft opacity-70" />
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Still Have Questions?
              </div>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight max-w-2xl">
                Talk with the Ray Ecommerce team
              </h2>
              <p className="mt-3 text-muted-foreground max-w-xl">
                Get clear guidance before choosing your marketplace service plan.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Button asChild size="lg" className="rounded-full brand-gradient text-white btn-glow">
                  <Link to="/contact">
                    Contact Us <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <Link to="/pricing">View Plans</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
