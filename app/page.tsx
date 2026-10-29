import { Logo } from "@/components/brand/Logo";

// Temporary holding page — replaced by the editorial home in Phase 3.
export default function Home() {
  return (
    <main className="grid min-h-dvh place-items-center px-gutter text-center">
      <div>
        <h1 className="text-[clamp(3rem,10vw,6rem)]">
          <Logo variant="stacked" tagline="Little moments. Lasting stories." priority />
        </h1>
        <p className="mt-10 text-ink-muted">New stories are on their way.</p>
      </div>
    </main>
  );
}
