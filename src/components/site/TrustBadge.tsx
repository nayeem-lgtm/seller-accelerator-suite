import { BadgeCheck, ShieldCheck } from "lucide-react";
import { PlatformLogo } from "./PlatformLogo";

export function TrustBadge({
  label = "Walmart Marketplace approved Solution Provider",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-[#0071DC]/20 bg-[#0071DC]/5 px-3.5 py-1.5 text-xs md:text-sm font-semibold text-[#0071DC] shadow-sm ${className}`}
    >
      <BadgeCheck className="h-4 w-4 text-[#0071DC]" />
      {label}
    </span>
  );
}

/**
 * Wide premium "Approved Solution Provider" trust card for the hero area.
 * White card · thin blue border · soft shadow · responsive (stacks on mobile).
 */
export function ApprovedSolutionProviderCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-full max-w-xl rounded-2xl border border-[#0071DC]/25 bg-white/95 backdrop-blur shadow-[0_10px_30px_-12px_rgba(0,113,220,0.25)] px-4 py-3.5 md:px-5 md:py-4 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
        <div className="flex items-center gap-2 shrink-0">
          <PlatformLogo platform="walmart" className="h-6 md:h-7 w-auto" />
        </div>
        <div className="hidden sm:block h-10 w-px bg-[#0071DC]/15" />
        <div className="flex items-start gap-2.5 min-w-0">
          <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0071DC]/10 text-[#0071DC]">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <div className="text-sm md:text-[15px] font-bold text-foreground leading-tight">
              Walmart Marketplace approved Solution Provider
            </div>
            <div className="mt-0.5 text-xs md:text-[13px] text-muted-foreground leading-snug">
              Officially listed Solution Provider for Walmart Marketplace seller growth.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
