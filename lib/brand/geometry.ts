import { MARK } from "./mark.generated";
import { WORDMARK } from "./wordmark.generated";

export const BRAND = {
  oatmeal: "#E8DCC6",
  pine: "#1F3B2E",
  lilac: "#CBB3E8",
} as const;

export type LogoTone = "light" | "dark";

/**
 * Wordmark colours per surface: "light" sits on oatmeal, "dark" on pine.
 * `accent` (the petal in the final "o") is sampled from the leaf artwork.
 */
export const TONES: Record<LogoTone, { ink: string; accent: string }> = {
  light: { ink: BRAND.pine, accent: "#8F6B92" },
  dark: { ink: BRAND.oatmeal, accent: "#C9B0C6" },
};

/** Single-path leaf, base at the origin, pointing up. */
export function petal(length: number, width: number) {
  const L = length;
  const W = width;
  return `M0 0C${-W} ${-L * 0.3} ${-W * 0.7} ${-L * 0.72} 0 ${-L}C${W * 0.7} ${-L * 0.72} ${W} ${-L * 0.3} 0 0Z`;
}

/** The petal set inside the final "o" — the wordmark's one custom detail. */
export const WORDMARK_PETAL = (() => {
  const o = WORDMARK.finalO;
  const cx = (o.x1 + o.x2) / 2;
  const h = o.y2 - o.y1;
  return { x: cx, y: o.y2 - h * 0.2, d: petal(h * 0.56, h * 0.15) };
})();

/** Width ÷ height of the leaf mark artwork. */
export const MARK_ASPECT = MARK.width / MARK.height;

export { MARK, WORDMARK };
