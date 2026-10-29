import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Logo, Monogram, Wordmark } from "@/components/brand/Logo";
import { ArrowLink, PillLink, Seal, Star } from "@/components/site/ornaments";
import { contrastRatio } from "@/lib/brand/contrast";
import { BRAND } from "@/lib/brand/geometry";

export const metadata: Metadata = {
  title: "Brand system",
  robots: { index: false, follow: false },
};

const TAGLINE = "Little moments. Lasting stories.";

const DOWNLOADS = [
  "chumbuo-horizontal-light.svg",
  "chumbuo-horizontal-dark.svg",
  "chumbuo-stacked-light.svg",
  "chumbuo-stacked-dark.svg",
  "chumbuo-wordmark-light.svg",
  "chumbuo-wordmark-dark.svg",
  "chumbuo-monogram-light.svg",
  "chumbuo-monogram-dark.svg",
  "chumbuo-app-icon.svg",
  "chumbuo-app-icon-512.png",
  "chumbuo-avatar-512.png",
];

const PAIRS: [string, keyof typeof BRAND, keyof typeof BRAND][] = [
  ["Pine on oatmeal", "pine", "oatmeal"],
  ["Oatmeal on pine", "oatmeal", "pine"],
  ["Lilac on pine", "lilac", "pine"],
  ["Pine on lilac", "pine", "lilac"],
  ["Lilac on oatmeal", "lilac", "oatmeal"],
];

/** Internal style guide for reviewing the brand system. Not served in production. */
export default function BrandPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto max-w-page px-gutter py-16">
      <header className="rule mb-20 border-b pb-10">
        <p className="text-meta text-ink-muted">Brand system</p>
        <h1 className="mt-4 text-display">Chumbuo</h1>
        <p className="mt-6 max-w-prose text-lead">{TAGLINE}</p>
      </header>

      <Section title="Lockups">
        <div className="grid gap-px overflow-hidden rounded-sm md:grid-cols-2">
          <div className="grid min-h-72 place-items-center bg-paper p-10 text-[3.5rem]">
            <Logo />
          </div>
          <div className="surface-pine grid min-h-72 place-items-center p-10 text-[3.5rem]">
            <Logo />
          </div>
          <div className="grid min-h-96 place-items-center bg-paper p-10 text-[4.5rem]">
            <Logo variant="stacked" tagline={TAGLINE} />
          </div>
          <div className="surface-pine grid min-h-96 place-items-center p-10 text-[4.5rem]">
            <Logo variant="stacked" tagline={TAGLINE} />
          </div>
        </div>
      </Section>

      <Section title="Monogram at small sizes">
        <div className="flex flex-wrap items-end gap-10">
          {[16, 24, 32, 48, 96].map((s) => (
            <figure key={s} className="flex flex-col items-center gap-3">
              <span style={{ width: s, height: s }} className="block">
                <Monogram className="size-full" title={`Monogram at ${s}px`} />
              </span>
              <figcaption className="text-meta text-ink-muted">{s}px</figcaption>
            </figure>
          ))}
          <figure className="flex flex-col items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/chumbuo-app-icon-192.png" alt="App icon" width={96} height={96} />
            <figcaption className="text-meta text-ink-muted">App icon</figcaption>
          </figure>
        </div>
        <div className="mt-10 text-[2rem]">
          <Wordmark title="Chumbuo wordmark" className="h-[1em]" />
        </div>
      </Section>

      <Section title="Colour">
        <div className="grid gap-6 sm:grid-cols-3">
          {(Object.keys(BRAND) as (keyof typeof BRAND)[]).map((k) => (
            <div key={k}>
              <div
                className="rule aspect-square rounded-full border"
                style={{ background: BRAND[k] }}
              />
              <p className="mt-4 font-display text-2xl capitalize">{k}</p>
              <p className="text-meta text-ink-muted">{BRAND[k]}</p>
            </div>
          ))}
        </div>
        <table className="mt-12 w-full max-w-2xl text-left text-sm">
          <thead>
            <tr className="text-meta text-ink-muted">
              <th className="py-2 font-medium">Pair</th>
              <th className="py-2 font-medium">Ratio</th>
              <th className="py-2 font-medium">Use for</th>
            </tr>
          </thead>
          <tbody>
            {PAIRS.map(([label, fg, bg]) => {
              const r = contrastRatio(BRAND[fg], BRAND[bg]);
              return (
                <tr key={label} className="rule border-t">
                  <td className="py-3">
                    <span
                      className="rounded-sm px-2 py-1"
                      style={{ color: BRAND[fg], background: BRAND[bg] }}
                    >
                      {label}
                    </span>
                  </td>
                  <td className="py-3 tabular-nums">{r.toFixed(2)}:1</td>
                  <td className="py-3">
                    {r >= 4.5 ? "Any text" : r >= 3 ? "Large display type" : "Decoration only"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Section>

      <Section title="Type">
        <div className="space-y-10">
          <Specimen token="display" className="text-display">
            Stories in <span className="text-lilac-deep italic">Bloom.</span>
          </Specimen>
          <Specimen token="h1" className="text-h1">
            A quieter you
          </Specimen>
          <Specimen token="h2" className="text-h2">
            Finding magic in the mountains
          </Specimen>
          <Specimen token="h3" className="text-h3">
            What makes a home?
          </Specimen>
          <Specimen token="lead" className="max-w-prose text-lead">
            Travel, everyday moments, thoughts and experiences from a simpler, more intentional
            life.
          </Specimen>
          <Specimen token="body" className="max-w-prose text-body">
            Good food, a warm cup of coffee and a reminder to just be present. The morning light
            came in sideways through the kitchen window, and for once I let the kettle whistle a
            little longer than it needed to.
          </Specimen>
          <Specimen token="meta" className="text-meta">
            Travel — 12 May 2024
          </Specimen>
        </div>
      </Section>

      <Section title="Ornaments and controls">
        <div className="flex flex-wrap items-center gap-10">
          <Star className="size-8" />
          <Seal />
          <ArrowLink href="#" label="Read story" />
          <PillLink href="#">Explore my journey</PillLink>
          <PillLink href="#" tone="outline">
            About me
          </PillLink>
        </div>
      </Section>

      <Section title="Downloads">
        <ul className="grid gap-2 sm:grid-cols-2">
          {DOWNLOADS.map((f) => (
            <li key={f}>
              <a
                className="underline decoration-lilac decoration-2 underline-offset-4 hover:decoration-pine"
                href={`/brand/${f}`}
                download
              >
                {f}
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-24">
      <h2 className="mb-8 text-h3">{title}</h2>
      {children}
    </section>
  );
}

function Specimen({
  token,
  className,
  children,
}: {
  token: string;
  className: string;
  children: React.ReactNode;
}) {
  const display = ["display", "h1", "h2", "h3"].includes(token);
  return (
    <div className="rule grid gap-4 border-t pt-4 md:grid-cols-[8rem_1fr]">
      <p className="text-meta text-ink-muted">{token}</p>
      <div className={`${className} ${display ? "font-display" : ""}`}>{children}</div>
    </div>
  );
}
