import type { Metadata } from "next";
import { AuthHeading } from "../_components/AuthHeading";
import { ForgotPasswordForm } from "../_components/forms";

export const metadata: Metadata = { title: "Reset your password" };

export default function ForgotPasswordPage() {
  return (
    <>
      <AuthHeading title="Reset your password">
        Enter the email you sign in with and we&apos;ll send you a link to choose a new password.
      </AuthHeading>
      <ForgotPasswordForm />
    </>
  );
}
