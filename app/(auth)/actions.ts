"use server";

import { redirect } from "next/navigation";
import { audit } from "@/lib/audit";
import { safeNextPath } from "@/lib/auth/redirects";
import { publicEnv } from "@/lib/env";
import { clientIp, rateLimit } from "@/lib/ratelimit";
import { createClient } from "@/lib/supabase/server";
import {
  fieldErrors,
  forgotPasswordSchema,
  newPasswordSchema,
  signInSchema,
  totpCodeSchema,
} from "@/lib/validation/auth";

export type FormState = {
  errors?: Record<string, string>;
  message?: string;
  ok?: boolean;
  email?: string;
};

const TOO_MANY = "Too many attempts. Wait a few minutes and try again.";

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  const email = String(formData.get("email") ?? "");
  if (!parsed.success) return { errors: fieldErrors(parsed.error), email };

  const ip = await clientIp();
  const allowed =
    (await rateLimit("sign-in:ip", [ip], 20, 15 * 60)) &&
    (await rateLimit("sign-in:email", [parsed.data.email], 8, 15 * 60));
  if (!allowed) return { message: TOO_MANY, email };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    if (error.code === "email_not_confirmed") {
      return { message: "Confirm your email first — check your inbox for the link.", email };
    }
    return { message: "That email and password don't match.", email };
  }

  const next = safeNextPath(parsed.data.next);
  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal?.nextLevel === "aal2" && aal.currentLevel !== "aal2") {
    redirect(`/login/mfa?next=${encodeURIComponent(next)}`);
  }

  await audit(supabase, "auth.sign_in", "user");
  redirect(next);
}

export async function verifyMfa(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = totpCodeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const allowed = await rateLimit("mfa", [user.id], 10, 15 * 60);
  if (!allowed) return { message: TOO_MANY };

  const { error } = await supabase.auth.mfa.challengeAndVerify({
    factorId: parsed.data.factorId,
    code: parsed.data.code,
  });
  if (error)
    return {
      errors: { code: "That code didn't work. Check the time on your device and try again." },
    };

  await audit(supabase, "auth.sign_in", "user", undefined, { mfa: true });
  redirect(safeNextPath(parsed.data.next));
}

export async function requestPasswordReset(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = forgotPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const ip = await clientIp();
  const allowed =
    (await rateLimit("reset:ip", [ip], 10, 60 * 60)) &&
    (await rateLimit("reset:email", [parsed.data.email], 3, 60 * 60));
  if (!allowed) return { message: TOO_MANY };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${publicEnv.NEXT_PUBLIC_SITE_URL}/reset-password`,
  });
  // Unknown addresses get the same answer, so the form can't be used to find accounts.
  if (error && error.status !== 400 && error.status !== 404 && error.status !== 422) {
    return { message: "We couldn't send the email just now. Try again in a few minutes." };
  }
  return { ok: true, email: parsed.data.email };
}

export async function updatePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = newPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { message: "Your reset link has expired. Request a new one to continue." };
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    switch (error.code) {
      case "same_password":
        return { errors: { password: "Choose a password you haven't used here before." } };
      case "weak_password":
        return { errors: { password: "That password is too easy to guess. Try a longer one." } };
      case "reauthentication_needed":
        return { message: "For your security, sign in again before changing your password." };
      default:
        return { message: "We couldn't update your password. Try again." };
    }
  }

  await audit(supabase, "auth.password_changed", "user", user.id);
  if (formData.get("stay") === "1") return { ok: true };
  redirect("/admin");
}
