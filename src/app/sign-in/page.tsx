import type { Metadata } from "next";
import { AuthShell } from "@/modules/auth/components/auth-shell";
import { SignInForm } from "@/modules/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in — Tick",
  description:
    "Welcome back. Sign in to Tick to get back to your tasks.",
};

export default function SignInPage() {
  return (
    <AuthShell
      eyebrow="Sign in"
      title="Welcome back"
      description="Your tasks are waiting — pick up where you left off."
    >
      <SignInForm />
    </AuthShell>
  );
}
