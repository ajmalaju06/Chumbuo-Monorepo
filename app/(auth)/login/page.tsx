import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { safeNextPath } from "@/lib/auth/redirects";
import { getAuthState } from "@/lib/auth/session";
import { SignOutButton } from "@/components/forms/SignOutButton";
import { AuthHeading, FormFallback } from "../_components/AuthHeading";
import { LoginForm } from "../_components/forms";

export const metadata: Metadata = { title: "Sign in" };

const NOTICES: Record<string, string> = {
  "link-expired": "That link has expired or was already used. Request a new one below.",
  "signed-out": "You're signed out.",
};

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <>
      <AuthHeading title="Sign in">Write, edit and publish your stories.</AuthHeading>
      <Suspense fallback={<FormFallback />}>
        <LoginGate searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function LoginGate({ searchParams }: Pick<PageProps<"/login">, "searchParams">) {
  const params = await searchParams;
  const next = safeNextPath(params.next);
  const state = await getAuthState();

  if (state.status === "needs-mfa") redirect(`/login/mfa?next=${encodeURIComponent(next)}`);
  if (state.status === "signed-in") {
    if (state.user.role) redirect(next);
    return <NoAccess email={state.user.email} />;
  }

  const notice = typeof params.error === "string" ? NOTICES[params.error] : undefined;
  return <LoginForm next={next} notice={notice} />;
}

function NoAccess({ email }: { email: string }) {
  return (
    <div className="grid gap-6">
      <p role="alert">
        {email} is signed in but doesn&apos;t have access to the dashboard. Ask the site admin to
        grant you a role, or sign in with a different account.
      </p>
      <SignOutButton className="w-fit rounded-full border border-current px-7 hover:bg-pine hover:text-oatmeal hover:no-underline" />
    </div>
  );
}
