import { cn } from "@/lib/utils";
import {
  BLOOM_BASE,
  BLOOM_LEAVES,
  BLOOM_VIEWBOX,
  TONES,
  WORDMARK,
  WORDMARK_PETAL,
  type LogoTone,
} from "@/lib/brand/geometry";

/**
 * Brand marks render inline. Wordmark ink uses currentColor so it follows its
 * surface; leaf colours depend on `tone` ("light" on oatmeal, "dark" on pine),
 * and the hairline gap between leaves uses `--logo-gap` (the page bg).
 */

type MarkProps = { className?: string; title?: string; tone?: LogoTone };

export function Monogram({ className, title, tone = "light" }: MarkProps) {
  const t = TONES[tone];
  return (
    <svg
      viewBox={`0 0 ${BLOOM_VIEWBOX} ${BLOOM_VIEWBOX}`}
      className={cn("h-8 w-8", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <g transform={`translate(${BLOOM_BASE.x} ${BLOOM_BASE.y})`}>
        {BLOOM_LEAVES.map((l, i) => {
          const c = t.leaves[l.colour];
          return (
            <g key={i} transform={`rotate(${l.rotate})`}>
              <path
                d={l.outline}
                fill="none"
                stroke="var(--logo-gap, var(--color-oatmeal))"
                strokeWidth={2.4}
                strokeLinejoin="round"
              />
              <path d={l.left} fill={c.shade} />
              <path d={l.right} fill={c.lit} />
              {c.outline && (
                <path
                  d={l.outline}
                  fill="none"
                  stroke={c.outline}
                  strokeWidth={0.9}
                  strokeLinejoin="round"
                />
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export function Wordmark({ className, title, tone = "light" }: MarkProps) {
  const h = WORDMARK.bottom - WORDMARK.top;
  const p = WORDMARK_PETAL;
  return (
    <svg
      viewBox={`0 ${WORDMARK.top} ${WORDMARK.width} ${h}`}
      className={cn("h-7 w-auto", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <path d={WORDMARK.d} fill="currentColor" />
      <path d={p.d} transform={`translate(${p.x} ${p.y})`} fill={TONES[tone].accent} />
    </svg>
  );
}

type LogoProps = {
  variant?: "horizontal" | "stacked";
  /** "light" on oatmeal surfaces, "dark" on pine. */
  tone?: LogoTone;
  className?: string;
  /** Rendered under the stacked lockup only. */
  tagline?: string;
};

export function Logo({ variant = "horizontal", tone = "light", className, tagline }: LogoProps) {
  if (variant === "stacked") {
    return (
      <span
        role="img"
        aria-label="Chumbuo"
        className={cn("inline-flex flex-col items-center", className)}
      >
        <Monogram tone={tone} className="-mb-[0.06em] h-[1.5em] w-[1.5em]" />
        <Wordmark tone={tone} className="h-[1em]" />
        {tagline && (
          <span className="mt-[0.5em] text-meta text-[0.14em] whitespace-nowrap">{tagline}</span>
        )}
      </span>
    );
  }
  return (
    <span
      role="img"
      aria-label="Chumbuo"
      className={cn("inline-flex items-center gap-[0.18em]", className)}
    >
      <Monogram tone={tone} className="-mt-[0.2em] h-[1.45em] w-[1.45em]" />
      <Wordmark tone={tone} className="h-[1em]" />
    </span>
  );
}
