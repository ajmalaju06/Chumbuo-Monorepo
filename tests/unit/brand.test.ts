import { describe, expect, it } from "vitest";
import { contrastRatio } from "@/lib/brand/contrast";
import { BRAND, WORDMARK } from "@/lib/brand/geometry";
import { appIconSvg, horizontalSvg, monogramSvg, stackedSvg } from "@/lib/brand/svg";

describe("brand palette", () => {
  it("pine on oatmeal passes WCAG AA for body text", () => {
    expect(contrastRatio(BRAND.pine, BRAND.oatmeal)).toBeGreaterThan(7);
  });

  it("lilac on oatmeal is decoration-only (documents why lilac never carries text)", () => {
    expect(contrastRatio(BRAND.lilac, BRAND.oatmeal)).toBeLessThan(3);
  });

  it("contrast is symmetric", () => {
    expect(contrastRatio(BRAND.pine, BRAND.lilac)).toBeCloseTo(
      contrastRatio(BRAND.lilac, BRAND.pine),
    );
  });
});

describe("brand SVGs", () => {
  it("wordmark path data is clean", () => {
    expect(WORDMARK.d).not.toMatch(/NaN|undefined/);
    expect(WORDMARK.width).toBeGreaterThan(300);
  });

  it.each([
    ["monogram", monogramSvg()],
    ["horizontal", horizontalSvg()],
    ["stacked", stackedSvg("light", "Little moments. Lasting stories.")],
    ["app icon", appIconSvg()],
  ])("%s is a titled, well-formed SVG", (_name, svg) => {
    expect(svg).toMatch(/^<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/);
    expect(svg).toContain("<title>Chumbuo</title>");
    expect(svg).not.toMatch(/NaN|undefined/);
    expect(svg.endsWith("</svg>")).toBe(true);
  });

  it("dark tone swaps ink to oatmeal", () => {
    expect(horizontalSvg("dark")).toContain(`fill="${BRAND.oatmeal}"`);
    expect(horizontalSvg("light")).toContain(`fill="${BRAND.pine}"`);
  });
});
