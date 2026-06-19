import { useEffect, useRef, useState } from "react";
import { Phone, Mail, MapPin, Calendar, Clock, AlertCircle, RefreshCw, ExternalLink } from "lucide-react";
import { Section } from "./Section";
import { Button } from "@/components/ui/button";

const CALENDLY_URL = "https://calendly.com/ecommerce-rayadvertising/30min";

function CalendlySkeleton() {
  return (
    <div className="w-full h-full p-6 md:p-8 flex flex-col gap-6 animate-pulse">
      {/* Header shimmer */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-40 rounded bg-muted" />
          <div className="h-3 w-24 rounded bg-muted" />
        </div>
      </div>
      {/* Month selector */}
      <div className="h-8 w-48 rounded-lg bg-muted" />
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-lg bg-muted" />
        ))}
      </div>
      {/* Time slots */}
      <div className="space-y-2 mt-2">
        <div className="h-3 w-20 rounded bg-muted" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}

function CalendlyError({ url, onRetry }: { url: string; onRetry: () => void }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
      <div className="h-14 w-14 rounded-2xl bg-destructive/10 grid place-items-center">
        <AlertCircle className="h-7 w-7 text-destructive" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-foreground">Scheduler temporarily unavailable</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        The booking widget is taking longer than expected to load. You can open Calendly directly or try again.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button onClick={onRetry} variant="outline" className="rounded-full">
          <RefreshCw className="mr-1.5 h-4 w-4" /> Try Again
        </Button>
        <Button asChild className="rounded-full brand-gradient text-white">
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-1.5 h-4 w-4" /> Open Calendly
          </a>
        </Button>
      </div>
    </div>
  );
}

export function CalendlyEmbed({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const container = containerRef.current;

    // Inject Calendly script once
    const existing = document.getElementById("calendly-widget-script");
    if (!existing) {
      const script = document.createElement("script");
      script.id = "calendly-widget-script";
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // Watch for Calendly content to appear inside the container
    const observer = new MutationObserver(() => {
      const hasContent = container.querySelector("iframe, .calendly-spinner, .calendly-overlay") !== null;
      if (hasContent) {
        setStatus("loaded");
      }
    });

    observer.observe(container, { childList: true, subtree: true });

    // Fallback timeout
    const timeout = window.setTimeout(() => {
      const hasContent = container.querySelector("iframe, .calendly-spinner, .calendly-overlay") !== null;
      if (!hasContent) {
        setStatus("error");
      }
    }, 8000);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, []);

  const handleRetry = () => {
    setStatus("loading");
    // Force a re-render by clearing and re-injecting
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }
    // Re-trigger script load by removing and re-adding script
    const existing = document.getElementById("calendly-widget-script");
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.id = "calendly-widget-script";
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
  };

  return (
    <div className="relative" style={{ minWidth: "320px", height: "750px", width: "100%" }}>
      {status !== "loaded" && (
        <div className="absolute inset-0 z-10 bg-white">
          {status === "loading" ? <CalendlySkeleton /> : <CalendlyError url={url} onRetry={handleRetry} />}
        </div>
      )}
      <div
        ref={containerRef}
        className="calendly-inline-widget"
        data-url={url}
        style={{ minWidth: "320px", height: "750px", width: "100%" }}
      />
    </div>
  );
}

export function FreeSampleSection() {
  return (
    <Section
      id="free-sample"
      eyebrow="Free Consultation"
      title="Ready To Review Your Marketplace Opportunity?"
      subtitle="Book a free consultation with one of our eCommerce operations specialists and schedule your strategy call."
    >
      <div className="mx-auto max-w-5xl rounded-3xl bg-white border border-border shadow-xl overflow-hidden">
        {/* Calendly inline widget */}
        <CalendlyEmbed url={CALENDLY_URL} />

        {/* Contact details */}
        <div className="border-t border-border px-6 py-6 md:px-10 md:py-8 bg-gradient-to-b from-white to-accent/30">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" /> +1 (888) 870-9196
            </span>
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" /> ecommerce@rayadvertising.com
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> 1267 Willis ST STE 200, Redding, CA 96001
            </span>
          </div>
          <p className="mt-4 text-[11px] text-muted-foreground text-center">
            Marketplace approval, sales, revenue, and profit are not guaranteed.
          </p>
        </div>
      </div>
    </Section>
  );
}
