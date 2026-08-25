"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, useSignIn } from "@clerk/react";
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
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignInForm({ onSwitchToSignUp }: { onSwitchToSignUp?: () => void }) {
  const { signIn, errors: clerkErrors } = useSignIn();
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [clerkError, setClerkError] = useState<string | null>(null);
  const [stage, setStage] = useState<"form" | "verify">("form");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
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
      next.password = "Enter your password.";
    } else if (password.length < 8) {
      next.password = "Passwords are at least 8 characters.";
    }
    return next;
  }

  async function completeSignIn() {
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
        clerkErrorToMessage(error) ?? "Sign-in didn't complete. Please try again."
      );
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signIn || loading) return;

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

    setLoading(true);
    setClerkError(null);

    const { error } = await signIn.password({
      emailAddress: email.trim(),
      password,
    });

    if (error) {
      const message = clerkErrorsMessage(clerkErrors, ["identifier", "password"]);
      setClerkError(message ?? "Incorrect email or password.");
      setLoading(false);
      return;
    }

    if (signIn.status === "complete") {
      await completeSignIn();
      return;
    }

    if (signIn.status === "needs_second_factor" || signIn.status === "needs_client_trust") {
      const emailFactor = signIn.supportedSecondFactors?.some(
        (factor) => factor.strategy === "email_code"
      );
      if (emailFactor) {
        const { error: sendError } = await signIn.mfa.sendEmailCode();
        if (sendError) {
          setClerkError(
            clerkErrorToMessage(sendError) ??
              "We couldn't send a verification code. Please try again."
          );
          setLoading(false);
          return;
        }
        setStage("verify");
        setLoading(false);
        return;
      }
      setClerkError(
        "This account requires additional verification that isn't supported yet. Try again later."
      );
      setLoading(false);
      return;
    }

    setClerkError("Sign-in didn't complete. Please try again.");
    setLoading(false);
  }

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signIn || loading) return;

    if (!code.trim()) {
      codeRef.current?.focus();
      return;
    }

    setLoading(true);
    setClerkError(null);

    const { error } = await signIn.mfa.verifyEmailCode({ code: code.trim() });

    if (error) {
      const message = clerkErrorsMessage(clerkErrors, ["code"]);
      setClerkError(message ?? "That code isn't right — check it and try again.");
      setLoading(false);
      return;
    }

    if (signIn.status === "complete") {
      await completeSignIn();
      return;
    }

    setClerkError("Verification didn't complete. Please try again.");
    setLoading(false);
  }

  async function resendCode() {
    if (!signIn || resending) return;
    setResending(true);
    setResent(false);
    setClerkError(null);
    const { error } = await signIn.mfa.sendEmailCode();
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

  const loadingLabel = stage === "verify" ? "Verifying…" : "Signing in…";

  if (stage === "verify") {
    return (
      <form onSubmit={handleVerify} noValidate>
        <p className="text-[13px] leading-relaxed text-lp-ink-2">
          We sent a verification code to{" "}
          <span className="font-semibold text-lp-ink">{email.trim()}</span>. Enter it
          below to finish signing in.
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
          <p aria-live="polite" className="mt-4 text-sm text-lp-accent">
            {clerkError}
          </p>
        ) : null}

        <div className="mt-5">
          <SubmitButton loading={loading} loadingLabel={loadingLabel}>
            Verify
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
          autoComplete="current-password"
          disabled={loading}
          inputRef={passwordRef}
        />
      </div>

      <div className="mt-3 flex justify-end">
        <Link
          href="/forgot-password"
          className="rounded-md text-sm font-medium text-lp-ink transition-colors hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      {clerkError ? (
        <p aria-live="polite" className="mt-4 text-sm text-lp-accent">
          {clerkError}
        </p>
      ) : null}

      <div className="mt-5">
        <SubmitButton loading={loading} loadingLabel={loadingLabel}>
          Sign in
        </SubmitButton>
      </div>

      <div className="mt-6">
        <OrDivider />
      </div>

      <div className="mt-4">
        <GoogleButton />
      </div>

      <p className="mt-6 text-center text-sm text-lp-ink-2">
        Don&apos;t have an account?{" "}
        {onSwitchToSignUp ? (
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="font-semibold text-lp-ink transition-colors hover:underline"
          >
            Sign up
          </button>
        ) : (
          <Link
            href={authLinks.signUp}
            className="font-semibold text-lp-ink transition-colors hover:underline"
          >
            Sign up
          </Link>
        )}
      </p>

      <div id="clerk-captcha" />
    </form>
  );
}

