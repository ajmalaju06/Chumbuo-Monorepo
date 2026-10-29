import { WORDMARK } from "./wordmark.generated";

export const BRAND = {
  oatmeal: "#E8DCC6",
  pine: "#1F3B2E",
  lilac: "#CBB3E8",
} as const;

export type LogoTone = "light" | "dark";

/**
 * Leaf colours, darkest plum to palest lilac. These deeper shades of the
 * lilac family exist only inside the mark; the rest of the site sticks to the
 * three brand colours. Each leaf is two-tone: [shadow half, lit half].
 * "light" sits on oatmeal, "dark" sits on pine (lighter set for contrast).
 */
type LeafColours = { shade: string; lit: string; outline?: string };

const LEAVES_LIGHT: LeafColours[] = [
  { shade: "#D9C8EC", lit: "#EEE5F7", outline: "#5B3478" },
  { shade: "#3A1A4E", lit: "#55306E" },
  { shade: "#4A2462", lit: "#6A3F88" },
  { shade: "#6E4A94", lit: "#8C69B2" },
  { shade: "#9F82C6", lit: "#B9A0DC" },
];

const LEAVES_DARK: LeafColours[] = [
  { shade: "#E4D8F2", lit: "#F4EEFA" },
  { shade: "#9A78C4", lit: "#B497DC" },
  { shade: "#B094D8", lit: BRAND.lilac },
  { shade: "#A585D0", lit: "#BFA4E3" },
  { shade: "#C4AEE4", lit: "#DACAF0" },
];

export const TONES: Record<
  LogoTone,
  { ink: string; gap: string; leaves: LeafColours[]; accent: string }
> = {
  light: { ink: BRAND.pine, gap: BRAND.oatmeal, leaves: LEAVES_LIGHT, accent: "#6A3F88" },
  dark: { ink: BRAND.oatmeal, gap: BRAND.pine, leaves: LEAVES_DARK, accent: BRAND.lilac },
};

/**
 * One pointed leaf, base at the origin, pointing up, split along its midrib
 * into two halves so each side can take its own shade.
 */
export function leafHalves(length: number, width: number) {
  const L = length;
  const W = width;
  const half = (s: 1 | -1) => `M0 0C${s * W} ${-L * 0.3} ${s * W * 0.7} ${-L * 0.72} 0 ${-L}Z`;
  return { left: half(-1), right: half(1), outline: `${half(-1)}${half(1)}` };
}

/** Single-path leaf for small one-colour uses (the petal in the wordmark "o"). */
export function petal(length: number, width: number) {
  const L = length;
  const W = width;
  return `M0 0C${-W} ${-L * 0.3} ${-W * 0.7} ${-L * 0.72} 0 ${-L}C${W * 0.7} ${-L * 0.72} ${W} ${-L * 0.3} 0 0Z`;
}

export type LeafSpec = {
  left: string;
  right: string;
  outline: string;
  rotate: number;
  /** Index into the tone's leaf colours. */
  colour: number;
};

const leaf = (length: number, width: number, rotate: number, colour: number): LeafSpec => ({
  ...leafHalves(length, width),
  rotate,
  colour,
});

/**
 * Bloom mark on a 64×64 grid: an asymmetric fan of five leaves leaning right,
 * base at (30, 54). Listed in draw order (back to front) — the tall centre
 * leaf sits on top.
 */
export const BLOOM_VIEWBOX = 64;
export const BLOOM_BASE = { x: 30, y: 54 } as const;
export const BLOOM_LEAVES: LeafSpec[] = [
  leaf(29, 8.5, -46, 0),
  leaf(27, 8.5, 70, 4),
  leaf(41, 9.5, -16, 1),
  leaf(39, 11, 42, 3),
  leaf(47, 12.5, 14, 2),
];

/** The petal set inside the final "o" — the wordmark's one custom detail. */
export const WORDMARK_PETAL = (() => {
  const o = WORDMARK.finalO;
  const cx = (o.x1 + o.x2) / 2;
  const h = o.y2 - o.y1;
  return { x: cx, y: o.y2 - h * 0.2, d: petal(h * 0.56, h * 0.15) };
})();

export { WORDMARK };
