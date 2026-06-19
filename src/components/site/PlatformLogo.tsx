import type { PlatformKey } from "@/components/onboarding/shared";

/**
 * Brand wordmark/symbol renderings for platform identification.
 * Stylized SVGs — not official artwork. Used for clarity only.
 */
export function PlatformLogo({
  platform,
  className = "h-7 w-auto",
  variant = "wordmark",
}: {
  platform: PlatformKey | "walmart" | "tiktok" | "ebay";
  className?: string;
  variant?: "wordmark" | "mark";
}) {
  if (variant === "mark") {
    if (platform === "walmart") {
      return (
        <svg viewBox="0 0 40 40" className={className} role="img" aria-label="Walmart">
          <g transform="translate(4,4)">
            <Spark cx={16} cy={16} r={15} color="#FFC220" />
          </g>
        </svg>
      );
    }
    if (platform === "tiktok") {
      return (
        <svg viewBox="0 0 40 40" className={className} role="img" aria-label="TikTok Shop">
          <g transform="translate(4,4)">
            <TikTokMark size={32} />
          </g>
        </svg>
      );
    }
    // ebay
    return (
      <svg viewBox="0 0 56 40" className={className} role="img" aria-label="eBay">
        <text x={2} y={30} fontFamily="Inter, system-ui, sans-serif" fontWeight={800} fontSize={26} letterSpacing="-1.4">
          <tspan fill="#E53238">e</tspan>
          <tspan fill="#0064D2">b</tspan>
          <tspan fill="#F5AF02">a</tspan>
          <tspan fill="#86B817">y</tspan>
        </text>
      </svg>
    );
  }

  if (platform === "walmart") {
    return (
      <svg viewBox="0 0 160 40" className={className} role="img" aria-label="Walmart">
        <g transform="translate(6,4)">
          <Spark cx={16} cy={16} r={15} color="#FFC220" />
        </g>
        <text x={42} y={27} fontFamily="Inter, system-ui, sans-serif" fontWeight={800} fontSize={20} fill="#0071DC" letterSpacing="-0.5">
          Walmart
        </text>
      </svg>
    );
  }
  if (platform === "tiktok") {
    return (
      <svg viewBox="0 0 180 40" className={className} role="img" aria-label="TikTok Shop">
        <g transform="translate(4,4)">
          <TikTokMark size={32} />
        </g>
        <text x={44} y={27} fontFamily="Inter, system-ui, sans-serif" fontWeight={800} fontSize={18} fill="#0F172A" letterSpacing="-0.4">
          TikTok Shop
        </text>
      </svg>
    );
  }
  // ebay
  return (
    <svg viewBox="0 0 140 40" className={className} role="img" aria-label="eBay">
      <text x={4} y={30} fontFamily="Inter, system-ui, sans-serif" fontWeight={800} fontSize={28} letterSpacing="-1.5">
        <tspan fill="#E53238">e</tspan>
        <tspan fill="#0064D2">b</tspan>
        <tspan fill="#F5AF02">a</tspan>
        <tspan fill="#86B817">y</tspan>
      </text>
    </svg>
  );
}

function Spark({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  const rays = Array.from({ length: 6 }).map((_, i) => {
    const a = (i * Math.PI) / 3;
    const x1 = cx + Math.cos(a) * (r * 0.35);
    const y1 = cy + Math.sin(a) * (r * 0.35);
    const x2 = cx + Math.cos(a) * r;
    const y2 = cy + Math.sin(a) * r;
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={3.4} strokeLinecap="round" />;
  });
  return (
    <g>
      {rays}
      <circle cx={cx} cy={cy} r={r * 0.28} fill={color} />
    </g>
  );
}

function TikTokMark({ size }: { size: number }) {
  const s = size / 32;
  return (
    <g transform={`scale(${s})`}>
      {/* cyan shadow */}
      <path d="M21 4c.6 3 2.4 5.4 5.4 6.2v3.3c-2.1 0-4-.6-5.7-1.7v9.6c0 4.5-3.6 8.1-8.1 8.1-3 0-5.6-1.6-7-4 1 .2 2 .2 3 .1 1.7 2 4.6 2.8 7 1.6 1.8-.9 3-2.8 3-4.8V2.6h3.4z" fill="#25F4EE" />
      {/* pink */}
      <path d="M23 2c.6 3 2.4 5.4 5.4 6.2v3.3c-2.1 0-4-.6-5.7-1.7v9.6c0 4.5-3.6 8.1-8.1 8.1S6.5 23.9 6.5 19.4s3.6-8.1 8.1-8.1c.4 0 .8 0 1.2.1v3.5c-.4-.1-.8-.2-1.2-.2-2.6 0-4.7 2.1-4.7 4.7s2.1 4.7 4.7 4.7 4.7-2.1 4.7-4.7V.6H23V2z" fill="#FE2C55" />
      {/* white */}
      <path d="M22 1c.6 3 2.4 5.4 5.4 6.2v3.3c-2.1 0-4-.6-5.7-1.7v9.6c0 4.5-3.6 8.1-8.1 8.1S5.5 22.9 5.5 18.4s3.6-8.1 8.1-8.1c.4 0 .8 0 1.2.1v3.5c-.4-.1-.8-.2-1.2-.2-2.6 0-4.7 2.1-4.7 4.7s2.1 4.7 4.7 4.7 4.7-2.1 4.7-4.7V0H22v1z" fill="#0F172A" />
    </g>
  );
}

export function PlatformLogoCard({ platform, className = "" }: { platform: "walmart" | "tiktok" | "ebay"; className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center rounded-2xl bg-white border border-border shadow-sm px-4 py-2.5 transition hover:shadow-md hover:-translate-y-0.5 ${className}`}>
      <PlatformLogo platform={platform} className="h-7 w-auto" />
    </div>
  );
}
