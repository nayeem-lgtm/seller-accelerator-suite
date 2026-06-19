import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
  center = true,
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  className?: string;
  center?: boolean;
}) {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {(eyebrow || title || subtitle) && (
          <div className={`mb-12 ${center ? "text-center mx-auto max-w-3xl" : "max-w-3xl"}`}>
            {eyebrow && (
              <div className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-primary mb-3">
                {eyebrow}
              </div>
            )}
            {title && (
              <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-4 text-base md:text-lg text-muted-foreground">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function Disclaimer({ children }: { children: ReactNode }) {
  return (
    <p className="mt-6 text-xs text-muted-foreground italic max-w-3xl mx-auto text-center">
      {children}
    </p>
  );
}
