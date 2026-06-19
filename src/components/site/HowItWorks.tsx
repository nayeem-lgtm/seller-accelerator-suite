import { Section } from "@/components/site/Section";

export type HowStep = { title: string; description: string };

export function HowItWorks({
  subtitle,
  steps,
}: {
  subtitle?: string;
  steps: HowStep[];
}) {
  return (
    <Section
      eyebrow="Process"
      title="How It Works"
      subtitle={subtitle ?? "Six clear steps. No experience required. No daily involvement from you."}
      center={false}
    >
      <div className="relative max-w-3xl">
        {/* vertical guide line */}
        <div
          aria-hidden
          className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent"
        />
        <ol className="space-y-10">
          {steps.map((step, idx) => (
            <li key={step.title} className="relative pl-16">
              <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full brand-gradient text-white text-xs font-bold tracking-wider shadow-lg ring-4 ring-background">
                {String(idx + 1).padStart(2, "0")}
              </div>
              <h3 className="text-lg md:text-xl font-bold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

export const ebaySteps: HowStep[] = [
  { title: "You Sign Up & Pay $99 Package Fee", description: "You apply and pay the eBay package fee. You provide your eBay seller account details or choose the account setup path — you retain full ownership at all times." },
  { title: "We Set Up a Secure VPS", description: "We configure a virtual private server so our team can securely remote-access your eBay account. Your credentials are never shared insecurely. We add your payment method to the VPS for order fulfillment." },
  { title: "We Stock Your Store", description: "Our team researches and lists products we know will sell with healthy profit margins. We optimize titles, pricing, and categories for maximum visibility." },
  { title: "Orders Come In — We Fulfill Them", description: "When a customer places an order, our team fulfills it using the payment method saved on the VPS. You don't lift a finger. We also handle all customer questions, disputes, returns, and cancellations." },
  { title: "eBay Pays You Directly", description: "Based on eBay's payout protocols, funds from successful transactions go straight to your account. You receive the money — not us." },
  { title: "Monthly Report & Fee Collection", description: "We provide a detailed monthly report showing revenue, operating costs, estimated net profit, and profit share. Where ongoing management is agreed, Ray Ecommerce collects its agreed 40% share of net profit and the client keeps 60%." },
];

export const walmartSteps: HowStep[] = [
  { title: "You Sign Up & Pay $499 Package Fee", description: "You apply and pay the Walmart package fee. You provide your Walmart Marketplace seller account details or choose the account setup path — you retain full ownership at all times." },
  { title: "We Set Up a Secure VPS", description: "We configure a virtual private server so our team can securely remote-access your Walmart account. Your credentials are never shared insecurely. We add your payment method to the VPS for order fulfillment." },
  { title: "We Stock Your Store", description: "Our team researches and lists products aligned with Walmart's premium audience and approval standards. We optimize titles, pricing, and categories for maximum visibility." },
  { title: "Orders Come In — We Fulfill Them", description: "When a customer places an order, our team fulfills it using the payment method saved on the VPS. You don't lift a finger. We also handle all customer questions, disputes, returns, and cancellations." },
  { title: "Walmart Pays You Directly", description: "Based on Walmart's payout protocols, funds from successful transactions go straight to your bank account. You receive the money — not us." },
  { title: "Monthly Report & Fee Collection", description: "We provide a detailed monthly report showing revenue, operating costs, estimated net profit, and profit share. Where ongoing management is agreed, Ray Ecommerce collects its agreed 40% share of net profit and the client keeps 60%." },
];

export const tiktokSteps: HowStep[] = [
  { title: "You Sign Up & Pay $299 Package Fee", description: "You apply and pay the TikTok Shop package fee. You provide your TikTok Shop seller account details or choose the account setup path — you retain full ownership at all times." },
  { title: "We Set Up a Secure VPS", description: "We configure a virtual private server so our team can securely remote-access your TikTok Shop. Your credentials are never shared insecurely. We add your payment method to the VPS for order fulfillment." },
  { title: "We Stock Your Shop", description: "Our team researches trending, discovery-friendly products and lists them with healthy profit margins. We optimize titles, pricing, media, and categories for the TikTok algorithm." },
  { title: "Orders Come In — We Fulfill Them", description: "When a customer places an order, our team fulfills it using the payment method saved on the VPS. You don't lift a finger. We also handle all customer questions, disputes, returns, and cancellations." },
  { title: "TikTok Pays You Directly", description: "Based on TikTok Shop's payout protocols, funds from successful transactions go straight to your account. You receive the money — not us." },
  { title: "Monthly Report & Fee Collection", description: "We provide a detailed monthly report showing revenue, operating costs, estimated net profit, and profit share. Where ongoing management is agreed, Ray Ecommerce collects its agreed 40% share of net profit and the client keeps 60%." },
];
