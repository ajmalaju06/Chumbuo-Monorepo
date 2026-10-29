import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { safeNextPath } from "@/lib/auth/redirects";
import { getAuthState } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { AuthHeading, FormFallback } from "../../_components/AuthHeading";
import { MfaForm } from "../../_components/forms";

export const metadata: Metadata = { title: "Two-step verification" };

export default function MfaPage({ searchParams }: PageProps<"/login/mfa">) {
  return (
    <>
      <AuthHeading title="One more step">
        Enter the 6-digit code from your authenticator app.
      </AuthHeading>
      <Suspense fallback={<FormFallback />}>
        <MfaGate searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function MfaGate({ searchParams }: Pick<PageProps<"/login/mfa">, "searchParams">) {
  const next = safeNextPath((await searchParams).next);
  const state = await getAuthState();
  if (state.status === "signed-out") redirect(`/login?next=${encodeURIComponent(next)}`);
  if (state.status === "signed-in") redirect(next);

  const supabase = await createClient();
  const { data } = await supabase.auth.mfa.listFactors();
  const factor = data?.totp.find((f) => f.status === "verified");
  if (!factor) redirect(next);

  return <MfaForm factorId={factor.id} next={next} />;
}
