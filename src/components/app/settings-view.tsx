"use client";

import { useState } from "react";
import {
  AuthOverlay,
  type AuthOverlayMode,
} from "@/components/auth/auth-overlay";

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

export default function SettingsPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthOverlayMode>("signUp");

  function openAuth(mode: AuthOverlayMode) {
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
