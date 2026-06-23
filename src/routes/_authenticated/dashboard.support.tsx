import { createFileRoute, Link } from "@tanstack/react-router";
import { LifeBuoy, CalendarClock, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard/support")({
  component: SupportPage,
});

const CALENDLY_URL = "https://calendly.com/ecommerce-rayadvertising/30min";

function SupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Support</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Need help with your seller account? Our team can guide you through the next step.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 text-sm">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">Typical response time:</span>
          <span className="font-medium">Under 24 hours</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="h-10 w-10 rounded-full bg-blue-50 grid place-items-center text-primary"><MessageSquare className="h-5 w-5" /></div>
          <h3 className="mt-4 text-lg font-semibold">Contact Support</h3>
          <p className="mt-1 text-sm text-muted-foreground">Send us a message and our specialists will get back to you shortly.</p>
          <Button asChild className="mt-5 rounded-full brand-gradient text-white btn-glow">
            <Link to="/contact">Contact Support</Link>
          </Button>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="h-10 w-10 rounded-full bg-blue-50 grid place-items-center text-primary"><CalendarClock className="h-5 w-5" /></div>
          <h3 className="mt-4 text-lg font-semibold">Schedule a Strategy Call</h3>
          <p className="mt-1 text-sm text-muted-foreground">Book a 30-minute call with a marketplace specialist to plan your next step.</p>
          <Button asChild className="mt-5 rounded-full brand-gradient text-white btn-glow">
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Schedule Strategy Call</a>
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5 flex items-start gap-3">
        <LifeBuoy className="h-5 w-5 text-primary mt-0.5" />
        <p className="text-sm text-foreground/80">
          Prefer email? Use the contact form and include your account email so we can route your request faster.
        </p>
      </div>
    </div>
  );
}