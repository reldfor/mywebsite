"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { AuthField } from "@/components/auth/auth-field";
import { SubmitButton } from "@/components/auth/auth-actions";
import {
  clerkErrorToMessage,
  clerkErrorsMessage,
} from "@/features/auth/errors";
import { authLinks } from "@/lib/constants";

type Errors = {
  email?: string;
  password?: string;
  confirm?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordForm() {
  const { signIn, errors: clerkErrors } = useSignIn();
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [stage, setStage] = useState<"email" | "code" | "new-password">("email");
  const [errors, setErrors] = useState<Errors>({});
  const [clerkError, setClerkError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace(authLinks.guestWorkspace);
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    return () => {
      void signIn?.reset();
    };
  }, [signIn]);

  async function completeReset() {
    if (!signIn) return;
    setLoading(true);
    const { error } = await signIn.finalize({
      navigate: async ({ decorateUrl }) => {
        const url = decorateUrl(authLinks.guestWorkspace);
        if (url.startsWith("http")) {
          window.location.href = url;
        } else {
          router.push(url);
        }
      },
    });
    if (error) {
      setClerkError(
        clerkErrorToMessage(error) ?? "Password reset didn't complete. Please try again."
      );
      setLoading(false);
    }
  }

  async function sendResetCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signIn || loading) return;

    if (!email.trim()) {
      setErrors({ email: "Enter your email address." });
      emailRef.current?.focus();
      return;
    }
    if (!emailPattern.test(email.trim())) {
      setErrors({ email: "That doesn't look like a valid email address." });
      emailRef.current?.focus();
      return;
    }

    setLoading(true);
    setClerkError(null);

    const { error: createError } = await signIn.create({ identifier: email.trim() });
    if (createError) {
      const message = clerkErrorsMessage(clerkErrors, ["identifier"]);
      setClerkError(
        message ??
          "We couldn't find an account with that email address. Check it and try again."
      );
      setLoading(false);
      return;
    }

    const { error: sendError } = await signIn.resetPasswordEmailCode.sendCode();
    if (sendError) {
      setClerkError(
        clerkErrorToMessage(sendError) ??
          "We couldn't send the reset code. Please try again."
      );
      setLoading(false);
      return;
    }

    setStage("code");
    setLoading(false);
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signIn || loading) return;

    if (!code.trim()) {
      codeRef.current?.focus();
      return;
    }

    setLoading(true);
    setClerkError(null);

    const { error } = await signIn.resetPasswordEmailCode.verifyCode({ code: code.trim() });

    if (error) {
      const message = clerkErrorsMessage(clerkErrors, ["code"]);
      setClerkError(message ?? "That code isn't right — check it and try again.");
      setLoading(false);
      return;
    }

    if (signIn.status === "needs_new_password") {
      setStage("new-password");
    } else {
      setClerkError("That code doesn't look right — check it and try again.");
    }
    setLoading(false);
  }

  async function submitNewPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signIn || loading) return;

    const next: Errors = {};
    if (!password) {
      next.password = "Choose a new password.";
    } else if (password.length < 8) {
      next.password = "Passwords are at least 8 characters.";
    }
    if (!confirm) {
      next.confirm = "Type your password again.";
    } else if (confirm !== password) {
      next.confirm = "Passwords don't match — check them again.";
    }
    setErrors(next);
    if (next.password) {
      passwordRef.current?.focus();
      return;
    }
    if (next.confirm) {
      confirmRef.current?.focus();
      return;
    }

    setLoading(true);
    setClerkError(null);

    const { error } = await signIn.resetPasswordEmailCode.submitPassword({
      password,
      signOutOfOtherSessions: true,
    });

    if (error) {
      const message = clerkErrorsMessage(clerkErrors, ["password"]);
      setClerkError(
        message ??
          "We couldn't update your password. Check the requirements and try again."
      );
      setLoading(false);
      return;
    }

    if (signIn.status === "complete") {
      await completeReset();
      return;
    }

    setClerkError("Password reset didn't complete. Please try again.");
    setLoading(false);
  }

  async function resendCode() {
    if (!signIn || resending) return;
    setResending(true);
    setResent(false);
    setClerkError(null);
    const { error } = await signIn.resetPasswordEmailCode.sendCode();
    if (error) {
      setClerkError(
        clerkErrorToMessage(error) ??
          "We couldn't send a new code. Please try again in a moment."
      );
      setResending(false);
      return;
    }
    setResent(true);
    setResending(false);
  }

  if (stage === "code") {
    return (
      <form onSubmit={verifyCode} noValidate>
        <p className="text-[13px] leading-relaxed text-lp-ink-2">
          We sent a password reset code to{" "}
          <span className="font-semibold text-lp-ink">{email.trim()}</span>. Enter it
          below to choose a new password.
        </p>

        <div className="mt-6">
          <AuthField
            id="code"
            label="Reset code"
            type="text"
            value={code}
            onChange={(value) => {
              setCode(value);
              setClerkError(null);
            }}
            autoComplete="one-time-code"
            inputMode="numeric"
            placeholder="6-digit code"
            disabled={loading}
            inputRef={codeRef}
          />
        </div>

        {clerkError ? (
          <p aria-live="polite" className="mt-4 text-sm text-lp-accent">
            {clerkError}
          </p>
        ) : null}

        <div className="mt-5">
          <SubmitButton loading={loading} loadingLabel="Verifying…">
            Verify code
          </SubmitButton>
        </div>

        <div className="mt-4 text-center">
          {resent ? (
            <p aria-live="polite" className="text-sm text-lp-ink-2">
              A new code is on its way.
            </p>
          ) : (
            <button
              type="button"
              onClick={resendCode}
              disabled={resending}
              className="rounded-md text-sm font-medium text-lp-ink transition-colors hover:underline disabled:opacity-60"
            >
              {resending ? "Sending…" : "Didn't receive it? Send a new code"}
            </button>
          )}
        </div>
      </form>
    );
  }

  if (stage === "new-password") {
    return (
      <form onSubmit={submitNewPassword} noValidate>
        <p className="text-[13px] leading-relaxed text-lp-ink-2">
          Almost there — choose a new password for your account.
        </p>

        <div className="mt-6">
          <AuthField
            id="password"
            label="New password"
            type="password"
            value={password}
            onChange={(value) => {
              setPassword(value);
              setErrors((e) => (e.password ? { ...e, password: undefined } : e));
              setClerkError(null);
            }}
            error={errors.password}
            hint="At least 8 characters"
            autoComplete="new-password"
            disabled={loading}
            inputRef={passwordRef}
          />
        </div>

        <div className="mt-6">
          <AuthField
            id="confirm"
            label="Confirm new password"
            type="password"
            value={confirm}
            onChange={(value) => {
              setConfirm(value);
              setErrors((e) => (e.confirm ? { ...e, confirm: undefined } : e));
              setClerkError(null);
            }}
            error={errors.confirm}
            autoComplete="new-password"
            disabled={loading}
            inputRef={confirmRef}
          />
        </div>

        {clerkError ? (
          <p aria-live="polite" className="mt-4 text-sm text-lp-accent">
            {clerkError}
          </p>
        ) : null}

        <div className="mt-6">
          <SubmitButton loading={loading} loadingLabel="Updating password…">
            Set new password
          </SubmitButton>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={sendResetCode} noValidate>
      <p className="text-[13px] leading-relaxed text-lp-ink-2">
        Enter the email address on your account and we&apos;ll send you a code
        to reset your password.
      </p>

      <div className="mt-6">
        <AuthField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(value) => {
            setEmail(value);
            setErrors((e) => (e.email ? { ...e, email: undefined } : e));
            setClerkError(null);
          }}
          error={errors.email}
          placeholder="you@example.com"
          autoComplete="email"
          disabled={loading}
          inputRef={emailRef}
        />
      </div>

      {clerkError ? (
        <p aria-live="polite" className="mt-4 text-sm text-lp-accent">
          {clerkError}
        </p>
      ) : null}

      <div className="mt-5">
        <SubmitButton loading={loading} loadingLabel="Sending code…">
          Send reset code
        </SubmitButton>
      </div>

      <p className="mt-6 text-center text-sm text-lp-ink-2">
        <Link
          href={authLinks.signIn}
          className="font-semibold text-lp-ink transition-colors hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
}

