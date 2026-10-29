"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Field, FormMessage, SubmitButton } from "@/components/forms/fields";
import { PASSWORD_RULES } from "@/lib/validation/auth";
import {
  requestPasswordReset,
  signIn,
  updatePassword,
  verifyMfa,
  type FormState,
} from "../actions";

export function LoginForm({ next, notice }: { next: string; notice?: string }) {
  const [state, action] = useActionState<FormState, FormData>(signIn, {});
  return (
    <form action={action} className="grid gap-8" noValidate>
      <input type="hidden" name="next" value={next} />
      {notice && !state.message && <FormMessage tone="success">{notice}</FormMessage>}
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        defaultValue={state.email}
        error={state.errors?.email}
      />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        error={state.errors?.password}
      />
      <FormMessage>{state.message}</FormMessage>
      <div className="flex flex-wrap items-center justify-between gap-6">
        <SubmitButton pendingLabel="Signing in…">Sign in</SubmitButton>
        <Link
          href="/forgot-password"
          className="text-sm underline decoration-rule underline-offset-4 hover:decoration-pine"
        >
          Forgot your password?
        </Link>
      </div>
    </form>
  );
}

export function MfaForm({ factorId, next }: { factorId: string; next: string }) {
  const [state, action] = useActionState<FormState, FormData>(verifyMfa, {});
  return (
    <form action={action} className="grid gap-8" noValidate>
      <input type="hidden" name="factorId" value={factorId} />
      <input type="hidden" name="next" value={next} />
      <Field
        label="Authentication code"
        name="code"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="\d{6}"
        maxLength={6}
        required
        autoFocus
        error={state.errors?.code}
      />
      <FormMessage>{state.message}</FormMessage>
      <SubmitButton pendingLabel="Checking…" className="w-fit">
        Verify
      </SubmitButton>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, action] = useActionState<FormState, FormData>(requestPasswordReset, {});
  if (state.ok) {
    return (
      <FormMessage tone="success">
        If {state.email} has an account, a reset link is on its way. It works once and expires in an
        hour.
      </FormMessage>
    );
  }
  return (
    <form action={action} className="grid gap-8" noValidate>
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        error={state.errors?.email}
      />
      <FormMessage>{state.message}</FormMessage>
      <div className="flex flex-wrap items-center justify-between gap-6">
        <SubmitButton pendingLabel="Sending…">Send reset link</SubmitButton>
        <Link
          href="/login"
          className="text-sm underline decoration-rule underline-offset-4 hover:decoration-pine"
        >
          Back to sign in
        </Link>
      </div>
    </form>
  );
}

export function NewPasswordForm({
  stay = false,
  submitLabel = "Save password",
}: {
  stay?: boolean;
  submitLabel?: string;
}) {
  const [state, action] = useActionState<FormState, FormData>(updatePassword, {});
  return (
    <form action={action} className="grid gap-8" noValidate>
      {stay && <input type="hidden" name="stay" value="1" />}
      <Field
        label="New password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        hint={PASSWORD_RULES}
        error={state.errors?.password}
      />
      <Field
        label="Repeat new password"
        name="confirm"
        type="password"
        autoComplete="new-password"
        required
        error={state.errors?.confirm}
      />
      <FormMessage>{state.message}</FormMessage>
      {state.ok && <FormMessage tone="success">Password updated.</FormMessage>}
      <SubmitButton pendingLabel="Saving…" className="w-fit">
        {submitLabel}
      </SubmitButton>
    </form>
  );
}
