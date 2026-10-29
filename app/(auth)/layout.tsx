import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Star } from "@/components/site/ornaments";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="surface-pine relative hidden flex-col justify-between overflow-hidden p-12 lg:flex">
        <Link href="/" className="w-fit text-[2.25rem]" aria-label="Chumbuo home">
          <Logo tone="dark" />
        </Link>
        <div>
          <Star className="mb-8 size-6 text-lilac" />
          <p className="max-w-[16ch] font-display text-h2 text-oatmeal">
            Little moments. Lasting stories.
          </p>
        </div>
        <p className="text-meta text-ink-muted">The writing desk</p>
      </aside>

      <main className="flex flex-col px-gutter py-10 lg:justify-center lg:px-[clamp(3rem,8vw,9rem)]">
        <Link href="/" className="mb-14 w-fit text-[1.75rem] lg:hidden" aria-label="Chumbuo home">
          <Logo />
        </Link>
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
