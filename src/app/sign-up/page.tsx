import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/features/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Create an account — Tick",
  description:
    "Create a free Tick account. Unlimited tasks synced across every device — your guest tasks come along.",
};

export default function SignUpPage() {
  return (
    <AuthShell
      eyebrow="Create account"
      title="Create your account"
      description="Free forever. Unlimited tasks on every device — and your guest tasks come along."
    >
      <SignUpForm />
    </AuthShell>
  );
}
