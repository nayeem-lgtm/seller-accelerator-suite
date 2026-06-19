import { BadgeCheck } from "lucide-react";

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
