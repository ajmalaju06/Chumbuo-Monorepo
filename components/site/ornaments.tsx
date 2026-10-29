import Link from "next/link";
import { cn } from "@/lib/utils";

/** Four-point star used as a section marker and in the seal. */
export function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("h-5 w-5", className)}>
      <path
        d="M12 0C12.9 7.4 16.6 11.1 24 12C16.6 12.9 12.9 16.6 12 24C11.1 16.6 7.4 12.9 0 12C7.4 11.1 11.1 7.4 12 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Circular "CHUMBUO · A PERSONAL JOURNAL" seal. Rotates slowly; the global
 * reduced-motion rule stops it.
 */
export function Seal({
  text = "Chumbuo — a personal journal — ",
  className,
}: {
  text?: string;
  className?: string;
}) {
  return (
    <span aria-hidden className={cn("relative inline-grid size-28 place-items-center", className)}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 animate-[spin_28s_linear_infinite]">
        <defs>
          <path id="seal-circle" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" />
        </defs>
        <circle cx="50" cy="50" r="49" fill="var(--color-paper)" />
        <text fontSize="8.4" letterSpacing="2.6" fill="currentColor" className="uppercase">
          <textPath href="#seal-circle">{text.toUpperCase()}</textPath>
        </text>
      </svg>
      <Star className="relative size-6 text-pine" />
    </span>
  );
}

type ArrowButtonProps = {
  href: string;
  label: string;
  className?: string;
};

/** Circle-with-arrow link used on story cards. `label` is the accessible name. */
export function ArrowLink({ href, label, className }: ArrowButtonProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "group inline-grid size-11 place-items-center rounded-full border border-current transition-colors duration-300 hover:bg-pine hover:text-oatmeal",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="size-4 transition-transform duration-300 ease-(--ease-editorial) group-hover:translate-x-0.5"
      >
        <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </Link>
  );
}

/** Pill CTA, filled pine. Matches the mockup's "Explore my journey" button. */
export function PillLink({
  href,
  children,
  className,
  tone = "pine",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  tone?: "pine" | "outline";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex min-h-11 items-center gap-3 rounded-full px-6 text-meta transition-colors duration-300",
        tone === "pine"
          ? "bg-pine text-oatmeal hover:bg-pine-soft"
          : "border border-current hover:bg-pine hover:text-oatmeal",
        className,
      )}
    >
      {children}
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
      >
        <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </Link>
  );
}
