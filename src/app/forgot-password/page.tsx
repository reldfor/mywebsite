import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset your password — Tick",
  description:
    "Reset your Tick account password with a verification code sent to your email.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Forgot password"
      title="Reset your password"
      description="We'll send you a code to verify it's you, then you can set a new password."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
