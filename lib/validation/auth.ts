import { z } from "zod";

// Normalise first: z.email() alone would reject pasted addresses with stray spaces.
const email = z
  .string()
  .trim()
  .toLowerCase()
  .max(254)
  .pipe(z.email({ error: "Enter a valid email address." }));

// Mirrors the auth server policy in supabase/config.toml so people see the
// rule before submitting rather than a generic "weak password" error.
export const PASSWORD_RULES =
  "At least 10 characters, with upper- and lowercase letters and a number.";

export const passwordSchema = z
  .string()
  .min(10, { error: "Use at least 10 characters." })
  .max(72, { error: "Use 72 characters or fewer." })
  .regex(/[a-z]/, { error: "Add a lowercase letter." })
  .regex(/[A-Z]/, { error: "Add an uppercase letter." })
  .regex(/\d/, { error: "Add a number." });

export const signInSchema = z.object({
  email,
  password: z.string().min(1, { error: "Enter your password." }).max(72),
  next: z.string().optional(),
});

export const forgotPasswordSchema = z.object({ email });

export const newPasswordSchema = z
  .object({
    password: passwordSchema,
    confirm: z.string(),
  })
  .refine((value) => value.password === value.confirm, {
    error: "The passwords don't match.",
    path: ["confirm"],
  });

export const totpCodeSchema = z.object({
  factorId: z.uuid(),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, { error: "Enter the 6-digit code from your authenticator app." }),
  next: z.string().optional(),
});

export const displayNameSchema = z.object({
  displayName: z.string().trim().min(1, { error: "Enter a name." }).max(120),
});

/** Flattens Zod issues to the first message per field, for inline form errors. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.message;
  }
  return errors;
}
