"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { AuthField } from "@/components/auth/auth-field";
import {
  GoogleButton,
  OrDivider,
  SubmitButton,
} from "@/components/auth/auth-actions";
import { authLinks } from "@/lib/constants";

type Errors = {
  email?: string;
  password?: string;
  confirm?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;

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

    setStatus("loading");
    window.setTimeout(() => setStatus("done"), 1400);
  }

  const loading = status === "loading";

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
          }}
          error={errors.confirm}
          autoComplete="new-password"
          disabled={loading}
          inputRef={confirmRef}
        />
      </div>

      <div className="mt-6">
        <SubmitButton loading={loading} loadingLabel="Creating account…">
          Create account
        </SubmitButton>
      </div>

      {status === "done" ? (
        <p
          aria-live="polite"
          className="mt-4 flex items-start gap-2 rounded-xl border border-pen/30 bg-pen-soft px-3.5 py-2.5 font-mono text-xs leading-relaxed text-pen"
        >
          <Check aria-hidden="true" className="mt-px h-3.5 w-3.5 shrink-0" strokeWidth={3} />
          Preview build — accounts connect when authentication is added.
        </p>
      ) : null}

      <div className="mt-6">
        <OrDivider />
      </div>

      <div className="mt-4">
        <GoogleButton />
      </div>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Already have an account?{" "}
        <Link
          href={authLinks.signIn}
          className="font-semibold text-pen transition-colors hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
