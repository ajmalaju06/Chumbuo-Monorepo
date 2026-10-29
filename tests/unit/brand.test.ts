import { describe, expect, it } from "vitest";
import { contrastRatio } from "@/lib/brand/contrast";
import { BRAND, MARK, MARK_ASPECT, WORDMARK } from "@/lib/brand/geometry";
import { horizontalSvg, stackedSvg, wordmarkSvg } from "@/lib/brand/svg";

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

describe("brand assets", () => {
  it("wordmark path data is clean", () => {
    expect(WORDMARK.d).not.toMatch(/NaN|undefined/);
    expect(WORDMARK.width).toBeGreaterThan(300);
  });

  it("mark metadata matches the landscape leaf artwork", () => {
    expect(MARK.src).toBe("/brand/chumbuo-mark.png");
    expect(MARK_ASPECT).toBeGreaterThan(1);
    expect(MARK_ASPECT).toBeLessThan(1.6);
  });

  it.each([
    ["horizontal", horizontalSvg("/m.png")],
    ["stacked", stackedSvg("/m.png", "light", "Little moments. Lasting stories.")],
    ["wordmark", wordmarkSvg()],
  ])("%s is a titled, well-formed SVG", (_name, svg) => {
    expect(svg).toMatch(/^<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/);
    expect(svg).toContain("<title>Chumbuo</title>");
    expect(svg).not.toMatch(/NaN|undefined/);
    expect(svg.endsWith("</svg>")).toBe(true);
  });

  it("lockups embed the mark and swap ink per tone", () => {
    expect(horizontalSvg("/m.png", "light")).toContain('href="/m.png"');
    expect(horizontalSvg("/m.png", "dark")).toContain(`fill="${BRAND.oatmeal}"`);
    expect(horizontalSvg("/m.png", "light")).toContain(`fill="${BRAND.pine}"`);
  });
});
