import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/components/brand/Logo";
import { UserMenu } from "./_components/UserMenu";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · Dashboard — Chumbuo" },
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/account", label: "Account" },
];

// Pages authorise themselves with requireRole(); this layout is chrome only,
// so the session read stays inside the user menu's boundary.
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-dvh bg-paper">
      <header className="rule border-b bg-oatmeal">
        <div className="mx-auto flex max-w-page flex-wrap items-center gap-x-10 gap-y-3 px-gutter py-4">
          <Link href="/admin" className="text-[1.5rem]" aria-label="Dashboard home">
            <Logo />
          </Link>
          <nav
            aria-label="Dashboard"
            className="order-last flex w-full gap-6 sm:order-none sm:w-auto"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-meta underline-offset-4 hover:underline"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/" className="text-meta underline-offset-4 hover:underline">
              View site
            </Link>
          </nav>
          <div className="ml-auto">
            <Suspense fallback={<span className="text-meta text-ink-muted">…</span>}>
              <UserMenu />
            </Suspense>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-page px-gutter py-12">{children}</main>
    </div>
  );
}
