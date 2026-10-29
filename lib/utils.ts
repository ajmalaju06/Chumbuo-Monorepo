import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge our custom type scale; otherwise `text-meta` is read as
// a colour and silently dropped when combined with e.g. `text-oatmeal`.
const twMerge = extendTailwindMerge({
  extend: { theme: { text: ["display", "h1", "h2", "h3", "lead", "body", "meta"] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
