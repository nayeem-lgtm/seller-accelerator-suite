import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Loader2, Upload, Trash2, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/dashboard/profile")({
  component: ProfilePage,
});

type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  company_name: string | null;
  selected_marketplace: string | null;
  avatar_url: string | null;
  address_line_1: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
  website_url: string | null;
};

const EMPTY: Omit<ProfileRow, "id" | "email"> = {
  full_name: "",
  phone: "",
  company_name: "",
  selected_marketplace: "",
  avatar_url: "",
  address_line_1: "",
  city: "",
  state: "",
  zip_code: "",
  country: "",
  website_url: "",
};

function initials(name?: string | null, email?: string | null) {
  const src = (name || email || "?").trim();
  const parts = src.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); // signed URL for display
  const [avatarPath, setAvatarPath] = useState<string | null>(null); // storage path
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select(
          "id,full_name,email,phone,company_name,selected_marketplace,avatar_url,address_line_1,city,state,zip_code,country,website_url",
        )
        .eq("id", user.id)
        .maybeSingle();
      if (cancelled) return;
      const p = (data as ProfileRow | null) ?? null;
      if (p) {
        setForm({
          full_name: p.full_name ?? "",
          phone: p.phone ?? "",
          company_name: p.company_name ?? "",
          selected_marketplace: p.selected_marketplace ?? "",
          avatar_url: p.avatar_url ?? "",
          address_line_1: p.address_line_1 ?? "",
          city: p.city ?? "",
          state: p.state ?? "",
          zip_code: p.zip_code ?? "",
          country: p.country ?? "",
          website_url: p.website_url ?? "",
        });
        setAvatarPath(p.avatar_url ?? null);
        if (p.avatar_url) {
          const { data: signed } = await supabase.storage
            .from("avatars")
            .createSignedUrl(p.avatar_url, 3600);
          if (!cancelled) setAvatarUrl(signed?.signedUrl ?? null);
        }
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

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
    const { error } = await supabase
      .from("profiles")
      .update(payload as never)
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error("Could not save profile. Please try again.");
      return;
    }
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
    // remove previous file
    if (avatarPath && avatarPath !== path) {
      await supabase.storage.from("avatars").remove([avatarPath]);
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
    const { data: signed } = await supabase.storage
      .from("avatars")
      .createSignedUrl(path, 3600);
    setAvatarPath(path);
    setAvatarUrl(signed?.signedUrl ?? null);
    setUploading(false);
    toast.success("Photo updated");
  }

  async function handleAvatarRemove() {
    if (!user || !avatarPath) return;
    setUploading(true);
    await supabase.storage.from("avatars").remove([avatarPath]);
    await supabase.from("profiles").update({ avatar_url: null } as never).eq("id", user.id);
    setAvatarPath(null);
    setAvatarUrl(null);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your personal and business information.</p>
      </div>

      {/* Header card */}
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
              {initials(form.full_name, user?.email)}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold truncate">{form.full_name || user?.email}</h2>
          <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
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
          {avatarPath && (
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

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <Section title="Personal Information">
          <Field label="Full Name" required>
            <Input value={form.full_name ?? ""} onChange={(e) => update("full_name", e.target.value)} maxLength={120} />
          </Field>
          <Field label="Email">
            <Input value={user?.email ?? ""} readOnly className="bg-muted/40" />
          </Field>
          <Field label="Phone">
            <Input value={form.phone ?? ""} onChange={(e) => update("phone", e.target.value)} maxLength={32} />
          </Field>
          <Field label="Company Name">
            <Input value={form.company_name ?? ""} onChange={(e) => update("company_name", e.target.value)} maxLength={120} />
          </Field>
        </Section>

        <Section title="Business Information">
          <Field label="Address">
            <Input value={form.address_line_1 ?? ""} onChange={(e) => update("address_line_1", e.target.value)} maxLength={200} />
          </Field>
          <Field label="City">
            <Input value={form.city ?? ""} onChange={(e) => update("city", e.target.value)} maxLength={80} />
          </Field>
          <Field label="State / Region">
            <Input value={form.state ?? ""} onChange={(e) => update("state", e.target.value)} maxLength={80} />
          </Field>
          <Field label="ZIP / Postal Code">
            <Input value={form.zip_code ?? ""} onChange={(e) => update("zip_code", e.target.value)} maxLength={20} />
          </Field>
          <Field label="Country">
            <Input value={form.country ?? ""} onChange={(e) => update("country", e.target.value)} maxLength={80} />
          </Field>
          <Field label="Website URL">
            <Input value={form.website_url ?? ""} onChange={(e) => update("website_url", e.target.value)} maxLength={255} placeholder="https://" />
          </Field>
          <Field label="Preferred Marketplace">
            <Select value={form.selected_marketplace ?? ""} onValueChange={(v) => update("selected_marketplace", v)}>
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold flex items-center gap-2">
        <UserIcon className="h-4 w-4 text-primary" /> {title}
      </h3>
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