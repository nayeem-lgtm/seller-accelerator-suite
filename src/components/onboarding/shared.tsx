import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, ChevronDown, UploadCloud, X, ShieldCheck, FileText, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* ---------- Types ---------- */
export type PlatformKey = "walmart" | "tiktok" | "ebay";
export type Branch = "existing" | "create";

export const PLATFORMS: Record<PlatformKey, { name: string; price: number; tagline: string; accent: string; ring: string }> = {
  walmart: {
    name: "Walmart",
    price: 499,
    tagline: "Best for established businesses ready to scale on Walmart Marketplace.",
    accent: "from-[#0071dc] to-[#ffc220]",
    ring: "ring-[#0071dc]/30",
  },
  tiktok: {
    name: "TikTok Shop",
    price: 299,
    tagline: "Best for brands and sellers who want social-commerce growth.",
    accent: "from-black to-[#25F4EE]",
    ring: "ring-black/30",
  },
  ebay: {
    name: "eBay",
    price: 99,
    tagline: "Best for beginner-friendly marketplace selling and managed fulfillment support.",
    accent: "from-[#e53238] via-[#0064d2] to-[#f5af02]",
    ring: "ring-[#0064d2]/30",
  },
};

export const PLATFORM_FULL_NAME: Record<PlatformKey, string> = {
  walmart: "Walmart Marketplace",
  tiktok: "TikTok Shop",
  ebay: "eBay",
};

export const PLATFORM_STORE_LABEL: Record<PlatformKey, string> = {
  walmart: "Walmart Marketplace store",
  tiktok: "TikTok Shop store",
  ebay: "eBay store",
};

export const PLATFORM_LOGIN_LABEL: Record<PlatformKey, { email: string; password: string }> = {
  walmart: {
    email: "Walmart Seller Center login email",
    password: "Walmart Seller Center login password",
  },
  tiktok: {
    email: "TikTok Shop Seller Center login email",
    password: "TikTok Shop Seller Center login password",
  },
  ebay: {
    email: "eBay Seller Hub login email",
    password: "eBay Seller Hub login password",
  },
};

export function totalForPlatforms(platforms: PlatformKey[]): number {
  return platforms.reduce((sum, k) => sum + PLATFORMS[k].price, 0);
}

