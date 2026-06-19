import { useState } from "react";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { SignaturePad, PLATFORMS, type PlatformKey, type Branch } from "./shared";

const PLATFORM_TITLE: Record<PlatformKey, string> = {
  walmart: "Walmart Service Agreement",
  tiktok: "TikTok Shop Service Agreement",
  ebay: "eBay Service Agreement",
};

const PLATFORM_LABEL: Record<PlatformKey, string> = {
  walmart: "Walmart Marketplace",
  tiktok: "TikTok Shop",
  ebay: "eBay",
};

export function ContractStep({
  platform,
  branch,
  clientName,
  setClientName,
  signature,
  setSignature,
  agreed1,
  setAgreed1,
  agreed2,
  setAgreed2,
  onBack,
  onContinue,
}: {
  platform: PlatformKey;
  branch: Branch;
  clientName: string;
  setClientName: (v: string) => void;
  signature: string | null;
  setSignature: (v: string | null) => void;
  agreed1: boolean;
  setAgreed1: (v: boolean) => void;
  agreed2: boolean;
  setAgreed2: (v: boolean) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const p = PLATFORMS[platform];
  const [today] = useState(() =>
    new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  );
  const canContinue = clientName.trim().length >= 3 && !!signature && agreed1 && agreed2;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        <FileText className="h-4 w-4" /> Service Agreement
      </div>

      <div className="rounded-3xl border border-border bg-white shadow-[0_10px_40px_-20px_rgba(15,23,42,0.2)] overflow-hidden">
        <div className="px-6 md:px-8 pt-6 pb-4 border-b border-border bg-gradient-to-br from-primary/[0.04] to-transparent">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">Ray Ecommerce · Ray Advertising</div>
          <h2 className="mt-1 text-xl md:text-2xl font-bold tracking-tight">{PLATFORM_TITLE[platform]}</h2>
          <div className="mt-2 grid sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
            <div><span className="font-semibold text-foreground">Effective Date:</span> {today}</div>
            <div><span className="font-semibold text-foreground">Service:</span> {p.name}</div>
            <div><span className="font-semibold text-foreground">Fee:</span> ${p.price}</div>
          </div>
        </div>

        <div className="max-h-[420px] overflow-y-auto px-6 md:px-8 py-5 text-sm leading-6 text-foreground/85 space-y-4">
          <Section n="1" title="Scope of Services">
            Ray Ecommerce provides marketplace setup and/or management support for the selected{" "}
            <strong>{PLATFORM_LABEL[platform]}</strong> package, including account readiness review, seller account
            support, product research guidance, listing support, supplier coordination, fulfillment support, customer
            communication guidance, performance tracking, and growth reporting.
          </Section>
          <Section n="2" title="Client Responsibilities">
            Client (<strong>{clientName || "[Your Full Legal Name]"}</strong>) must provide accurate personal,
            business, tax, bank, account access, and document information. Client is responsible for platform
            compliance, truthful documentation, product ownership or supplier authorization, and timely
            communication.
          </Section>
          <Section n="3" title="Marketplace Compliance">
            Client understands that Walmart Marketplace, TikTok Shop, and eBay each have their own approval,
            verification, seller performance, payout, and compliance rules. Ray Ecommerce does not guarantee
            platform approval, sales volume, profit, or account reinstatement.
          </Section>
          <Section n="4" title="Service Fee">
            The service fee for the selected package is <strong>${p.price} USD</strong> ({p.name}). Fees for other
            packages: Walmart $499, TikTok Shop $299, eBay $99.
          </Section>
          {branch === "existing" ? (
            <Section n="5" title="Access Authorization">
              Client authorizes Ray Ecommerce to access the selected {PLATFORM_LABEL[platform]} seller account
              <strong> only for setup, management, optimization, and support work</strong> related to this
              engagement. Access may be revoked in writing at any time.
            </Section>
          ) : (
            <Section n="5" title="Document Authorization">
              Client authorizes Ray Ecommerce to use the submitted documents and personal/business details
              <strong> only for seller account creation, onboarding, verification support, and service delivery</strong>.
              Documents will not be repurposed or shared outside the scope of this engagement.
            </Section>
          )}
          <Section n="6" title="Payment Terms">
            Service payment is due before active onboarding begins. Payment confirms the onboarding request and
            reserves the service setup process.
          </Section>
          <Section n="7" title="No Guarantee Clause">
            Ray Ecommerce provides professional marketplace support, but does not guarantee approval, sales,
            profit, ranking, or platform decisions. Marketplace outcomes depend on product selection, supplier
            pricing, customer demand, competition, and ongoing account status.
          </Section>
          <Section n="8" title="Confidentiality">
            Both parties agree to keep confidential information shared during this engagement private and to use it
            solely for the purpose of delivering the contracted services.
          </Section>
          <Section n="9" title="Signatures">
            By signing below, Client acknowledges they have read, understood, and agreed to this Service Agreement
            between <strong>{clientName || "[Your Full Legal Name]"}</strong> and <strong>Ray Ecommerce / Ray Advertising</strong>,
            signed by a <strong>Ray Ecommerce Authorized Representative</strong>.
          </Section>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-white p-6 md:p-8 space-y-5 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.1)]">
        <div>
          <div className="text-sm font-medium">Type your full legal name <span className="text-destructive">*</span></div>
          <Input
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Jane A. Doe"
            className="mt-1.5"
          />
          <p className="mt-1 text-xs text-muted-foreground">Your typed name is treated as your legal signature.</p>
        </div>

        <div>
          <div className="text-sm font-medium">Draw your signature <span className="text-destructive">*</span></div>
          <div className="mt-1.5">
            <SignaturePad onChange={setSignature} />
          </div>
        </div>

        <label className="flex gap-3 items-start rounded-2xl bg-primary/5 border border-primary/20 p-4 text-sm cursor-pointer">
          <Checkbox checked={agreed1} onCheckedChange={(v) => setAgreed1(!!v)} className="mt-0.5" />
          <span className="text-foreground/85">I have read and agree to this Service Agreement.</span>
        </label>
        <label className="flex gap-3 items-start rounded-2xl bg-primary/5 border border-primary/20 p-4 text-sm cursor-pointer">
          <Checkbox checked={agreed2} onCheckedChange={(v) => setAgreed2(!!v)} className="mt-0.5" />
          <span className="text-foreground/85">
            I confirm that all information and documents I submitted are accurate and belong to me or my business.
          </span>
        </label>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onBack} className="rounded-full">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          <Button
            onClick={onContinue}
            disabled={!canContinue}
            className="flex-1 brand-gradient text-white rounded-full btn-glow"
          >
            Continue to Payment <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-semibold text-foreground">{n}. {title}</div>
      <p className="mt-1">{children}</p>
    </div>
  );
}
