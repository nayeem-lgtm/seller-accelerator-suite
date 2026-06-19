import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl brand-gradient p-10 md:p-16 text-white text-center">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/30 blur-3xl animate-float" />
            <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-spark/40 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
          </div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold mb-5">
              <Sparkles className="h-3 w-3" /> Operations built around Walmart
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-tight">
              Start Building Your Marketplace Business With Professional Operations Behind You
            </h2>
            <p className="mt-5 text-white/85 max-w-2xl mx-auto whitespace-pre-line">
              Anchor on Walmart. Grow on TikTok. Expand on eBay.{"\n\n"}&nbsp;
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="rounded-full bg-white text-primary hover:bg-white/90 px-6">
                <Link to="/seller-onboarding">Launch Your Store <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full bg-transparent border-white/40 text-white hover:bg-white/10 px-6">
                <Link to="/login">Log In</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
