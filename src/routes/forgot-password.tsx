import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logoAsset from "@/assets/ray-logo.asset.json";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot Password | Ray Ecommerce" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = z.string().trim().email().safeParse(email);
    if (!parsed.success) {
      toast.error("Enter a valid email");
      return;
    }
    setSubmitting(true);
    await supabase.auth.resetPasswordForEmail(parsed.data, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSubmitting(false);
    setSent(true);
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-blue-50/40 to-white">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={logoAsset.url} alt="Ray Ecommerce" className="h-8" />
        </div>
        <div className="rounded-2xl border border-border bg-white p-8 shadow-[0_8px_40px_-12px_rgba(59,130,246,0.2)]">
          <h1 className="text-2xl font-bold text-foreground">Reset your password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email and we'll send you a link to reset your password.
          </p>
          {sent ? (
            <div className="mt-6 rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-foreground">
              If an account exists with this email, a reset link has been sent.
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <Button type="submit" disabled={submitting} className="w-full brand-gradient text-white rounded-full">
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Send Reset Link
              </Button>
            </form>
          )}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link to="/login" className="text-primary font-medium hover:underline">Back to log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
