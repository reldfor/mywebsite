"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { SignInForm } from "@/features/auth/sign-in-form";
import { SignUpForm } from "@/features/auth/sign-up-form";

export type AuthOverlayMode = "signUp" | "signIn";

export function AuthOverlay({
  mode,
  onClose,
  onSwitch,
}: {
  mode: AuthOverlayMode;
  onClose: () => void;
  onSwitch: (mode: AuthOverlayMode) => void;
}) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={mode === "signUp" ? "Create your account" : "Sign in"}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-[420px] overflow-auto rounded-xl border border-line bg-surface shadow-[var(--shadow-pop)] animate-pop-in"
      >
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-line bg-surface px-6 pt-6 pb-4">
          <div>
            <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">
              {mode === "signUp" ? "Create your account" : "Welcome back"}
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
              {mode === "signUp"
                ? "Free forever. Unlimited tasks on every device."
                : "Your tasks are waiting — pick up where you left off."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line bg-paper text-ink-soft transition-colors hover:border-ink/15 hover:text-ink"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 pt-4">
          <div className="flex gap-1 rounded-full bg-surface-strong p-1">
            <button
              type="button"
              onClick={() => onSwitch("signUp")}
              className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                mode === "signUp"
                  ? "bg-surface text-ink shadow-sm border border-line"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              Create account
            </button>
            <button
              type="button"
              onClick={() => onSwitch("signIn")}
              className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                mode === "signIn"
                  ? "bg-surface text-ink shadow-sm border border-line"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              Sign in
            </button>
          </div>
        </div>

        <div className="p-6">
          {mode === "signUp" ? (
            <SignUpForm onSwitchToSignIn={() => onSwitch("signIn")} />
          ) : (
            <SignInForm onSwitchToSignUp={() => onSwitch("signUp")} />
          )}
        </div>
      </div>
    </div>
  );
}
