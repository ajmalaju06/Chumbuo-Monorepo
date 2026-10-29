import { cn } from "@/lib/utils";
import {
  BLOOM_BASE,
  BLOOM_PETALS,
  BLOOM_VIEWBOX,
  BRAND,
  WORDMARK,
  WORDMARK_PETAL,
} from "@/lib/brand/geometry";

/**
 * Brand marks render inline so they inherit `color` from their surface:
 * ink and outer petals use currentColor, the bloom is always lilac, and the
 * hairline gap between petals uses `--logo-gap` (defaults to the page bg).
 */

type MarkProps = { className?: string; title?: string };

export function Monogram({ className, title }: MarkProps) {
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
        {BLOOM_PETALS.map((p, i) => (
          <path
            key={i}
            d={p.d}
            transform={`rotate(${p.rotate})`}
            fill={p.role === "outer" ? "currentColor" : BRAND.lilac}
            fillOpacity={p.role === "outer" ? 0.9 : undefined}
            stroke="var(--logo-gap, var(--color-oatmeal))"
            strokeWidth={1.6}
            strokeLinejoin="round"
          />
        ))}
      </g>
    </svg>
  );
}

export function Wordmark({ className, title }: MarkProps) {
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
      <path d={p.d} transform={`translate(${p.x} ${p.y})`} fill={BRAND.lilac} />
    </svg>
  );
}

type LogoProps = {
  variant?: "horizontal" | "stacked";
  className?: string;
  /** Rendered under the stacked lockup only. */
  tagline?: string;
};

export function Logo({ variant = "horizontal", className, tagline }: LogoProps) {
  if (variant === "stacked") {
    return (
      <span
        role="img"
        aria-label="Chumbuo"
        className={cn("inline-flex flex-col items-center", className)}
      >
        <Monogram className="-mb-[0.06em] h-[1.5em] w-[1.5em]" />
        <Wordmark className="h-[1em]" />
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
      <Monogram className="-mt-[0.16em] h-[1.25em] w-[1.25em]" />
      <Wordmark className="h-[1em]" />
    </span>
  );
}