export function platformsLabel(platforms: PlatformKey[]): string {
  const names = platforms.map((p) => PLATFORM_FULL_NAME[p]);
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

/* ---------- Stepper ---------- */
export function Stepper({ current, steps }: { current: number; steps: string[] }) {
  return (
    <div className="mt-6 flex items-center gap-2">
      {steps.map((s, i) => {
        const active = i === current;
        const done = i < current;
        return (
          <div key={s} className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className={`h-9 w-9 shrink-0 rounded-full grid place-items-center text-xs font-bold border-2 transition ${
                active
                  ? "border-primary text-primary bg-primary/10"
                  : done
                  ? "border-primary brand-gradient text-white"
                  : "border-border text-muted-foreground bg-white"
              }`}
            >
              {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <div
              className={`text-sm font-medium truncate ${
                active || done ? "text-foreground" : "text-muted-foreground"
              } hidden sm:block`}
            >
              {s}
            </div>
            {i < steps.length - 1 && <div className={`flex-1 h-px ${done ? "bg-primary" : "bg-border"}`} />}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Field ---------- */
export function Field({
  label,
  hint,
  required,
  children,
  full,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <Label className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
  hint,
  full,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
  hint?: string;
  full?: boolean;
}) {
  return (
    <Field label={label} hint={hint} required={required} full={full}>
      <Input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} required={required} />
    </Field>
  );
}

export function PasswordField({
  label,
  value,
  onChange,
  required,
  hint,
  full,
  placeholder = "Enter password",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  hint?: string;
  full?: boolean;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <Field label={label} hint={hint} required={required} full={full}>
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          autoComplete="new-password"
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-primary/[0.06] transition-colors"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </Field>
  );
}

/* ---------- CollapsibleCard ---------- */
export function CollapsibleCard({
  title,
  subtitle,
  defaultOpen = false,
  children,
  index,
}: {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  index?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-border bg-white/70 backdrop-blur-sm shadow-[0_4px_20px_-12px_rgba(15,23,42,0.08)] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-primary/[0.03] transition"
      >
        <div className="flex items-center gap-3 min-w-0">
          {typeof index === "number" && (
            <div className="h-8 w-8 shrink-0 rounded-full brand-gradient text-white grid place-items-center text-sm font-bold">
              {index}
            </div>
          )}
          <div className="min-w-0">
            <div className="font-semibold truncate">{title}</div>
            {subtitle && <div className="text-xs text-muted-foreground truncate">{subtitle}</div>}
          </div>
        </div>
        <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-border/60">
          <div className="grid sm:grid-cols-2 gap-4 pt-4">{children}</div>
        </div>
      )}
    </div>
  );
}

/* ---------- FileUploadBox ---------- */
export function FileUploadBox({
  label,
  required,
  accept = ".pdf,.jpg,.jpeg,.png,.xlsx,.docx",
  files: filesProp,
  onFilesChange,
  error,
}: {
  label: string;
  required?: boolean;
  accept?: string;
  files?: File[];
  onFilesChange?: (files: File[]) => void;
  error?: string;
}) {
  const [internalFiles, setInternalFiles] = useState<File[]>([]);
  const isControlled = filesProp !== undefined;
  const files = isControlled ? filesProp! : internalFiles;
  const updateFiles = (next: File[]) => {
    if (!isControlled) setInternalFiles(next);
    onFilesChange?.(next);
  };
  const inputRef = useRef<HTMLInputElement>(null);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = Array.from(e.dataTransfer.files);
    if (f.length) updateFiles([...files, ...f]);
  };
  return (
    <div>
      <div className="text-sm font-medium mb-1.5">
        {label} {required && <span className="text-destructive">*</span>}
      </div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed transition p-4 text-center ${
          error
            ? "border-destructive/60 bg-destructive/[0.04] hover:border-destructive"
            : "border-border bg-muted/30 hover:border-primary/50 hover:bg-primary/[0.03]"
        }`}
      >
        <UploadCloud className={`h-5 w-5 mx-auto ${error ? "text-destructive" : "text-primary"}`} />
        <div className="mt-1 text-xs font-medium">Drop files or click to upload</div>
        <div className="text-[10px] text-muted-foreground mt-0.5">{accept.replaceAll(".", "").toUpperCase()}</div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          className="hidden"
          onChange={(e) => {
            const f = Array.from(e.target.files ?? []);
            if (f.length) updateFiles([...files, ...f]);
          }}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-destructive font-medium">{error}</p>
      )}
      {files.length > 0 && (
        <ul className="mt-2 space-y-1">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between gap-2 text-xs rounded-lg bg-primary/5 px-2.5 py-1.5">
              <span className="flex items-center gap-1.5 min-w-0">
                <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate">{f.name}</span>
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateFiles(files.filter((_, j) => j !== i));
                }}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function PrivacyNote() {
  return (
    <div className="flex items-start gap-2 rounded-xl bg-primary/5 border border-primary/15 p-3 text-xs text-foreground/80">
      <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
      <span>
        Your information is encrypted and used only for onboarding, verification support, and service delivery.
        Documents are never shared with third parties outside the scope of your seller setup.
      </span>
    </div>
  );
}

/* ---------- SignaturePad ---------- */
export function SignaturePad({ onChange }: { onChange?: (dataUrl: string | null) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [hasInk, setHasInk] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(ratio, ratio);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 2;
    }
  }, []);

  const pos = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = true;
    const { x, y } = pos(e);
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const { x, y } = pos(e);
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.lineTo(x, y);
    ctx.stroke();
    if (!hasInk) setHasInk(true);
  };
  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    if (onChange && canvasRef.current) onChange(canvasRef.current.toDataURL("image/png"));
  };
  const clear = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);
    onChange?.(null);
  };

  return (
    <div>
      <div className="rounded-xl border-2 border-dashed border-border bg-muted/20 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-40 touch-none block bg-white"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
        />
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-muted-foreground">{hasInk ? "Signature captured" : "Draw your signature above"}</span>
        <button type="button" onClick={clear} className="text-xs font-medium text-primary hover:underline">
          Clear
        </button>
      </div>
    </div>
  );
}
