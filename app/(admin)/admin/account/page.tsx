import type { Metadata } from "next";
import { Suspense } from "react";
import { NewPasswordForm } from "@/app/(auth)/_components/forms";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { removeTotpFactor } from "./actions";
import { DisplayNameForm, TotpSetup } from "./forms";

export const metadata: Metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <Suspense fallback={<div aria-busy="true" className="h-96" />}>
      <Account />
    </Suspense>
  );
}

function Section({
  id,
  title,
  children,
  lede,
}: {
  id: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="rule grid gap-6 border-t pt-10 md:grid-cols-[16rem_minmax(0,32rem)] md:gap-12"
    >
      <div>
        <h2 id={id} className="text-h3">
          {title}
        </h2>
        {lede && <p className="mt-2 text-sm text-ink-muted">{lede}</p>}
      </div>
      <div>{children}</div>
    </section>
  );
}

async function Account() {
  const user = await requireRole("editor", "/admin/account");
  const supabase = await createClient();
  const { data: factors } = await supabase.auth.mfa.listFactors();
  const verified = factors?.totp.filter((f) => f.status === "verified") ?? [];

  return (
    <div className="grid gap-12">
      <header>
        <h1 className="text-h2">Account</h1>
        <p className="mt-3 text-ink-muted">
          {user.email} · {user.role}
        </p>
      </header>

      <Section id="profile" title="Profile" lede="Shown as the author on your stories.">
        <DisplayNameForm defaultValue={user.displayName} />
      </Section>

      <Section id="password" title="Password">
        <NewPasswordForm stay submitLabel="Change password" />
      </Section>

      <Section
        id="mfa"
        title="Two-step verification"
        lede="Ask for a code from an authenticator app each time you sign in."
      >
        {verified.length > 0 ? (
          <div className="grid gap-5">
            <p>On. Your account asks for a code at sign-in.</p>
            {verified.map((factor) => (
              <form
                key={factor.id}
                action={removeTotpFactor}
                className="flex flex-wrap items-center gap-4"
              >
                <input type="hidden" name="factorId" value={factor.id} />
                <span className="text-sm text-ink-muted">
                  {factor.friendly_name ?? "Authenticator app"}
                </span>
                <button
                  type="submit"
                  className="min-h-11 text-meta text-danger underline underline-offset-4"
                >
                  Turn off
                </button>
              </form>
            ))}
          </div>
        ) : (
          <TotpSetup />
        )}
      </Section>
    </div>
  );
}
