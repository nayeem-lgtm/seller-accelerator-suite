import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck } from "lucide-react";
import {
  CollapsibleCard,
  Field,
  FileUploadBox,
  PasswordField,
  PLATFORM_FULL_NAME,
  PLATFORM_LOGIN_LABEL,
  PLATFORM_STORE_LABEL,
  PLATFORMS,
  PrivacyNote,
  TextField,
  platformsLabel,
  type PlatformKey,
} from "./shared";

/* =========================================================
   Conditional Government-ID upload group
   ========================================================= */
function IdUploads({ idType }: { idType: string }) {
  if (!idType) return null;
  const helper = "Upload clear images for verification purposes.";
  let uploads: string[] = [];
  if (idType === "dl") uploads = ["Upload Driver License Front", "Upload Driver License Back"];
  else if (idType === "passport") uploads = ["Upload Passport Photo Page"];
  else if (idType === "state_id") uploads = ["Upload State ID Front", "Upload State ID Back"];
  if (uploads.length === 0) return null;
  return (
    <div className="sm:col-span-2 space-y-2.5">
      <div className="text-sm font-medium text-foreground">Government ID Upload <span className="text-destructive">*</span></div>
      <p className="text-xs text-muted-foreground">{helper}</p>
      <div className={`grid gap-3 ${uploads.length > 1 ? "sm:grid-cols-2" : ""}`}>
        {uploads.map((u) => (
          <FileUploadBox key={u} label={u} required accept=".jpg,.jpeg,.png,.pdf" />
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   MULTI-PLATFORM EXISTING ACCOUNT FORM
   - Renders one credentials card per selected platform
   - Per-platform authorization checkbox (long legal wording)
   - No supporting document uploads
   - Dynamic security note (single / multi)
   ========================================================= */
export function MultiPlatformExistingForm({
  platforms,
  forms,
  setField,
  authorized,
  setAuthorized,
}: {
  platforms: PlatformKey[];
  forms: Record<string, Record<string, string>>;
  setField: (platform: PlatformKey, key: string, value: string) => void;
  authorized: Record<string, boolean>;
  setAuthorized: (platform: PlatformKey, v: boolean) => void;
}) {
  return (
    <div className="space-y-6">
      {platforms.map((platform, idx) => {
        const labels = PLATFORM_LOGIN_LABEL[platform];
        const fullName = PLATFORM_FULL_NAME[platform];
        const state = forms[platform] || {};
        const set = (k: string, v: string) => setField(platform, k, v);
        return (
          <div
            key={platform}
            className="rounded-3xl border border-border bg-white shadow-[0_8px_30px_-18px_rgba(15,23,42,0.18)] overflow-hidden"
          >
            <div className="flex items-center justify-between gap-4 px-6 py-4 bg-gradient-to-r from-primary/[0.06] to-transparent border-b border-border">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 shrink-0 rounded-full brand-gradient text-white grid place-items-center text-sm font-bold">
                  {idx + 1}
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">{fullName}</div>
                  <div className="font-semibold truncate">{fullName} Credentials</div>
                </div>
              </div>
              <div className="text-xs font-semibold text-foreground/70 hidden sm:block">
                Package fee · ${PLATFORMS[platform].price}
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <TextField
                  label={labels.email}
                  value={state.loginEmail || ""}
                  onChange={(v) => set("loginEmail", v)}
                  type="email"
                  required
                />
                <PasswordField
                  label={labels.password}
                  value={state.loginPassword || ""}
                  onChange={(v) => set("loginPassword", v)}
                  required
                />
                <TextField
                  label="Business display name"
                  value={state.displayName || ""}
                  onChange={(v) => set("displayName", v)}
                  required
                />
                <TextField
                  label="Store URL or seller profile link"
                  value={state.storeUrl || ""}
                  onChange={(v) => set("storeUrl", v)}
                  placeholder="https://"
                />
                <Field label="Current account status" required>
                  <Select value={state.accountStatus || ""} onValueChange={(v) => set("accountStatus", v)}>
                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="limited">Limited</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="not_sure">Not Sure</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Notes (optional)" full>
                  <Textarea
                    rows={3}
                    value={state.notes || ""}
                    onChange={(e) => set("notes", e.target.value)}
                    placeholder="Anything we should know about your account?"
                  />
                </Field>
              </div>

              <label className="flex gap-3 items-start rounded-2xl bg-primary/5 border border-primary/20 p-4 text-sm cursor-pointer">
                <Checkbox
                  checked={!!authorized[platform]}
                  onCheckedChange={(v) => setAuthorized(platform, !!v)}
                  className="mt-0.5"
                />
                <span className="text-foreground/85 leading-relaxed">
                  I authorize Ray Advertising (&quot;Ray Ecommerce&quot;) to access and manage my{" "}
                  <strong>{PLATFORM_STORE_LABEL[platform]}</strong> on my behalf. I confirm that I am the account
                  owner or an authorized representative with the authority to grant this access. This
                  authorization remains in effect until I revoke it in writing.
                </span>
              </label>
            </div>
          </div>
        );
      })}

      <div className="flex items-start gap-2 rounded-2xl bg-primary/5 border border-primary/15 p-4 text-xs md:text-sm text-foreground/80">
        <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <span>
          {platforms.length > 1 ? (
            <>Your information is encrypted and used only to manage your selected marketplace stores ({platformsLabel(platforms)}). We keep your account details strictly confidential, never share them with third parties, and you can revoke this access at any time.</>
          ) : (
            <>Your information is encrypted and used only to manage your {PLATFORM_STORE_LABEL[platforms[0]]}. We keep your account details strictly confidential, never share them with third parties, and you can revoke this access at any time.</>
          )}
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   EXISTING ACCOUNT FORMS
   ========================================================= */
export function ExistingAccountForm({
  platform,
  state,
  set,
}: {
  platform: PlatformKey;
  state: Record<string, string>;
  set: (k: string, v: string) => void;
}) {
  const platformName =
    platform === "walmart" ? "Walmart Marketplace" : platform === "tiktok" ? "TikTok Shop" : "eBay";

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        {platform === "walmart" && (
          <>
            <TextField label="Walmart Seller Center login email" value={state.loginEmail || ""} onChange={(v) => set("loginEmail", v)} type="email" required />
            <TextField label="Admin/user access invitation email" value={state.inviteEmail || ""} onChange={(v) => set("inviteEmail", v)} type="email" required hint="The email we should be invited from." />
            <TextField label="Business display name" value={state.displayName || ""} onChange={(v) => set("displayName", v)} required />
            <TextField label="Store URL or seller profile link" value={state.storeUrl || ""} onChange={(v) => set("storeUrl", v)} placeholder="https://" />
            <Field label="Current account status" required>
              <Select value={state.accountStatus || ""} onValueChange={(v) => set("accountStatus", v)}>
                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="not_sure">Not Sure</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </>
        )}

        {platform === "tiktok" && (
          <>
            <TextField label="TikTok Shop Seller Center login email" value={state.loginEmail || ""} onChange={(v) => set("loginEmail", v)} type="email" required />
            <TextField label="Shop name" value={state.shopName || ""} onChange={(v) => set("shopName", v)} required />
            <TextField label="TikTok handle connected to the shop" value={state.tiktokHandle || ""} onChange={(v) => set("tiktokHandle", v)} placeholder="@yourbrand" />
            <TextField label="Business Center / user access invitation email" value={state.inviteEmail || ""} onChange={(v) => set("inviteEmail", v)} type="email" />
            <Field label="Current account status" required>
              <Select value={state.accountStatus || ""} onValueChange={(v) => set("accountStatus", v)}>
                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="not_sure">Not Sure</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </>
        )}

        {platform === "ebay" && (
          <>
            <TextField label="eBay login email or username" value={state.loginEmail || ""} onChange={(v) => set("loginEmail", v)} required />
            <TextField label="Store name or profile link" value={state.storeUrl || ""} onChange={(v) => set("storeUrl", v)} />
            <Field label="Current seller status" required>
              <Select value={state.accountStatus || ""} onValueChange={(v) => set("accountStatus", v)}>
                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="limited">Limited</SelectItem>
                  <SelectItem value="restricted">Restricted</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="not_sure">Not Sure</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Payout status" required>
              <Select value={state.payoutStatus || ""} onValueChange={(v) => set("payoutStatus", v)}>
                <SelectTrigger><SelectValue placeholder="Select payout status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="connected">Connected</SelectItem>
                  <SelectItem value="not_connected">Not Connected</SelectItem>
                  <SelectItem value="issue_pending">Issue Pending</SelectItem>
                  <SelectItem value="not_sure">Not Sure</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </>
        )}

        <Field label="Notes (optional)" full>
          <Textarea rows={3} value={state.notes || ""} onChange={(e) => set("notes", e.target.value)} placeholder="Anything we should know about your account?" />
        </Field>
      </div>

      <label className="flex gap-3 items-start rounded-2xl bg-primary/5 border border-primary/20 p-4 text-sm cursor-pointer">
        <Checkbox
          checked={state.authorize === "1"}
          onCheckedChange={(v) => set("authorize", v ? "1" : "")}
          className="mt-0.5"
        />
        <span className="text-foreground/85 whitespace-pre-wrap">
          {platform === "walmart" 
            ? "I authorize Ray Ecommerce to manage my Walmart Marketplace account for store management services.\n\n\u00a0"
            : `I authorize Ray Ecommerce to access and manage my ${platformName} seller account for service setup and operations.`}
        </span>
      </label>

      <div className="space-y-3">
        <div className="text-sm font-semibold">Upload supporting documents</div>
        <div className="grid sm:grid-cols-2 gap-4">
          <FileUploadBox label="Screenshots or account notices" />
          <FileUploadBox label="Any verification requests (optional)" />
        </div>
        <PrivacyNote />
      </div>
    </div>
  );
}

/* =========================================================
   ACCOUNT CREATION FORMS — collapsible cards per platform
   ========================================================= */
export function AccountCreationForm({
  platform,
  state,
  set,
}: {
  platform: PlatformKey;
  state: Record<string, string>;
  set: (k: string, v: string) => void;
}) {
  return (
    <div className="space-y-4">
      {platform === "walmart" && <WalmartCreate state={state} set={set} />}
      {platform === "tiktok" && <TikTokCreate state={state} set={set} />}
      {platform === "ebay" && <EbayCreate state={state} set={set} />}
      <PrivacyNote />
    </div>
  );
}

function WalmartCreate({ state, set }: { state: Record<string, string>; set: (k: string, v: string) => void }) {
  return (
    <>
      <CollapsibleCard index={1} title="Personal Information" defaultOpen>
        <TextField label="Full legal name" value={state.fullName || ""} onChange={(v) => set("fullName", v)} required />
        <TextField label="Date of birth" type="date" value={state.dob || ""} onChange={(v) => set("dob", v)} required />
        <TextField label="Phone number" value={state.phone || ""} onChange={(v) => set("phone", v)} required />
        <TextField label="Email address" type="email" value={state.email || ""} onChange={(v) => set("email", v)} required />
        <TextField label="Residential address" full value={state.address || ""} onChange={(v) => set("address", v)} required />
        <Field label="Government ID type" required>
          <Select value={state.idType || ""} onValueChange={(v) => set("idType", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="dl">Driver License</SelectItem>
              <SelectItem value="passport">Passport</SelectItem>
              <SelectItem value="state_id">State ID</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <TextField label="Government ID number" value={state.idNumber || ""} onChange={(v) => set("idNumber", v)} required />
        <TextField label="ID expiration date" type="date" value={state.idExp || ""} onChange={(v) => set("idExp", v)} required />
      </CollapsibleCard>

      <CollapsibleCard index={2} title="Business Information">
        <TextField label="Legal business name" value={state.bizName || ""} onChange={(v) => set("bizName", v)} required />
        <TextField label="DBA name (if any)" value={state.dba || ""} onChange={(v) => set("dba", v)} />
        <TextField label="Business email" type="email" value={state.bizEmail || ""} onChange={(v) => set("bizEmail", v)} required />
        <TextField label="Business phone" value={state.bizPhone || ""} onChange={(v) => set("bizPhone", v)} required />
        <TextField label="Business address" full value={state.bizAddress || ""} onChange={(v) => set("bizAddress", v)} required />
        <Field label="Business entity classification" required>
          <Select value={state.entity || ""} onValueChange={(v) => set("entity", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="llc">LLC</SelectItem>
              <SelectItem value="corp">Corporation</SelectItem>
              <SelectItem value="sole">Sole Proprietorship</SelectItem>
              <SelectItem value="partnership">Partnership</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <TextField label="EIN / Business Tax ID" value={state.ein || ""} onChange={(v) => set("ein", v)} required />
        <TextField label="Business license number" value={state.license || ""} onChange={(v) => set("license", v)} />
        <TextField label="State of registration" value={state.state || ""} onChange={(v) => set("state", v)} required />
        <TextField label="Website or store link" full value={state.website || ""} onChange={(v) => set("website", v)} />
      </CollapsibleCard>

      <CollapsibleCard index={3} title="Tax & Verification">
        <Field label="W-9 information (legal name + TIN/EIN)" full>
          <Textarea rows={3} value={state.w9 || ""} onChange={(e) => set("w9", e.target.value)} />
        </Field>
        <Field label="Tax notes (optional)" full>
          <Textarea rows={2} value={state.taxNotes || ""} onChange={(e) => set("taxNotes", e.target.value)} />
        </Field>
      </CollapsibleCard>

      <CollapsibleCard index={4} title="Marketplace Readiness">
        <Field label="Previous marketplace experience" required>
          <Select value={state.experience || ""} onValueChange={(v) => set("experience", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="amazon">Amazon</SelectItem>
              <SelectItem value="ebay">eBay</SelectItem>
              <SelectItem value="shopify">Shopify</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <TextField label="Existing store links" value={state.storeLinks || ""} onChange={(v) => set("storeLinks", v)} />
        <TextField label="Estimated monthly sales" value={state.monthlySales || ""} onChange={(v) => set("monthlySales", v)} />
        <TextField label="Product category" value={state.category || ""} onChange={(v) => set("category", v)} required />
        <Field label="Product catalog available?" required>
          <Select value={state.catalog || ""} onValueChange={(v) => set("catalog", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="UPC / GTIN / GS1 availability" required>
          <Select value={state.upc || ""} onValueChange={(v) => set("upc", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="help">Need Help</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Supplier invoice available?" required>
          <Select value={state.supplierInvoice || ""} onValueChange={(v) => set("supplierInvoice", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </CollapsibleCard>

      <CollapsibleCard index={5} title="Fulfillment & Returns">
        <Field label="Fulfillment method" required>
          <Select value={state.fulfillment || ""} onValueChange={(v) => set("fulfillment", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="wfs">Walmart Fulfillment Services (WFS)</SelectItem>
              <SelectItem value="3pl">3PL</SelectItem>
              <SelectItem value="own">Own warehouse</SelectItem>
              <SelectItem value="help">Need help</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <TextField label="Warehouse address" full value={state.warehouse || ""} onChange={(v) => set("warehouse", v)} />
        <TextField label="Return address" full value={state.returnAddress || ""} onChange={(v) => set("returnAddress", v)} />
        <Field label="Shipping policy" full>
          <Textarea rows={2} value={state.shippingPolicy || ""} onChange={(e) => set("shippingPolicy", e.target.value)} />
        </Field>
        <Field label="Return policy" full>
          <Textarea rows={2} value={state.returnPolicy || ""} onChange={(e) => set("returnPolicy", e.target.value)} />
        </Field>
      </CollapsibleCard>

      <CollapsibleCard index={6} title="Required Document Uploads">
        {[
          "Government ID (front)",
          "Government ID (back)",
          "EIN verification letter / CP575 / 147C",
          "Articles of Organization or Incorporation",
          "Certificate of Good Standing",
          "Business license or state registration",
          "Proof of business address",
          "Bank statement or payout proof",
          "Product catalog file",
          "UPC / GTIN list",
          "Supplier invoices",
          "Ecommerce proof (screenshots/store)",
          "Warehouse / return address proof",
        ].map((l) => (
          <FileUploadBox key={l} label={l} />
        ))}
      </CollapsibleCard>
    </>
  );
}

function TikTokCreate({ state, set }: { state: Record<string, string>; set: (k: string, v: string) => void }) {
  return (
    <>
      <CollapsibleCard index={1} title="Personal Information" defaultOpen>
        <TextField label="Full legal name" value={state.fullName || ""} onChange={(v) => set("fullName", v)} required />
        <TextField label="Date of birth" type="date" value={state.dob || ""} onChange={(v) => set("dob", v)} required />
        <TextField label="Phone number" value={state.phone || ""} onChange={(v) => set("phone", v)} required />
        <TextField label="Email address" type="email" value={state.email || ""} onChange={(v) => set("email", v)} required />
        <TextField label="Residential address" full value={state.address || ""} onChange={(v) => set("address", v)} required />
        <Field label="Government ID type" required>
          <Select value={state.idType || ""} onValueChange={(v) => set("idType", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="passport">Passport</SelectItem>
              <SelectItem value="dl">Driver License</SelectItem>
              <SelectItem value="state_id">State ID</SelectItem>
              <SelectItem value="pr">Permanent Resident Card</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <TextField label="ID expiration date" type="date" value={state.idExp || ""} onChange={(v) => set("idExp", v)} required />
        <TextField label="SSN last 4 digits or ITIN" value={state.ssnLast4 || ""} onChange={(v) => set("ssnLast4", v)} required hint="Used for tax identity verification only." />
      </CollapsibleCard>

      <CollapsibleCard index={2} title="Business Information">
        <TextField label="Legal business name" value={state.bizName || ""} onChange={(v) => set("bizName", v)} required />
        <TextField label="Business address" full value={state.bizAddress || ""} onChange={(v) => set("bizAddress", v)} required />
        <TextField label="Business phone" value={state.bizPhone || ""} onChange={(v) => set("bizPhone", v)} required />
        <TextField label="Business email" type="email" value={state.bizEmail || ""} onChange={(v) => set("bizEmail", v)} required />
        <TextField label="EIN" value={state.ein || ""} onChange={(v) => set("ein", v)} required />
        <Field label="Business type" required>
          <Select value={state.entity || ""} onValueChange={(v) => set("entity", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="corp">Corporation</SelectItem>
              <SelectItem value="partnership">Partnership</SelectItem>
              <SelectItem value="sole">Sole Proprietorship</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <TextField label="Shop name preference" value={state.shopName || ""} onChange={(v) => set("shopName", v)} required />
        <TextField label="Product category" value={state.category || ""} onChange={(v) => set("category", v)} required />
        <TextField label="TikTok handle (if available)" value={state.tiktokHandle || ""} onChange={(v) => set("tiktokHandle", v)} placeholder="@yourbrand" />
      </CollapsibleCard>

      <CollapsibleCard index={3} title="Owner / Representative Information">
        <TextField label="Primary representative legal name" value={state.repName || ""} onChange={(v) => set("repName", v)} required />
        <TextField label="Primary representative DOB" type="date" value={state.repDob || ""} onChange={(v) => set("repDob", v)} required />
        <TextField label="Primary representative address" full value={state.repAddress || ""} onChange={(v) => set("repAddress", v)} required />
        <TextField label="Rep SSN last 4 or ITIN" value={state.repSsn || ""} onChange={(v) => set("repSsn", v)} required />
        <TextField label="Nationality" value={state.repNationality || ""} onChange={(v) => set("repNationality", v)} required />
        <Field label="Ultimate Beneficial Owner details (if applicable)" full>
          <Textarea rows={2} value={state.ubo || ""} onChange={(e) => set("ubo", e.target.value)} />
        </Field>
      </CollapsibleCard>

      <CollapsibleCard index={4} title="Bank & Tax">
        <TextField label="Bank account holder name" value={state.bankHolder || ""} onChange={(v) => set("bankHolder", v)} required />
        <TextField label="Bank name" value={state.bankName || ""} onChange={(v) => set("bankName", v)} required />
        <TextField label="Routing number" value={state.routing || ""} onChange={(v) => set("routing", v)} required />
        <TextField label="Account number" value={state.accountNumber || ""} onChange={(v) => set("accountNumber", v)} required />
        <Field label="W-9 details" full>
          <Textarea rows={3} value={state.w9 || ""} onChange={(e) => set("w9", e.target.value)} />
        </Field>
      </CollapsibleCard>

      <CollapsibleCard index={5} title="Required Document Uploads">
        {[
          "Government ID (front)",
          "Government ID (back)",
          "Proof of address",
          "EIN verification document",
          "Business registration document",
          "W-9 or tax information",
          "Bank statement or bank proof",
          "Product / category proof",
          "Brand authorization documents",
          "Supplier invoices",
        ].map((l) => (
          <FileUploadBox key={l} label={l} />
        ))}
      </CollapsibleCard>
    </>
  );
}

function EbayCreate({ state, set }: { state: Record<string, string>; set: (k: string, v: string) => void }) {
  return (
    <>
      <CollapsibleCard index={1} title="Personal Information" defaultOpen>
        <TextField label="Full legal name" value={state.fullName || ""} onChange={(v) => set("fullName", v)} required />
        <TextField label="Date of birth" type="date" value={state.dob || ""} onChange={(v) => set("dob", v)} required />
        <TextField label="Residential address" full value={state.address || ""} onChange={(v) => set("address", v)} required />
        <TextField label="Phone number" value={state.phone || ""} onChange={(v) => set("phone", v)} required />
        <TextField label="Email address" type="email" value={state.email || ""} onChange={(v) => set("email", v)} required />
        <TextField label="SSN / EIN / ITIN" value={state.taxId || ""} onChange={(v) => set("taxId", v)} required hint="Use SSN for individuals, EIN for business sellers." />
        <Field label="Government ID type" required>
          <Select value={state.idType || ""} onValueChange={(v) => set("idType", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="dl">Driver License</SelectItem>
              <SelectItem value="passport">Passport</SelectItem>
              <SelectItem value="state_id">State ID</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <TextField label="Government ID expiration date" type="date" value={state.idExp || ""} onChange={(v) => set("idExp", v)} required />
      </CollapsibleCard>

      <CollapsibleCard index={2} title="Business Information">
        <Field label="Account type" required>
          <Select value={state.accountType || ""} onValueChange={(v) => set("accountType", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="business">Registered Business</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <TextField label="Legal business name" value={state.bizName || ""} onChange={(v) => set("bizName", v)} />
        <TextField label="DBA name (if any)" value={state.dba || ""} onChange={(v) => set("dba", v)} />
        <TextField label="EIN" value={state.ein || ""} onChange={(v) => set("ein", v)} />
        <TextField label="Business address" full value={state.bizAddress || ""} onChange={(v) => set("bizAddress", v)} />
        <TextField label="Business phone" value={state.bizPhone || ""} onChange={(v) => set("bizPhone", v)} />
        <TextField label="Business email" type="email" value={state.bizEmail || ""} onChange={(v) => set("bizEmail", v)} />
        <Field label="Business entity type">
          <Select value={state.entity || ""} onValueChange={(v) => set("entity", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="llc">LLC</SelectItem>
              <SelectItem value="corp">Corporation</SelectItem>
              <SelectItem value="sole">Sole Proprietorship</SelectItem>
              <SelectItem value="partnership">Partnership</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Stakeholder / owner details (if applicable)" full>
          <Textarea rows={2} value={state.stakeholder || ""} onChange={(e) => set("stakeholder", e.target.value)} />
        </Field>
      </CollapsibleCard>

      <CollapsibleCard index={3} title="Payout & Banking">
        <TextField label="Bank account holder name" value={state.bankHolder || ""} onChange={(v) => set("bankHolder", v)} required />
        <TextField label="Bank name" value={state.bankName || ""} onChange={(v) => set("bankName", v)} required />
        <TextField label="Routing number" value={state.routing || ""} onChange={(v) => set("routing", v)} required />
        <TextField label="Account number" value={state.accountNumber || ""} onChange={(v) => set("accountNumber", v)} required />
        <Field label="Account type" required>
          <Select value={state.bankAccountType || ""} onValueChange={(v) => set("bankAccountType", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Debit card option">
          <Select value={state.debitCard || ""} onValueChange={(v) => set("debitCard", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Add a debit card</SelectItem>
              <SelectItem value="no">Bank account only</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </CollapsibleCard>

      <CollapsibleCard index={4} title="Selling Details">
        <TextField label="Product category" value={state.category || ""} onChange={(v) => set("category", v)} required />
        <TextField label="Supplier source" value={state.supplier || ""} onChange={(v) => set("supplier", v)} />
        <TextField label="Estimated monthly order volume" value={state.volume || ""} onChange={(v) => set("volume", v)} />
        <TextField label="Return address" full value={state.returnAddress || ""} onChange={(v) => set("returnAddress", v)} />
        <TextField label="Shipping method" value={state.shipping || ""} onChange={(v) => set("shipping", v)} />
        <TextField label="Customer service email" type="email" value={state.csEmail || ""} onChange={(v) => set("csEmail", v)} />
        <Field label="Existing marketplace experience" full>
          <Textarea rows={2} value={state.experience || ""} onChange={(e) => set("experience", e.target.value)} />
        </Field>
      </CollapsibleCard>

      <CollapsibleCard index={5} title="Required Document Uploads">
        {[
          "Government ID (front)",
          "Government ID (back)",
          "IRS 147C / EIN verification (if business)",
          "Articles of Organization or Incorporation (if business)",
          "Business license",
          "Certificate of Good Standing",
          "Proof of address",
          "Bank statement for payout verification",
          "Supplier invoice or product proof",
          "Return address proof",
        ].map((l) => (
          <FileUploadBox key={l} label={l} />
        ))}
      </CollapsibleCard>
    </>
  );
}
