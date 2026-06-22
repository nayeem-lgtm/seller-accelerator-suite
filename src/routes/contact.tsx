import { createFileRoute } from "@tanstack/react-router";
import { CalendlyEmbed } from "@/components/site/FreeSampleSection";
import { ShieldCheck, Sparkles, Clock, Lock } from "lucide-react";

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

const querySchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  marketplace: z.string().min(1, "Please select a marketplace"),
  queryType: z.string().min(1, "Please select a query type"),
  message: z.string().trim().min(10, "Please share a few details").max(2000),
  contactMethod: z.enum(["email", "phone", "either"]),
});
type QueryForm = z.infer<typeof querySchema>;

function QueryForm() {
  const [form, setForm] = useState<QueryForm>({
    fullName: "",
    email: "",
    phone: "",
    marketplace: "",
    queryType: "",
    message: "",
    contactMethod: "email",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof QueryForm, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof QueryForm>(k: K, v: QueryForm[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = querySchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof QueryForm, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof QueryForm;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success("Thank you. Your query has been received.");
    }, 700);
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-border bg-white p-8 md:p-10 shadow-[0_8px_40px_-20px_rgba(37,99,235,0.18)] text-center">
        <div className="mx-auto h-16 w-16 rounded-full brand-gradient grid place-items-center shadow-lg">
          <CheckCircle2 className="h-8 w-8 text-white" />
        </div>
        <h3 className="mt-5 text-xl md:text-2xl font-bold tracking-tight">Query received</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you. Your query has been received and our team will contact you shortly.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6 rounded-full"
          onClick={() => {
            setSubmitted(false);
            setForm({ fullName: "", email: "", phone: "", marketplace: "", queryType: "", message: "", contactMethod: "email" });
          }}
        >
          Send another query
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-border bg-white p-6 md:p-8 shadow-[0_8px_40px_-20px_rgba(37,99,235,0.18)] space-y-5"
      noValidate
    >
      <div>
        <div className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Send a Query</div>
        <h3 className="mt-1 text-xl md:text-2xl font-bold tracking-tight">Tell us about your store</h3>
        <p className="mt-1 text-xs md:text-sm text-muted-foreground">
          We typically reply within 1 business day.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Full Name" required error={errors.fullName}>
          <Input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Jane Doe" />
        </FormField>
        <FormField label="Email Address" required error={errors.email}>
          <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@business.com" />
        </FormField>
        <FormField label="Phone Number" error={errors.phone}>
          <Input value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} placeholder="+1 (555) 000-0000" />
        </FormField>
        <FormField label="Interested Marketplace" required error={errors.marketplace}>
          <Select value={form.marketplace} onValueChange={(v) => set("marketplace", v)}>
            <SelectTrigger><SelectValue placeholder="Select marketplace" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="walmart">Walmart Marketplace</SelectItem>
              <SelectItem value="tiktok">TikTok Shop</SelectItem>
              <SelectItem value="ebay">eBay</SelectItem>
              <SelectItem value="multi">Multiple Platforms</SelectItem>
              <SelectItem value="not_sure">Not Sure Yet</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Query Type" required full error={errors.queryType}>
          <Select value={form.queryType} onValueChange={(v) => set("queryType", v)}>
            <SelectTrigger><SelectValue placeholder="Select query type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="setup">Marketplace Setup</SelectItem>
              <SelectItem value="management">Store Management</SelectItem>
              <SelectItem value="ads">Ad Management</SelectItem>
              <SelectItem value="existing">Existing Account Help</SelectItem>
              <SelectItem value="pricing">Pricing Question</SelectItem>
              <SelectItem value="partnership">Partnership / Other</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Message" required full error={errors.message}>
          <Textarea
            rows={4}
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder="Tell us about your store, goals, and what you'd like help with."
          />
        </FormField>
        <FormField label="Preferred Contact Method" full>
          <RadioGroup
            value={form.contactMethod}
            onValueChange={(v) => set("contactMethod", v as QueryForm["contactMethod"])}
            className="flex flex-wrap gap-2 pt-1"
          >
            {([
              { v: "email", l: "Email" },
              { v: "phone", l: "Phone" },
              { v: "either", l: "Either" },
            ] as const).map((o) => (
              <label
                key={o.v}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium cursor-pointer transition ${
                  form.contactMethod === o.v
                    ? "border-primary bg-primary/[0.06] text-primary"
                    : "border-border bg-white text-foreground/70 hover:border-primary/40"
                }`}
              >
                <RadioGroupItem value={o.v} className="sr-only" />
                {o.l}
              </label>
            ))}
          </RadioGroup>
        </FormField>
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full brand-gradient text-white btn-glow"
      >
        <Send className="mr-1.5 h-4 w-4" /> {submitting ? "Sending…" : "Send Query"}
      </Button>
      <p className="text-[11px] text-muted-foreground text-center">
        Your details are used only to respond to your query.
      </p>
    </form>
  );
}

function FormField({
  label,
  required,
  full,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  full?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <Label className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
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
            Book a quick call with our team to discuss your marketplace setup, service option, and next steps.
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
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-10 items-start">
            {/* Calendly column */}
            <div className="lg:col-span-3 animate-fade-up">
              <div className="mb-6">
                <div className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Book a Call</div>
                <h2 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  Pick a time that works for you
                </h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Our specialists will walk you through platform options, pricing, and next steps.
                </p>
              </div>
              <div className="rounded-3xl border border-border bg-white shadow-[0_8px_40px_-20px_rgba(37,99,235,0.18)] overflow-hidden">
                <div className="calendly-wrapper">
                  <CalendlyEmbed url={CALENDLY_URL} />
                </div>
              </div>
            </div>

            {/* Query Form column */}
            <div className="lg:col-span-2 animate-fade-up">
              <QueryForm />
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
