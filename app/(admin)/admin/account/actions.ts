"use server";

import { refresh } from "next/cache";
import { audit } from "@/lib/audit";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { displayNameSchema, fieldErrors, totpCodeSchema } from "@/lib/validation/auth";

export type AccountState = { errors?: Record<string, string>; message?: string; ok?: boolean };

export async function updateDisplayName(
  _prev: AccountState,
  formData: FormData,
): Promise<AccountState> {
  const user = await requireRole("editor", "/admin/account");
  const parsed = displayNameSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ display_name: parsed.data.displayName })
    .eq("id", user.id);
  if (error) return { message: "We couldn't save your name. Try again." };

  await audit(supabase, "profile.updated", "profile", user.id);
  refresh();
  return { ok: true };
}

export type Enrollment = { factorId: string; qrCode: string; secret: string } | { error: string };

export async function startTotpEnrollment(): Promise<Enrollment> {
  await requireRole("editor", "/admin/account");
  const supabase = await createClient();

  // Clear any half-finished setup so the new QR code is the only pending one.
  const { data: factors } = await supabase.auth.mfa.listFactors();
  for (const factor of factors?.all ?? []) {
    if (factor.factor_type === "totp" && factor.status === "unverified") {
      await supabase.auth.mfa.unenroll({ factorId: factor.id });
    }
  }

  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
    friendlyName: `Authenticator ${new Date().toISOString().slice(0, 16)}`,
  });
  if (error || !data) return { error: "We couldn't start setup. Try again." };
  return { factorId: data.id, qrCode: data.totp.qr_code, secret: data.totp.secret };
}

export async function confirmTotpEnrollment(
  _prev: AccountState,
  formData: FormData,
): Promise<AccountState> {
  const user = await requireRole("editor", "/admin/account");
  const parsed = totpCodeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase.auth.mfa.challengeAndVerify({
    factorId: parsed.data.factorId,
    code: parsed.data.code,
  });
  if (error)
    return {
      errors: { code: "That code didn't work. Check the time on your device and try again." },
    };

  await audit(supabase, "auth.mfa_enrolled", "user", user.id);
  refresh();
  return { ok: true };
}

export async function removeTotpFactor(formData: FormData): Promise<void> {
  // requireRole already insists on a verified second factor for this session.
  const user = await requireRole("editor", "/admin/account");
  const factorId = String(formData.get("factorId") ?? "");
  const supabase = await createClient();
  const { error } = await supabase.auth.mfa.unenroll({ factorId });
  if (!error) await audit(supabase, "auth.mfa_removed", "user", user.id);
  refresh();
}
