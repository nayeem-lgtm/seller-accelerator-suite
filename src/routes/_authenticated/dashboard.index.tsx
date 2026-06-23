import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Loader2, Upload, Trash2, User as UserIcon, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, initialsOf } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: ProfilePage,
});

const EMPTY = {
  full_name: "",
  phone: "",
  company_name: "",
  selected_marketplace: "",
  address_line_1: "",
  city: "",
  state: "",
  zip_code: "",
  country: "",
  website_url: "",
};

function accountStatus(pay?: string | null, ob?: string | null) {
  const p = (pay || "").toLowerCase();
  const o = (ob || "").toLowerCase();
  if (o === "marketplace_setup_started")
    return { label: "Setup Started", tone: "bg-blue-50 text-blue-700 border-blue-200" };
  if (o === "account_review")
    return { label: "Under Review", tone: "bg-amber-50 text-amber-800 border-amber-200" };
  if (p === "paid") return { label: "Active", tone: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  return { label: "Pending Setup", tone: "bg-slate-100 text-slate-700 border-slate-200" };
}

function ProfilePage() {
  const { user } = useAuth();
  const { profile, avatarUrl, loading, refresh } = useProfile();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!profile) return;
    setForm({
      full_name: profile.full_name ?? "",
      phone: profile.phone ?? "",
      company_name: profile.company_name ?? "",
      selected_marketplace: profile.selected_marketplace ?? "",
      address_line_1: profile.address_line_1 ?? "",
      city: profile.city ?? "",
      state: profile.state ?? "",
      zip_code: profile.zip_code ?? "",
      country: profile.country ?? "",
      website_url: profile.website_url ?? "",
    });
  }, [profile]);

  function update<K extends keyof typeof EMPTY>(k: K, v: (typeof EMPTY)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!form.full_name?.trim()) {
      toast.error("Full name is required");
      return;
    }
    setSaving(true);
    const payload: Record<string, unknown> = {
      full_name: form.full_name.trim(),
      phone: form.phone?.trim() || null,
      company_name: form.company_name?.trim() || null,
      selected_marketplace: form.selected_marketplace || null,
      address_line_1: form.address_line_1?.trim() || null,
      city: form.city?.trim() || null,
      state: form.state?.trim() || null,
      zip_code: form.zip_code?.trim() || null,
      country: form.country?.trim() || null,
      website_url: form.website_url?.trim() || null,
    };
    const { error } = await supabase.from("profiles").update(payload as never).eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error("Could not save profile. Please try again.");
      return;
    }
    await refresh();
    toast.success("Profile updated");
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !user) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Please upload a JPG, PNG, or WEBP image");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2 MB");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (upErr) {
      setUploading(false);
      toast.error("Upload failed. Please try again.");
      return;
    }
    if (profile?.avatar_url && profile.avatar_url !== path) {
      await supabase.storage.from("avatars").remove([profile.avatar_url]);
    }
    const { error: dbErr } = await supabase
      .from("profiles")
      .update({ avatar_url: path } as never)
      .eq("id", user.id);
    if (dbErr) {
      setUploading(false);
      toast.error("Saved upload but could not update profile");
      return;
    }
    await refresh();
    setUploading(false);
    toast.success("Photo updated");
  }

  async function handleAvatarRemove() {
    if (!user || !profile?.avatar_url) return;
    setUploading(true);
    await supabase.storage.from("avatars").remove([profile.avatar_url]);
    await supabase.from("profiles").update({ avatar_url: null } as never).eq("id", user.id);
    await refresh();
    setUploading(false);
    toast.success("Photo removed");
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  const status = accountStatus(profile?.payment_status, profile?.onboarding_status);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your personal and business information.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="relative">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="h-20 w-20 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="h-20 w-20 rounded-full grid place-items-center bg-blue-50 text-primary font-bold text-xl border border-border">
              {initialsOf(form.full_name, user?.email)}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold truncate">{form.full_name || user?.email}</h2>
          <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
          <div className="mt-2">
            <Badge variant="outline" className={`rounded-full border px-3 py-1 text-xs font-medium ${status.tone}`}>
              {status.label}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-1.5" />}
            Change Photo
          </Button>
          {profile?.avatar_url && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-full text-destructive hover:text-destructive"
              onClick={handleAvatarRemove}
              disabled={uploading}
            >
              <Trash2 className="h-4 w-4 mr-1.5" /> Remove
            </Button>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Section title="Personal Information" icon={<UserIcon className="h-4 w-4 text-primary" />}>
          <Field label="Full Name" required>
            <Input value={form.full_name} onChange={(e) => update("full_name", e.target.value)} maxLength={120} />
          </Field>
          <Field label="Email">
            <Input value={user?.email ?? ""} readOnly className="bg-muted/40" />
          </Field>
          <Field label="Phone">
            <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} maxLength={32} />
          </Field>
          <Field label="Company Name">
            <Input value={form.company_name} onChange={(e) => update("company_name", e.target.value)} maxLength={120} />
          </Field>
        </Section>

        <Section title="Business Information" icon={<Briefcase className="h-4 w-4 text-primary" />}>
          <Field label="Address">
            <Input value={form.address_line_1} onChange={(e) => update("address_line_1", e.target.value)} maxLength={200} />
          </Field>
          <Field label="City">
            <Input value={form.city} onChange={(e) => update("city", e.target.value)} maxLength={80} />
          </Field>
          <Field label="State / Region">
            <Input value={form.state} onChange={(e) => update("state", e.target.value)} maxLength={80} />
          </Field>
          <Field label="ZIP / Postal Code">
            <Input value={form.zip_code} onChange={(e) => update("zip_code", e.target.value)} maxLength={20} />
          </Field>
          <Field label="Country">
            <Input value={form.country} onChange={(e) => update("country", e.target.value)} maxLength={80} />
          </Field>
          <Field label="Website URL">
            <Input value={form.website_url} onChange={(e) => update("website_url", e.target.value)} maxLength={255} placeholder="https://" />
          </Field>
          <Field label="Marketplace Interest">
            <Select value={form.selected_marketplace || undefined} onValueChange={(v) => update("selected_marketplace", v)}>
              <SelectTrigger><SelectValue placeholder="Select a marketplace" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="walmart">Walmart</SelectItem>
                <SelectItem value="tiktok_shop">TikTok Shop</SelectItem>
                <SelectItem value="ebay">eBay</SelectItem>
                <SelectItem value="multiple">Multiple Platforms</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </Section>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="rounded-full brand-gradient text-white btn-glow px-6">
            {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving</> : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold flex items-center gap-2">{icon} {title}</h3>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}