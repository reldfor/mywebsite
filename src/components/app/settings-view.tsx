"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { SignInForm } from "@/features/auth/sign-in-form";
import { SignUpForm } from "@/features/auth/sign-up-form";

const sections = [
  {
    heading: "Account",
    rows: [
      {
        label: "Sign in or create an account",
        detail: "Unlimited tasks, synced across devices.",
      },
    ],
  },
  {
    heading: "Data",
    rows: [
      {
        label: "Export tasks",
        detail: "Download your tasks, labels, and subtasks.",
      },
      {
        label: "Delete workspace",
        detail: "Removes everything, including your account.",
        danger: true,
      },
    ],
  },
] as const;

function AuthOverlay({
  mode,
  onClose,
  onSwitch,
}: {
  mode: "signUp" | "signIn";
  onClose: () => void;
  onSwitch: (mode: "signUp" | "signIn") => void;
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

export default function SettingsPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signUp" | "signIn">("signUp");

  function openAuth(mode: "signUp" | "signIn") {
    setAuthMode(mode);
    setAuthOpen(true);
  }

  return (
    <div className="mx-auto w-full max-w-[640px] px-4 py-6 sm:px-6 sm:py-8">
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em]">Settings</h1>
        <p className="mt-1 font-mono text-[11px] tabular-nums text-ink-faint">
          Preview · connects when accounts arrive
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-6">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="px-2 text-[11px] font-medium uppercase tracking-[0.08em] text-ink-faint">
              {section.heading}
            </h2>
            <ul className="mt-2 divide-y divide-line/60 overflow-hidden rounded-xl border border-line bg-surface">
              {section.rows.map((row) => (
                <li
                  key={row.label}
                  className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-5"
                >
                  <div className="min-w-0">
                    <p
                      className={`text-[13px] font-medium ${
                        "danger" in row && row.danger ? "text-ink" : "text-ink"
                      }`}
                    >
                      {row.label}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">
                      {row.detail}
                    </p>
                  </div>
                  {section.heading === "Account" ? (
                    <button
                      type="button"
                      onClick={() => openAuth("signUp")}
                      className="shrink-0 rounded-full border border-line bg-paper px-3.5 py-1.5 text-xs font-medium text-ink transition-colors hover:border-ink/15"
                    >
                      Create an account
                    </button>
                  ) : (
                    <span className="shrink-0 rounded-full border border-dashed border-line px-3 py-1.5 font-mono text-[10px] tabular-nums uppercase tracking-wide text-ink-faint">
                      Soon
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {authOpen ? (
        <AuthOverlay
          mode={authMode}
          onClose={() => setAuthOpen(false)}
          onSwitch={setAuthMode}
        />
      ) : null}
    </div>
  );
}
