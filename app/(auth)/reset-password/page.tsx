import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getAuthState } from "@/lib/auth/session";
import { AuthHeading, FormFallback } from "../_components/AuthHeading";
import { NewPasswordForm } from "../_components/forms";

export const metadata: Metadata = { title: "Choose a new password" };

// Reached from the invite and recovery emails, which sign the person in first.
export default function ResetPasswordPage() {
  return (
    <>
      <AuthHeading title="Choose a password" />
      <Suspense fallback={<FormFallback />}>
        <ResetGate />
      </Suspense>
    </>
  );
}

async function ResetGate() {
  const state = await getAuthState();
  if (state.status === "needs-mfa") redirect("/login/mfa?next=/reset-password");
  if (state.status === "signed-out") {
    return (
      <div className="grid gap-6">
        <p role="alert">This link has expired or was already used.</p>
        <Link href="/forgot-password" className="w-fit underline underline-offset-4">
          Request a new reset link
        </Link>
      </div>
    );
  }
  return (
    <>
      <p className="-mt-6 mb-10 text-ink-muted">Signed in as {state.user.email}.</p>
      <NewPasswordForm />
    </>
  );
}
