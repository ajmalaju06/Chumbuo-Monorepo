"use client";

import { useActionState, useState, useTransition } from "react";
import { Field, FormMessage, SubmitButton } from "@/components/forms/fields";
import {
  confirmTotpEnrollment,
  startTotpEnrollment,
  updateDisplayName,
  type AccountState,
  type Enrollment,
} from "./actions";

export function DisplayNameForm({ defaultValue }: { defaultValue: string }) {
  const [state, action] = useActionState<AccountState, FormData>(updateDisplayName, {});
  return (
    <form action={action} className="grid gap-6" noValidate>
      <Field
        label="Display name"
        name="displayName"
        defaultValue={defaultValue}
        required
        error={state.errors?.displayName}
      />
      <FormMessage>{state.message}</FormMessage>
      {state.ok && <FormMessage tone="success">Name saved.</FormMessage>}
      <SubmitButton pendingLabel="Saving…" className="w-fit">
        Save name
      </SubmitButton>
    </form>
  );
}

export function TotpSetup() {
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [starting, startTransition] = useTransition();
  const [state, action] = useActionState<AccountState, FormData>(confirmTotpEnrollment, {});

  if (state.ok) {
    return (
      <FormMessage tone="success">
        Two-step verification is on. You&apos;ll be asked for a code next time you sign in.
      </FormMessage>
    );
  }

  if (!enrollment || "error" in enrollment) {
    return (
      <div className="grid gap-4">
        <p className="text-ink-muted">Off.</p>
        {enrollment && "error" in enrollment && <FormMessage>{enrollment.error}</FormMessage>}
        <button
          type="button"
          disabled={starting}
          onClick={() => startTransition(async () => setEnrollment(await startTotpEnrollment()))}
          className="inline-flex min-h-12 w-fit items-center rounded-full border border-current px-7 text-meta hover:bg-pine hover:text-oatmeal disabled:opacity-70"
        >
          {starting ? "Preparing…" : "Set up an authenticator app"}
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <p>Scan this code with your authenticator app, then enter the 6-digit code it shows.</p>
      {/* eslint-disable-next-line @next/next/no-img-element -- data: URL from the auth server */}
      <img
        src={enrollment.qrCode}
        alt="QR code for your authenticator app"
        width={176}
        height={176}
        className="bg-white p-2"
      />
      <p className="text-sm text-ink-muted">
        Can&apos;t scan? Enter this key instead:{" "}
        <code className="font-mono break-all text-pine select-all">{enrollment.secret}</code>
      </p>
      <form action={action} className="grid gap-6" noValidate>
        <input type="hidden" name="factorId" value={enrollment.factorId} />
        <Field
          label="Code from the app"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          required
          error={state.errors?.code}
        />
        <FormMessage>{state.message}</FormMessage>
        <SubmitButton pendingLabel="Checking…" className="w-fit">
          Turn on
        </SubmitButton>
      </form>
    </div>
  );
}
