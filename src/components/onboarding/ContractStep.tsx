import { useState } from "react";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  SignaturePad,
  PLATFORMS,
  PLATFORM_FULL_NAME,
  platformsLabel,
  totalForPlatforms,
  type PlatformKey,
  type Branch,
} from "./shared";

export function ContractStep({
  platforms,
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
  platforms: PlatformKey[];
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
  const [today] = useState(() =>
    new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  );
  const total = totalForPlatforms(platforms);
  const platformsText = platformsLabel(platforms);
  const title =
    platforms.length === 1
      ? `${PLATFORM_FULL_NAME[platforms[0]]} Service Agreement`
      : "Marketplace Operations Service Agreement";
  const displayName = clientName.trim().length > 0 ? clientName : "[Your Full Legal Name]";
  const canContinue = clientName.trim().length >= 3 && !!signature && agreed1 && agreed2;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        <FileText className="h-4 w-4" /> Service Agreement
      </div>

      <div className="rounded-3xl border border-border bg-white shadow-[0_10px_40px_-20px_rgba(15,23,42,0.2)] overflow-hidden">
        <div className="px-6 md:px-8 pt-6 pb-4 border-b border-border bg-gradient-to-br from-primary/[0.04] to-transparent">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">Ray Ecommerce · Ray Advertising</div>
          <h2 className="mt-1 text-xl md:text-2xl font-bold tracking-tight">{title}</h2>
          <div className="mt-2 grid sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
            <div><span className="font-semibold text-foreground">Effective Date:</span> {today}</div>
            <div><span className="font-semibold text-foreground">Platforms:</span> {platformsText}</div>
            <div><span className="font-semibold text-foreground">Total Fee:</span> ${total.toFixed(2)}</div>
          </div>
          <div className="mt-3 rounded-xl border border-border bg-white/70 p-3">
            <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Selected Packages</div>
            <ul className="mt-1 space-y-0.5 text-xs">
              {platforms.map((k) => (
                <li key={k} className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{PLATFORM_FULL_NAME[k]} Package</span>
                  <span className="font-semibold tabular-nums">${PLATFORMS[k].price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="max-h-[420px] overflow-y-auto px-6 md:px-8 py-5 text-sm leading-6 text-foreground/85 space-y-4">
          <Section n="1" title="Scope of Services">
            Ray Ecommerce provides marketplace setup and/or management support for the selected{" "}
            <strong>{platformsText}</strong> package{platforms.length > 1 ? "s" : ""}, including account
            readiness review, seller account support, product research guidance, listing support, supplier
            coordination, fulfillment support, customer communication guidance, performance tracking, and growth
            reporting.
          </Section>
          <Section n="2" title="Client Responsibilities">
            Client (<strong>{displayName}</strong>) must provide accurate personal, business, tax, bank, account
            access, and document information. Client is responsible for platform compliance, truthful
            documentation, product ownership or supplier authorization, and timely communication.
          </Section>
          <Section n="3" title="Marketplace Compliance">
            Client understands that Walmart Marketplace, TikTok Shop, and eBay each have their own approval,
            verification, seller performance, payout, and compliance rules. Ray Ecommerce does not guarantee
            platform approval, sales volume, profit, or account reinstatement.
          </Section>
          <Section n="4" title="Service Fee">
            The package fee{platforms.length > 1 ? "s" : ""} shown above {platforms.length > 1 ? "are" : "is"}{" "}
            payable in advance to begin onboarding. This fee covers setup and onboarding work and is
            non-refundable once services have commenced, except where required by law.
          </Section>
          <Section n="5" title="Profit Sharing (where applicable)">
            Where the parties agree to ongoing management on a profit-sharing basis, Net Profit — calculated
            after marketplace fees, product and supplier costs, advertising spend, software and tools, shipping,
            and other agreed operating expenses — is shared <strong>60% to the Client</strong> and{" "}
            <strong>40% to Ray Ecommerce</strong>, unless otherwise agreed in writing.
          </Section>
          <Section n="6" title="Account Access & Ownership">
            Client grants Ray Ecommerce delegated user access to operate the store. Client remains the sole and
            exclusive owner of all accounts, listings, brands, and business assets. Ray Ecommerce will not change
            banking or payout details, move funds, or close any account without the Client's separate written
            approval. Client may revoke access by giving 30 days' written notice that specifies the effective
            date.
          </Section>
          <Section n="7" title="Confidentiality">
            Both parties protect each other's confidential information under the separate Mutual Non-Disclosure
            Agreement, which forms part of this engagement.
          </Section>
          <Section n="8" title="Term & Termination">
            This Agreement begins on the Effective Date and continues until terminated. Either party may
            terminate with 30 days' written notice. Fees for work already performed remain payable.
          </Section>
          <Section n="9" title="No Guarantee & Limitation of Liability">
            Services are provided on a best-effort basis with no guarantee of specific results. Ray Ecommerce's
            total liability is limited to the fees paid for the services. Neither party is liable for indirect or
            consequential losses.
          </Section>
          <Section n="10" title="Governing Law">
            This Agreement is governed by the laws of the State of California, USA, with exclusive jurisdiction
            in the state and federal courts of Shasta County, California.
          </Section>
          <Section n="11" title="Entire Agreement">
            This Agreement, together with the Mutual NDA and any written addenda, is the entire agreement
            between the parties and supersedes any prior oral or written understandings.
          </Section>
          <Section n="12" title="Acceptance">
            By typing your full legal name, drawing your signature, and checking the boxes below, you (
            <strong>{displayName}</strong>) agree to be bound by this Agreement with{" "}
            <strong>Ray Ecommerce / Ray Advertising</strong>{branch === "existing"
              ? " and authorize delegated access to the selected store(s) listed above"
              : " and authorize Ray Ecommerce to assist with the seller account creation outlined above"}
            .
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
