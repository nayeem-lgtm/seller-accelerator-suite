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
export type IdUploadKey = "idFront" | "idBack" | "passport";

export function getRequiredIdUploadKeys(idType: string): IdUploadKey[] {
  if (idType === "dl" || idType === "state_id") return ["idFront", "idBack"];
  if (idType === "passport") return ["passport"];
  return [];
}

const ID_UPLOAD_LABELS: Record<string, Record<IdUploadKey, string>> = {
  dl: { idFront: "Upload Driver License Front", idBack: "Upload Driver License Back", passport: "" },
  state_id: { idFront: "Upload State ID Front", idBack: "Upload State ID Back", passport: "" },
  passport: { idFront: "", idBack: "", passport: "Upload Passport Photo Page" },
};

function IdUploads({
  idType,
  uploads,
  setUploads,
  showErrors,
}: {
  idType: string;
  uploads: Partial<Record<IdUploadKey, File[]>>;
  setUploads: (key: IdUploadKey, files: File[]) => void;
  showErrors: boolean;
}) {
  const required = getRequiredIdUploadKeys(idType);
  if (required.length === 0) return null;
  const labels = ID_UPLOAD_LABELS[idType] ?? {};
  return (
    <div className="sm:col-span-2 space-y-2.5">
      <div className="text-sm font-medium text-foreground">
        Government ID Upload <span className="text-destructive">*</span>
      </div>
      <p className="text-xs text-muted-foreground">Upload clear images for verification purposes.</p>
      <div className={`grid gap-3 ${required.length > 1 ? "sm:grid-cols-2" : ""}`}>
        {required.map((key) => {
          const files = uploads[key] ?? [];
          const hasError = showErrors && files.length === 0;
          return (
            <FileUploadBox
              key={key}
              label={labels[key] || ""}
              required
              accept=".jpg,.jpeg,.png,.pdf"
              files={files}
              onFilesChange={(f) => setUploads(key, f)}
              error={hasError ? "This file is required." : undefined}
            />
          );
        })}
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
  idUploads,
  setIdUpload,
  showUploadErrors,
}: {
  platform: PlatformKey;
  state: Record<string, string>;
  set: (k: string, v: string) => void;
  idUploads: Partial<Record<IdUploadKey, File[]>>;
  setIdUpload: (key: IdUploadKey, files: File[]) => void;
  showUploadErrors: boolean;
}) {
  return (
    <div className="space-y-4">
      {platform === "walmart" && (
        <WalmartCreate state={state} set={set} idUploads={idUploads} setIdUpload={setIdUpload} showUploadErrors={showUploadErrors} />
      )}
      {platform === "tiktok" && (
        <TikTokCreate state={state} set={set} idUploads={idUploads} setIdUpload={setIdUpload} showUploadErrors={showUploadErrors} />
      )}
      {platform === "ebay" && (
        <EbayCreate state={state} set={set} idUploads={idUploads} setIdUpload={setIdUpload} showUploadErrors={showUploadErrors} />
      )}
      <PrivacyNote />
    </div>
  );
}

function WalmartCreate({ state, set, idUploads, setIdUpload, showUploadErrors }: { state: Record<string, string>; set: (k: string, v: string) => void; idUploads: Partial<Record<IdUploadKey, File[]>>; setIdUpload: (key: IdUploadKey, files: File[]) => void; showUploadErrors: boolean }) {
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
        <IdUploads idType={state.idType || ""} uploads={idUploads} setUploads={setIdUpload} showErrors={showUploadErrors} />
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
    </>
  );
}

function TikTokCreate({ state, set, idUploads, setIdUpload, showUploadErrors }: { state: Record<string, string>; set: (k: string, v: string) => void; idUploads: Partial<Record<IdUploadKey, File[]>>; setIdUpload: (key: IdUploadKey, files: File[]) => void; showUploadErrors: boolean }) {
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
        <TextField label="ID expiration date" type="date" value={state.idExp || ""} onChange={(v) => set("idExp", v)} required />
        <TextField label="SSN last 4 digits or ITIN" value={state.ssnLast4 || ""} onChange={(v) => set("ssnLast4", v)} required hint="Used for tax identity verification only." />
        <IdUploads idType={state.idType || ""} uploads={idUploads} setUploads={setIdUpload} showErrors={showUploadErrors} />
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
    </>
  );
}

function EbayCreate({ state, set, idUploads, setIdUpload, showUploadErrors }: { state: Record<string, string>; set: (k: string, v: string) => void; idUploads: Partial<Record<IdUploadKey, File[]>>; setIdUpload: (key: IdUploadKey, files: File[]) => void; showUploadErrors: boolean }) {
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
        <IdUploads idType={state.idType || ""} uploads={idUploads} setUploads={setIdUpload} showErrors={showUploadErrors} />
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
    </>
  );
}
