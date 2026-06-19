import { createFileRoute } from "@tanstack/react-router";
import { CalendlyEmbed } from "@/components/site/FreeSampleSection";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Schedule Your Free Strategy Call | Ray Ecommerce" },
      { name: "description", content: "Book a quick call with our team to discuss your marketplace setup, service option, and next steps." },
      { property: "og:title", content: "Schedule Your Free Strategy Call | Ray Ecommerce" },
      { property: "og:description", content: "Book a quick call with our team to discuss your marketplace setup, service option, and next steps." },
    ],
  }),
  component: ContactPage,
});

const CALENDLY_URL = "https://calendly.com/ecommerce-rayadvertising/30min";

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
            Book a quick call with our team to discuss your marketplace setup, service option, and next steps.
          </p>
        </div>
      </section>

      {/* Calendly Booking Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14 animate-fade-up">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground">
              Pick a time that works for you
            </h2>
            <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
              Our marketplace specialists are available to walk you through platform options, pricing, and what to expect next.
            </p>
            <p className="mt-3 text-xs md:text-sm text-muted-foreground/80">
              No pressure. No obligation. Just clear guidance for your Walmart, TikTok Shop, or eBay business.
            </p>
          </div>

          <div className="mx-auto max-w-5xl">
            <div className="rounded-3xl border border-border bg-white shadow-[0_8px_40px_-20px_rgba(37,99,235,0.18)] overflow-hidden animate-fade-up">
              <div className="calendly-wrapper">
                <CalendlyEmbed url={CALENDLY_URL} />
              </div>
            </div>
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
