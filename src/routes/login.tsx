import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
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
import { Checkbox } from "@/components/ui/checkbox";
import logoAsset from "@/assets/ray-logo.asset.json";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log In | Ray Ecommerce" },
      { name: "description", content: "Log in to your Ray Ecommerce seller dashboard." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    reset: s.reset === "1" || s.reset === 1 || s.reset === true ? 1 : undefined,
  }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(1, "Password is required").max(72),
});

function LoginPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const { reset } = Route.useSearch();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) navigate({ to: "/dashboard" });
  }, [user, authLoading, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setSubmitting(false);
    if (error) {
      toast.error(error.message || "Invalid email or password");
      return;
    }
    toast.success("Welcome back!");
    router.invalidate();
    if (reset) {
      toast.message("Please set a new password to finish setting up your account.");
      navigate({ to: "/reset-password" });
    } else {
      navigate({ to: "/dashboard" });
    }
  }

  async function onGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/dashboard",
    });
    if (result.error) {
      toast.error("Google sign-in failed");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-blue-50/40 to-white">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={logoAsset.url} alt="Ray Ecommerce" className="h-8" />
        </div>
        <div className="rounded-2xl border border-border bg-white p-8 shadow-[0_8px_40px_-12px_rgba(59,130,246,0.2)]">
          <h1 className="text-2xl font-bold text-foreground">{reset ? "Finish setting up your account" : "Welcome Back"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {reset
              ? "Sign in with the temporary password from your invite email. You'll be prompted to set a new password immediately after."
              : "Log in to access your Ray Ecommerce seller dashboard, documents, onboarding progress, and marketplace service details."}
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-primary hover:underline font-medium">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" disabled={submitting} className="w-full brand-gradient text-white rounded-full">
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Log In
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground">Or</span></div>
          </div>

          <Button type="button" variant="outline" className="w-full rounded-full" onClick={onGoogle}>
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
