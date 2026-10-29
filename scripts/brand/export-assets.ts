/**
 * Writes the brand kit to public/brand (SVG + PNG) and the app icons to app/.
 * Run: pnpm brand:export
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import {
  appIconSvg,
  horizontalSvg,
  monogramSvg,
  stackedSvg,
  wordmarkSvg,
} from "../../lib/brand/svg";

const ROOT = process.cwd();
const BRAND_DIR = join(ROOT, "public/brand");
mkdirSync(BRAND_DIR, { recursive: true });

const TAGLINE = "Little moments. Lasting stories.";

const svgs: Record<string, string> = {
  "chumbuo-horizontal-light.svg": horizontalSvg("light"),
  "chumbuo-horizontal-dark.svg": horizontalSvg("dark"),
  "chumbuo-stacked-light.svg": stackedSvg("light", TAGLINE),
  "chumbuo-stacked-dark.svg": stackedSvg("dark", TAGLINE),
  "chumbuo-wordmark-light.svg": wordmarkSvg("light"),
  "chumbuo-wordmark-dark.svg": wordmarkSvg("dark"),
  "chumbuo-monogram-light.svg": monogramSvg("light"),
  "chumbuo-monogram-dark.svg": monogramSvg("dark"),
  "chumbuo-app-icon.svg": appIconSvg("dark"),
};

async function main() {
  for (const [name, content] of Object.entries(svgs)) {
    writeFileSync(join(BRAND_DIR, name), content);
  }

  const png = (svg: string, size: number) =>
    sharp(Buffer.from(svg), { density: 600 }).resize(size, size).png().toBuffer();

  // Social avatar: square, no rounding — platforms crop to circles themselves.
  writeFileSync(
    join(BRAND_DIR, "chumbuo-avatar-512.png"),
    await png(appIconSvg("dark", 512, 0), 512),
  );
  writeFileSync(join(BRAND_DIR, "chumbuo-app-icon-512.png"), await png(appIconSvg("dark"), 512));
  writeFileSync(join(BRAND_DIR, "chumbuo-app-icon-192.png"), await png(appIconSvg("dark"), 192));

  // Next.js file-convention icons.
  writeFileSync(join(ROOT, "app/icon.svg"), appIconSvg("dark", 32));
  writeFileSync(join(ROOT, "app/apple-icon.png"), await png(appIconSvg("dark", 180, 0), 180));

  console.log(`exported ${Object.keys(svgs).length} SVGs + PNGs to public/brand, icons to app/`);
}

main();
