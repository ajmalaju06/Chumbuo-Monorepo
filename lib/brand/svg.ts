/**
 * Plain-string SVG builders for the brand marks. Used by the asset export
 * script and by image routes (favicons, OG) where React DOM isn't available.
 * The React components in components/brand render the same geometry.
 */
import {
  BLOOM_BASE,
  BLOOM_PETALS,
  BLOOM_VIEWBOX,
  BRAND,
  TONES,
  WORDMARK,
  WORDMARK_PETAL,
  type LogoTone,
} from "./geometry";

function bloomGroup(tone: LogoTone, gapWidth = 1.6) {
  const t = TONES[tone];
  const petals = BLOOM_PETALS.map((p) => {
    const fill = p.role === "outer" ? t.outer : t.bloom;
    const opacity = p.role === "outer" ? ' fill-opacity="0.9"' : "";
    return `<path d="${p.d}" transform="rotate(${p.rotate})" fill="${fill}"${opacity} stroke="${t.gap}" stroke-width="${gapWidth}" stroke-linejoin="round"/>`;
  }).join("");
  return `<g transform="translate(${BLOOM_BASE.x} ${BLOOM_BASE.y})">${petals}</g>`;
}

function wordmarkGroup(tone: LogoTone) {
  const t = TONES[tone];
  const p = WORDMARK_PETAL;
  return `<path d="${WORDMARK.d}" fill="${t.ink}"/><path d="${p.d}" transform="translate(${p.x} ${p.y})" fill="${t.bloom}"/>`;
}

const svg = (w: number, h: number, viewBox: string, body: string, title: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${viewBox}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>`;

export function monogramSvg(tone: LogoTone = "light", size = 64) {
  return svg(size, size, `0 0 ${BLOOM_VIEWBOX} ${BLOOM_VIEWBOX}`, bloomGroup(tone), "Chumbuo");
}

export function wordmarkSvg(tone: LogoTone = "light") {
  const h = WORDMARK.bottom - WORDMARK.top;
  return svg(
    WORDMARK.width,
    h,
    `0 ${WORDMARK.top} ${WORDMARK.width} ${h}`,
    wordmarkGroup(tone),
    "Chumbuo",
  );
}

/** Mark left, wordmark right. */
export function horizontalSvg(tone: LogoTone = "light") {
  const h = WORDMARK.bottom - WORDMARK.top;
  const markSize = h * 1.25;
  const gap = h * 0.18;
  const scale = markSize / BLOOM_VIEWBOX;
  const markY = WORDMARK.top + (h - markSize) / 2 - h * 0.08;
  const width = markSize + gap + WORDMARK.width;
  const body =
    `<g transform="translate(0 ${markY}) scale(${scale})">${bloomGroup(tone)}</g>` +
    `<g transform="translate(${markSize + gap} 0)">${wordmarkGroup(tone)}</g>`;
  return svg(
    Math.ceil(width),
    Math.ceil(markSize),
    `0 ${markY} ${width} ${markSize}`,
    body,
    "Chumbuo",
  );
}

/** Mark centred above the wordmark, optional tagline beneath. */
export function stackedSvg(tone: LogoTone = "light", tagline?: string) {
  const h = WORDMARK.bottom - WORDMARK.top;
  const markSize = h * 1.5;
  const scale = markSize / BLOOM_VIEWBOX;
  const gap = -h * 0.06;
  const taglineH = tagline ? 40 : 0;
  const width = WORDMARK.width;
  const total = markSize + gap + h + taglineH;
  const t = TONES[tone];
  const body =
    `<g transform="translate(${(width - markSize) / 2} 0) scale(${scale})">${bloomGroup(tone)}</g>` +
    `<g transform="translate(0 ${markSize + gap - WORDMARK.top})">${wordmarkGroup(tone)}</g>` +
    (tagline
      ? `<text x="${width / 2}" y="${total - 4}" text-anchor="middle" font-family="Jost, Helvetica, Arial, sans-serif" font-size="13" letter-spacing="4.5" fill="${t.ink}">${tagline.toUpperCase()}</text>`
      : "");
  return svg(Math.ceil(width), Math.ceil(total), `0 0 ${width} ${total}`, body, "Chumbuo");
}

/** Square app icon: bloom on a solid tile. */
export function appIconSvg(tone: LogoTone = "dark", size = 512, radius = 0.22) {
  const bg = tone === "dark" ? BRAND.pine : BRAND.oatmeal;
  const inset = BLOOM_VIEWBOX * 0.16;
  const vb = BLOOM_VIEWBOX + inset * 2;
  const body =
    `<rect x="${-inset}" y="${-inset}" width="${vb}" height="${vb}" rx="${vb * radius}" fill="${bg}"/>` +
    `<g transform="translate(0 -2)">${bloomGroup(tone, 2)}</g>`;
  return svg(size, size, `${-inset} ${-inset} ${vb} ${vb}`, body, "Chumbuo");
}
