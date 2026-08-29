import type { Metadata } from "next";
import { AuthShell } from "@/modules/auth/components/auth-shell";
import { SignUpForm } from "@/modules/auth/sign-up-form";

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
