import { WORDMARK } from "./wordmark.generated";

export const BRAND = {
  oatmeal: "#E8DCC6",
  pine: "#1F3B2E",
  lilac: "#CBB3E8",
} as const;

export type LogoTone = "light" | "dark";

/** Ink colours per surface: "light" sits on oatmeal, "dark" sits on pine. */
export const TONES: Record<LogoTone, { ink: string; bloom: string; outer: string; gap: string }> = {
  light: { ink: BRAND.pine, bloom: BRAND.lilac, outer: BRAND.pine, gap: BRAND.oatmeal },
  dark: { ink: BRAND.oatmeal, bloom: BRAND.lilac, outer: BRAND.oatmeal, gap: BRAND.pine },
};

/**
 * One petal, base at the origin, pointing up. Petals double as pages fanning
 * open — the "unfolding bloom".
 */
export function petal(length: number, width: number) {
  const L = length;
  const W = width;
  return `M0 0C${-W} ${-L * 0.35} ${-W * 0.6} ${-L * 0.8} 0 ${-L}C${W * 0.6} ${-L * 0.8} ${W} ${-L * 0.35} 0 0Z`;
}

export type PetalSpec = { d: string; rotate: number; role: "outer" | "bloom" };

/** Bloom mark on a 64×64 grid, base at (32, 56). Back-to-front draw order. */
export const BLOOM_VIEWBOX = 64;
export const BLOOM_BASE = { x: 32, y: 56 } as const;
export const BLOOM_PETALS: PetalSpec[] = [
  { d: petal(28, 9), rotate: -62, role: "outer" },
  { d: petal(28, 9), rotate: 62, role: "outer" },
  { d: petal(38, 11), rotate: -30, role: "bloom" },
  { d: petal(38, 11), rotate: 30, role: "bloom" },
  { d: petal(48, 12.5), rotate: 0, role: "bloom" },
];

/** The lilac petal set inside the final "o" — the wordmark's one custom detail. */
export const WORDMARK_PETAL = (() => {
  const o = WORDMARK.finalO;
  const cx = (o.x1 + o.x2) / 2;
  const h = o.y2 - o.y1;
  return { x: cx, y: o.y2 - h * 0.2, d: petal(h * 0.56, h * 0.15) };
})();

export { WORDMARK };
