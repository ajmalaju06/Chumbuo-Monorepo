/**
 * Plain-string SVG builders for the brand lockups, used by the asset export
 * script. The leaf mark is raster artwork, so lockups embed it as an <image>
 * (`markHref` — a data URI or URL); the wordmark stays vector.
 * The React components in components/brand render the same layout.
 */
import { MARK_ASPECT, TONES, WORDMARK, WORDMARK_PETAL, type LogoTone } from "./geometry";

function wordmarkGroup(tone: LogoTone) {
  const t = TONES[tone];
  const p = WORDMARK_PETAL;
  return `<path d="${WORDMARK.d}" fill="${t.ink}"/><path d="${p.d}" transform="translate(${p.x} ${p.y})" fill="${t.accent}"/>`;
}

const svg = (w: number, h: number, viewBox: string, body: string, title: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="${viewBox}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>`;

const image = (href: string, x: number, y: number, w: number, h: number) =>
  `<image href="${href}" xlink:href="${href}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>`;

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
export function horizontalSvg(markHref: string, tone: LogoTone = "light") {
  const h = WORDMARK.bottom - WORDMARK.top;
  const markH = h * 1.5;
  const markW = markH * MARK_ASPECT;
  const gap = h * 0.22;
  const markY = WORDMARK.top + (h - markH) / 2 - h * 0.12;
  const width = markW + gap + WORDMARK.width;
  const body =
    image(markHref, 0, markY, markW, markH) +
    `<g transform="translate(${markW + gap} 0)">${wordmarkGroup(tone)}</g>`;
  return svg(Math.ceil(width), Math.ceil(markH), `0 ${markY} ${width} ${markH}`, body, "Chumbuo");
}

/** Mark centred above the wordmark, optional tagline beneath. */
export function stackedSvg(markHref: string, tone: LogoTone = "light", tagline?: string) {
  const h = WORDMARK.bottom - WORDMARK.top;
  const markH = h * 2.1;
  const markW = markH * MARK_ASPECT;
  const gap = h * 0.12;
  const taglineH = tagline ? 40 : 0;
  const width = WORDMARK.width;
  const total = markH + gap + h + taglineH;
  const t = TONES[tone];
  const body =
    image(markHref, (width - markW) / 2, 0, markW, markH) +
    `<g transform="translate(0 ${markH + gap - WORDMARK.top})">${wordmarkGroup(tone)}</g>` +
    (tagline
      ? `<text x="${width / 2}" y="${total - 4}" text-anchor="middle" font-family="Jost, Helvetica, Arial, sans-serif" font-size="13" letter-spacing="4.5" fill="${t.ink}">${tagline.toUpperCase()}</text>`
      : "");
  return svg(Math.ceil(width), Math.ceil(total), `0 0 ${width} ${total}`, body, "Chumbuo");
}
