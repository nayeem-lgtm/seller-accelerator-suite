import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Ray Ecommerce" },
      { name: "description", content: "Privacy policy for Ray Ecommerce — how we collect, use, and protect information from website visitors and clients." },
      { property: "og:title", content: "Privacy Policy | Ray Ecommerce" },
      { property: "og:description", content: "Ray Ecommerce privacy practices." },
    ],
  }),
  component: () => <Legal title="Privacy Policy" sections={SECTIONS} />,
});

const SECTIONS = [
  { h: "Information We Collect", p: "We collect information you provide directly to us, including your name, email address, phone or WhatsApp number, business details, marketplace preference, and any messages you submit through our contact, onboarding, or consultation forms." },
  { h: "How We Use Information", p: "We use submitted information to respond to inquiries, provide service information, process onboarding requests, schedule consultations, and improve our website and services." },
  { h: "Contact & Onboarding Forms", p: "Information submitted through Ray Ecommerce forms is used to follow up about marketplace operations services and is shared only with our internal team and authorized service providers necessary to fulfill your request." },
  { h: "Lead Information", p: "Lead details captured by Ray AI™ or other lead capture interactions are handled with the same care as other contact submissions and are used for direct service follow-up." },
  { h: "Cookies & Analytics", p: "Ray Ecommerce may use cookies, local storage, and analytics tools to measure website performance and improve user experience. You can control cookies through your browser settings." },
  { h: "Data Protection", p: "We implement reasonable safeguards to protect submitted information against unauthorized access, alteration, disclosure, or destruction. No system is 100% secure, but we maintain industry-standard practices." },
  { h: "Third-Party Services", p: "We may use trusted third-party providers for hosting, communications, analytics, and CRM. These providers are bound by their own privacy commitments." },
  { h: "Your Choices", p: "You may request access to, correction of, or deletion of your personal information by contacting us at the address below." },
  { h: "Contact", p: "Ray Ecommerce · 1267 Willis ST STE 200, Redding, CA 96001, USA · +1 (888) 870-9196 · ecommerce@rayadvertising.com" },
];

function Legal({ title, sections }: { title: string; sections: { h: string; p: string }[] }) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Legal</div>
        <h1 className="mt-2 text-3xl md:text-5xl font-bold tracking-tight">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        <div className="mt-10 space-y-8">
          {sections.map((s) => (
            <div key={s.h}>
              <h2 className="text-xl font-bold">{s.h}</h2>
              <p className="mt-2 text-foreground/80 leading-relaxed">{s.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
