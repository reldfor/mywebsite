"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
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
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    }
    document.addEventListener("keydown", onKeyDown, true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-lp-ink/20 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={mode === "signUp" ? "Create your account" : "Sign in"}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-[420px] overflow-auto rounded-xl border border-lp-rule bg-lp-paper-2 shadow-[var(--lp-shadow-card)] animate-pop-in"
      >
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-lp-rule bg-lp-paper-2 px-6 pt-6 pb-4">
          <div>
            <h2 className="text-[18px] font-medium tracking-[-0.02em] text-lp-ink">
              {mode === "signUp" ? "Create your account" : "Welcome back"}
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-lp-ink-2">
              {mode === "signUp"
                ? "Free forever. Unlimited tasks on every device."
                : "Your tasks are waiting — pick up where you left off."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-lp-rule bg-lp-paper text-lp-ink-3 transition-colors hover:border-[color-mix(in_srgb,var(--lp-ink)_20%,transparent)] hover:text-lp-ink"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          {mode === "signUp" ? (
            <SignUpForm onSwitchToSignIn={() => onSwitch("signIn")} />
          ) : (
            <SignInForm onSwitchToSignUp={() => onSwitch("signUp")} />
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
