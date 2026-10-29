import Image from "next/image";
import { cn } from "@/lib/utils";
import { MARK, TONES, WORDMARK, WORDMARK_PETAL, type LogoTone } from "@/lib/brand/geometry";

/**
 * The leaf mark is raster artwork served through next/image; the wordmark is
 * inline SVG whose ink uses currentColor so it follows its surface. `tone`
 * picks the "o" petal shade ("light" on oatmeal, "dark" on pine).
 */

type MarkProps = {
  className?: string;
  /** Accessible name; omit when the mark sits beside other labelled content. */
  title?: string;
  /** Rendered width hint for next/image, e.g. "48px". */
  sizes?: string;
  priority?: boolean;
};

export function Mark({ className, title, sizes = "96px", priority }: MarkProps) {
  return (
    <Image
      src={MARK.src}
      width={MARK.width}
      height={MARK.height}
      alt={title ?? ""}
      sizes={sizes}
      priority={priority}
      draggable={false}
      className={cn("h-8 w-auto select-none", className)}
    />
  );
}

type WordmarkProps = { className?: string; title?: string; tone?: LogoTone };

export function Wordmark({ className, title, tone = "light" }: WordmarkProps) {
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
  /** Preload the mark — set for above-the-fold logos (header, hero). */
  priority?: boolean;
};

export function Logo({
  variant = "horizontal",
  tone = "light",
  className,
  tagline,
  priority,
}: LogoProps) {
  if (variant === "stacked") {
    return (
      <span
        role="img"
        aria-label="Chumbuo"
        className={cn("inline-flex flex-col items-center", className)}
      >
        <Mark className="mb-[0.12em] h-[2.1em]" sizes="320px" priority={priority} />
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
      className={cn("inline-flex items-center gap-[0.22em]", className)}
    >
      <Mark className="-mt-[0.24em] h-[1.5em]" sizes="128px" priority={priority} />
      <Wordmark tone={tone} className="h-[1em]" />
    </span>
  );
}
