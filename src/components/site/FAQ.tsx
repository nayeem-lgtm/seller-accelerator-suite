import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Section } from "./Section";

export type FAQItem = { q: string; a: string };

const DEFAULTS: FAQItem[] = [
  { q: "How does marketplace operations work?", a: "Ray Ecommerce manages the operational side of running a marketplace store — including setup support, product research, listing creation, supplier coordination, order processing, customer support, and reporting — while you remain the owner of your marketplace account." },
  { q: "Why is Walmart Marketplace the first priority?", a: "Walmart Marketplace offers qualified sellers access to a trusted retail ecosystem with strong buyer intent and professional standards. We help clients structure operations to align with marketplace expectations, though approval and results are not guaranteed." },
  { q: "Do I need to store inventory?", a: "In most managed workflows, inventory storage is not required from you. Suppliers and fulfillment partners coordinate shipping, and Ray Ecommerce supports tracking and updates." },
  { q: "Who receives marketplace payouts?", a: "Marketplace payouts typically go directly to your own marketplace account. You own the account and the funds. Ray Ecommerce supports day-to-day operations and reporting." },
  { q: "Is income or approval guaranteed?", a: "No. Ray Ecommerce does not guarantee marketplace approval, sales, revenue, rankings, or profit. Results vary based on product selection, supplier pricing, marketplace rules, account health, demand, competition, and other factors." },
  { q: "Which marketplace is best for me?", a: "For most serious sellers, we recommend starting with Walmart Marketplace. TikTok Shop can be a strong second option for creator-commerce growth, while eBay can serve as a lean starter or secondary channel." },
  { q: "How long does setup take?", a: "Onboarding starts in under a minute. Full store setup timelines depend on marketplace review timing, document readiness, and product selection." },
  { q: "What does Ray Ecommerce manage?", a: "Marketplace strategy, store setup support, product research, listing creation, supplier coordination, order processing support, customer support, store optimization, and growth reporting." },
];

export function FAQ({ items = DEFAULTS, title = "Frequently Asked Questions" }: { items?: FAQItem[]; title?: string }) {
  return (
    <Section title={title} eyebrow="FAQ">
      <div className="mx-auto max-w-3xl">
        <Accordion type="single" collapsible className="space-y-3">
          {items.map((it, i) => (
            <AccordionItem
              key={i}
              value={`i${i}`}
              className="rounded-2xl border border-border bg-white px-5 data-[state=open]:shadow-md"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline">{it.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{it.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
