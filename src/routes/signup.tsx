import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import logoAsset from "@/assets/ray-logo.asset.json";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up | Ray Ecommerce" },
      { name: "description", content: "Create your Ray Ecommerce seller account." },
    ],
  }),
  component: SignupPage,
});

const schema = z
  .object({
    full_name: z.string().trim().min(2, "Enter your full name").max(100),
    email: z.string().trim().email("Enter a valid email").max(255),
    phone: z.string().trim().min(6, "Enter a valid phone").max(30),
    company_name: z.string().trim().max(120).optional().or(z.literal("")),
    password: z.string().min(8, "Password must be at least 8 characters").max(72),
    confirm: z.string(),
    selected_marketplace: z.enum(["walmart", "tiktok_shop", "ebay", "multiple"]),
  })
  .refine((d) => d.password === d.confirm, { message: "Passwords do not match", path: ["confirm"] });

function SignupPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    password: "",
    confirm: "",
    selected_marketplace: "walmart" as "walmart" | "tiktok_shop" | "ebay" | "multiple",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) navigate({ to: "/dashboard" });
  }, [user, authLoading, navigate]);

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          full_name: parsed.data.full_name,
          phone: parsed.data.phone,
          company_name: parsed.data.company_name,
          selected_marketplace: parsed.data.selected_marketplace,
        },
      },
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message || "Could not create account");
      return;
    }
    toast.success("Account created! Redirecting to your dashboard…");
    navigate({ to: "/dashboard" });
  }

  async function onGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/dashboard",
    });
    if (result.error) {
      toast.error("Google sign-up failed");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-blue-50/40 to-white">
      <div className="w-full max-w-xl">
        <div className="flex justify-center mb-6">
          <img src={logoAsset.url} alt="Ray Ecommerce" className="h-8" />
        </div>
        <div className="rounded-2xl border border-border bg-white p-8 shadow-[0_8px_40px_-12px_rgba(59,130,246,0.2)]">
          <h1 className="text-2xl font-bold text-foreground">Create Your Seller Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Start your onboarding with Ray Ecommerce and manage your marketplace service details from one secure dashboard.
          </p>

          <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input id="full_name" value={form.full_name} onChange={(e) => update("full_name", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input id="company_name" value={form.company_name} onChange={(e) => update("company_name", e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Interested Marketplace</Label>
              <Select value={form.selected_marketplace} onValueChange={(v) => update("selected_marketplace", v as typeof form.selected_marketplace)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="walmart">Walmart</SelectItem>
                  <SelectItem value="tiktok_shop">TikTok Shop</SelectItem>
                  <SelectItem value="ebay">eBay</SelectItem>
                  <SelectItem value="multiple">Multiple Platforms</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete="new-password" value={form.password} onChange={(e) => update("password", e.target.value)} required />
              <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input id="confirm" type="password" autoComplete="new-password" value={form.confirm} onChange={(e) => update("confirm", e.target.value)} required />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={submitting} className="w-full brand-gradient text-white rounded-full">
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Account
              </Button>
            </div>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground">Or</span></div>
          </div>
          <Button type="button" variant="outline" className="w-full rounded-full" onClick={onGoogle}>
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
