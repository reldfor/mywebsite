"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, useSignUp } from "@clerk/react";
import { AuthField } from "@/components/auth/auth-field";
import {
  GoogleButton,
  OrDivider,
  SubmitButton,
} from "@/components/auth/auth-actions";
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

export function SignUpForm({ onSwitchToSignIn }: { onSwitchToSignIn?: () => void }) {
  const { signUp, errors: clerkErrors } = useSignUp();
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [clerkError, setClerkError] = useState<string | null>(null);
  const [stage, setStage] = useState<"form" | "verify">("form");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace(authLinks.guestWorkspace);
    }
  }, [isLoaded, isSignedIn, router]);

  function validate(): Errors {
    const next: Errors = {};
    if (!email.trim()) {
      next.email = "Enter your email address.";
    } else if (!emailPattern.test(email.trim())) {
      next.email = "That doesn't look like a valid email address.";
    }
    if (!password) {
      next.password = "Choose a password.";
    } else if (password.length < 8) {
      next.password = "Passwords are at least 8 characters.";
    }
    if (!confirm) {
      next.confirm = "Type your password again.";
    } else if (confirm !== password) {
      next.confirm = "Passwords don't match — check them again.";
    }
    return next;
  }

  async function completeSignUp() {
    if (!signUp) return;
    setLoading(true);
    const { error } = await signUp.finalize({
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
        clerkErrorToMessage(error) ?? "We couldn't finish creating your account. Please try again."
      );
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signUp || loading) return;

    const next = validate();
    setErrors(next);
    if (next.email) {
      emailRef.current?.focus();
      return;
    }
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

    const { error } = await signUp.password({
      emailAddress: email.trim(),
      password,
    });

    if (error) {
      const message = clerkErrorsMessage(clerkErrors, ["emailAddress", "password"]);
      setClerkError(
        message ??
          "We couldn't create your account. Check the details and try again."
      );
      setLoading(false);
      return;
    }

    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) {
      setClerkError(
        clerkErrorToMessage(sendError) ??
          "We couldn't send the verification email. Please try again."
      );
      setLoading(false);
      return;
    }

    setStage("verify");
    setLoading(false);
  }

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signUp || loading) return;

    if (!code.trim()) {
      codeRef.current?.focus();
      return;
    }

    setLoading(true);
    setClerkError(null);

    const { error } = await signUp.verifications.verifyEmailCode({ code: code.trim() });

    if (error) {
      const message = clerkErrorsMessage(clerkErrors, ["code", "emailAddress"]);
      setClerkError(message ?? "That code isn't right — check it and try again.");
      setLoading(false);
      return;
    }

    if (signUp.status === "complete") {
      await completeSignUp();
      return;
    }

    setClerkError("Verification didn't complete. Please try again.");
    setLoading(false);
  }

  async function resendCode() {
    if (!signUp || resending) return;
    setResending(true);
    setResent(false);
    setClerkError(null);
    const { error } = await signUp.verifications.sendEmailCode();
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

  if (stage === "verify") {
    return (
      <form onSubmit={handleVerify} noValidate>
        <p className="text-sm leading-relaxed text-ink-soft">
          We sent a verification code to{" "}
          <span className="font-semibold text-ink">{email.trim()}</span>. Enter it
          below to verify your email and create your account.
        </p>

        <div className="mt-6">
          <AuthField
            id="code"
            label="Verification code"
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
          <p aria-live="polite" className="mt-4 text-sm text-ink">
            {clerkError}
          </p>
        ) : null}

        <div className="mt-5">
          <SubmitButton loading={loading} loadingLabel="Verifying…">
            Verify email
          </SubmitButton>
        </div>

        <div className="mt-4 text-center">
          {resent ? (
            <p aria-live="polite" className="text-sm text-ink-soft">
              A new code is on its way.
            </p>
          ) : (
            <button
              type="button"
              onClick={resendCode}
              disabled={resending}
              className="rounded-md text-sm font-medium text-ink transition-colors hover:underline disabled:opacity-60"
            >
              {resending ? "Sending…" : "Didn't receive it? Send a new code"}
            </button>
          )}
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
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

      <div className="mt-6">
        <AuthField
          id="password"
          label="Password"
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
          label="Confirm password"
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
        <p aria-live="polite" className="mt-4 text-sm text-ink">
          {clerkError}
        </p>
      ) : null}

      <div className="mt-6">
        <SubmitButton loading={loading} loadingLabel="Creating account…">
          Create account
        </SubmitButton>
      </div>

      <div className="mt-6">
        <OrDivider />
      </div>

      <div className="mt-4">
        <GoogleButton />
      </div>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Already have an account?{" "}
        {onSwitchToSignIn ? (
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="font-semibold text-ink transition-colors hover:underline"
          >
            Sign in
          </button>
        ) : (
          <Link
            href={authLinks.signIn}
            className="font-semibold text-ink transition-colors hover:underline"
          >
            Sign in
          </Link>
        )}
      </p>

      <div id="clerk-captcha" />
    </form>
  );
}

