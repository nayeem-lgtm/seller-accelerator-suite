import { createFileRoute } from "@tanstack/react-router";
import { CalendlyEmbed } from "@/components/site/FreeSampleSection";
import { ShieldCheck, Sparkles, Clock, Lock, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { submitContactQuery } from "@/lib/leads";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const COUNTRY_CODES = [
  { code: "+1", label: "United States", flag: "🇺🇸" },
  { code: "+1", label: "Canada", flag: "🇨🇦", id: "ca" },
  { code: "+44", label: "United Kingdom", flag: "🇬🇧" },
  { code: "+880", label: "Bangladesh", flag: "🇧🇩" },
  { code: "+91", label: "India", flag: "🇮🇳" },
  { code: "+971", label: "UAE", flag: "🇦🇪" },
  { code: "+61", label: "Australia", flag: "🇦🇺" },
];

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

function QueryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    countryCode: "+1-us",
    phone: "",
    marketplace: "",
    queryType: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next.fullName = "Required";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = "Valid email required";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 6) next.phone = "Valid phone required";
    if (!form.marketplace) next.marketplace = "Required";
    if (!form.queryType) next.queryType = "Required";
    if (!form.message.trim()) next.message = "Required";
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    const selected = COUNTRY_CODES.find(
      (c) => (c.id ? `${c.code}-${c.id}` : c.code) === form.countryCode,
    );
    setSubmitting(true);
    try {
      await submitContactQuery({
        full_name: form.fullName.trim(),
        email: form.email.trim(),
        phone_country_code: selected?.code ?? "+1",
        phone_number: form.phone.trim(),
        selected_service: form.marketplace || null,
        query_type: form.queryType || null,
        message: form.message.trim(),
        source_page: typeof window !== "undefined" ? window.location.pathname : null,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("[contact] submit failed", err);
      toast.error("Something went wrong. Please check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-border bg-white shadow-[0_20px_60px_-25px_rgba(37,99,235,0.25)] p-8 md:p-10 text-center">
        <div className="mx-auto h-14 w-14 rounded-2xl brand-gradient grid place-items-center text-white shadow-md">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="mt-5 text-xl md:text-2xl font-bold tracking-tight">Query received</h3>
        <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
          Thank you. Our team will review your query and contact you soon.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setSubmitted(false);
            setForm({ fullName: "", email: "", countryCode: "+1-us", phone: "", marketplace: "", queryType: "", message: "" });
          }}
          className="mt-6 rounded-full"
        >
          Send another query
        </Button>
      </div>
    );
  }

  const selectedCode = COUNTRY_CODES.find(
    (c) => (c.id ? `${c.code}-${c.id}` : c.code) === form.countryCode,
  );

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl border border-border bg-white shadow-[0_20px_60px_-25px_rgba(37,99,235,0.25)] p-6 md:p-8"
    >
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl brand-gradient grid place-items-center text-white shadow-md">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div>
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">Send a Query</div>
          <h3 className="text-xl md:text-2xl font-bold tracking-tight">Tell Us About Your Store</h3>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        Share your details and our team will contact you with the right next step.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <Label className="text-sm font-medium">Full Name <span className="text-destructive">*</span></Label>
          <Input className="mt-1.5 h-11 rounded-xl" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Your full name" />
          {errors.fullName && <p className="mt-1 text-xs text-destructive">{errors.fullName}</p>}
        </div>

        <div>
          <Label className="text-sm font-medium">Email Address <span className="text-destructive">*</span></Label>
          <Input type="email" className="mt-1.5 h-11 rounded-xl" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
        </div>

        <div>
          <Label className="text-sm font-medium">Phone Number <span className="text-destructive">*</span></Label>
          <div className="mt-1.5 flex items-stretch rounded-xl border border-input bg-white focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0 overflow-hidden">
            <Select value={form.countryCode} onValueChange={(v) => set("countryCode", v)}>
              <SelectTrigger className="h-11 w-[120px] border-0 rounded-none border-r border-input bg-muted/40 focus:ring-0 focus:ring-offset-0 shadow-none">
                <SelectValue>
                  {selectedCode && (
                    <span className="flex items-center gap-1.5 text-sm">
                      <span>{selectedCode.flag}</span>
                      <span className="font-medium">{selectedCode.code}</span>
                    </span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {COUNTRY_CODES.map((c) => {
                  const id = c.id ? `${c.code}-${c.id}` : c.code;
                  return (
                    <SelectItem key={id} value={id}>
                      <span className="flex items-center gap-2">
                        <span>{c.flag}</span>
                        <span className="font-medium">{c.code}</span>
                        <span className="text-muted-foreground">{c.label}</span>
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="(555) 123-4567"
              className="flex-1 h-11 px-3 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>
          {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Interested Marketplace <span className="text-destructive">*</span></Label>
            <Select value={form.marketplace} onValueChange={(v) => set("marketplace", v)}>
              <SelectTrigger className="mt-1.5 h-11 rounded-xl"><SelectValue placeholder="Select marketplace" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="walmart">Walmart Marketplace</SelectItem>
                <SelectItem value="tiktok">TikTok Shop</SelectItem>
                <SelectItem value="ebay">eBay</SelectItem>
                <SelectItem value="not_sure">Not Sure Yet</SelectItem>
              </SelectContent>
            </Select>
            {errors.marketplace && <p className="mt-1 text-xs text-destructive">{errors.marketplace}</p>}
          </div>

          <div>
            <Label className="text-sm font-medium">Query Type <span className="text-destructive">*</span></Label>
            <Select value={form.queryType} onValueChange={(v) => set("queryType", v)}>
              <SelectTrigger className="mt-1.5 h-11 rounded-xl"><SelectValue placeholder="Select query type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="setup">Marketplace Setup</SelectItem>
                <SelectItem value="management">Store Management</SelectItem>
                <SelectItem value="pricing">Pricing / Plans</SelectItem>
                <SelectItem value="existing">Existing Seller Support</SelectItem>
                <SelectItem value="general">General Question</SelectItem>
              </SelectContent>
            </Select>
            {errors.queryType && <p className="mt-1 text-xs text-destructive">{errors.queryType}</p>}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Message <span className="text-destructive">*</span></Label>
          <Textarea
            rows={5}
            className="mt-1.5 rounded-xl"
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder="Tell us about your store, goals, and what you'd like help with."
          />
          {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
        </div>

        <Button type="submit" className="w-full h-12 rounded-full brand-gradient text-white btn-glow text-base font-bold">
          {submitting ? (
            <>
              <span className="mr-2 h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" /> Submit Query
            </>
          )}
        </Button>

        <p className="text-[11px] text-muted-foreground text-center">
          Your information stays confidential and is reviewed by our team.
        </p>
      </div>
    </form>
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
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-10 animate-fade-up">
            <div className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Two ways to connect</div>
            <h2 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Book a call or send us a query
            </h2>
            <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Pick a time on our calendar or share your details and we'll get back to you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 items-start animate-fade-up">
            {/* Calendly */}
            <div className="rounded-3xl border border-border bg-white shadow-[0_20px_60px_-25px_rgba(37,99,235,0.25)] overflow-hidden">
              <div className="px-6 md:px-8 pt-6 md:pt-8">
                <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">Book a Call</div>
                <h3 className="mt-1 text-xl md:text-2xl font-bold tracking-tight">Pick a time that works for you</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Our specialists will walk you through platform options, pricing, and next steps.
                </p>
              </div>
              <div className="calendly-wrapper mt-4">
                <CalendlyEmbed url={CALENDLY_URL} />
              </div>
            </div>

            {/* Query Form */}
            <QueryForm />
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
