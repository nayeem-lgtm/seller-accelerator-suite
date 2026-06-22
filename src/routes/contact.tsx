import { createFileRoute } from "@tanstack/react-router";
import { CalendlyEmbed } from "@/components/site/FreeSampleSection";
import { ShieldCheck, Sparkles, Clock, Lock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Schedule Your Free Strategy Call | Ray Ecommerce" },
      { name: "description", content: "Book a quick strategy call with our team to discuss your marketplace goals, onboarding process, and next steps." },
      { property: "og:title", content: "Schedule Your Free Strategy Call | Ray Ecommerce" },
      { property: "og:description", content: "Book a quick strategy call with our team to discuss your marketplace goals, onboarding process, and next steps." },
    ],
  }),
  component: ContactPage,
});

const CALENDLY_URL = "https://calendly.com/ecommerce-rayadvertising/30min";

function TrustCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-3xl border border-border bg-white p-6 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.18)] hover:-translate-y-1 hover:shadow-[0_18px_50px_-22px_rgba(37,99,235,0.28)] transition">
      <div className="h-11 w-11 rounded-2xl brand-gradient grid place-items-center text-white shadow-md">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-base md:text-lg font-bold tracking-tight">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="brand-gradient-soft">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-20 md:py-24 text-center">
          <div className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-primary">
            Contact
          </div>
          <h1 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight">
            Schedule Your Free Strategy Call
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Book a quick strategy call with our team to discuss your marketplace goals, onboarding process, and next steps.
          </p>
          <div className="mt-6 mx-auto max-w-2xl rounded-2xl border border-primary/15 bg-white/80 backdrop-blur px-5 py-3 shadow-sm flex items-start gap-3 text-left">
            <div className="h-9 w-9 rounded-xl brand-gradient grid place-items-center text-white shadow-md shrink-0">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <p className="text-sm text-foreground/80">
              Your inquiry is reviewed by the professional team behind{" "}
              <span className="font-bold text-primary">Ray Advertising</span> to ensure timely support and business guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Calendly Booking Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="mx-auto max-w-[900px] px-4 lg:px-8">
          <div className="text-center mb-8 animate-fade-up">
            <div className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Book a Call</div>
            <h2 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Pick a time that works for you
            </h2>
            <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Our specialists will walk you through platform options, pricing, and next steps.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-white shadow-[0_20px_60px_-25px_rgba(37,99,235,0.25)] overflow-hidden animate-fade-up">
            <div className="calendly-wrapper">
              <CalendlyEmbed url={CALENDLY_URL} />
            </div>
          </div>

          {/* Trust Cards */}
          <div className="mt-12 grid sm:grid-cols-3 gap-5 animate-fade-up">
            <TrustCard
              icon={Sparkles}
              title="Seller Guidance"
              description="Receive marketplace guidance before getting started."
            />
            <TrustCard
              icon={Clock}
              title="Fast Response"
              description="Our team typically responds within one business day."
            />
            <TrustCard
              icon={Lock}
              title="Private Consultation"
              description="Your discussion remains confidential."
            />
          </div>

          <div className="mt-10 text-center animate-fade-up">
            <p className="text-[11px] md:text-xs text-muted-foreground italic max-w-2xl mx-auto">
              Prefer to email? Reach us at{" "}
              <a
                href="mailto:ecommerce@rayadvertising.com"
                className="underline underline-offset-2 hover:text-primary transition-colors"
              >
                ecommerce@rayadvertising.com
              </a>
              {" "}or call{" "}
              <a
                href="tel:+18888709196"
                className="underline underline-offset-2 hover:text-primary transition-colors"
              >
                +1 (888) 870-9196
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
