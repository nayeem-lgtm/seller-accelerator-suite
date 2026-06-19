import { Info } from "lucide-react";
import type { ReactNode } from "react";

export function DisclaimerCard({ children }: { children?: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-amber-200/60 bg-amber-50/60 p-5 text-sm text-amber-900 flex gap-3">
      <Info className="h-5 w-5 shrink-0 mt-0.5" />
      <p className="leading-relaxed">
        {children ??
          "These examples are for illustration only. Actual performance depends on product selection, marketplace approval, demand, pricing, supplier cost, shipping cost, account health, competition, refund rate, and operational execution. Results are not guaranteed."}
      </p>
    </div>
  );
}
