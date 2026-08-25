"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import {
  AuthOverlay,
  type AuthOverlayMode,
} from "@/components/auth/auth-overlay";
import { useTheme } from "@/features/theme/theme-provider";

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
  const { theme, toggleTheme } = useTheme();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthOverlayMode>("signUp");

  function openAuth(mode: AuthOverlayMode) {
    setAuthMode(mode);
    setAuthOpen(true);
  }

  return (
    <div className="mx-auto w-full max-w-[640px] px-4 py-6 sm:px-6 sm:py-8">
      <div className="border-b border-lp-rule pb-4">
        <h1 className="text-[20px] font-medium tracking-[-0.015em] text-lp-ink">Settings</h1>
        <p className="mt-1 font-mono text-[11px] tabular-nums text-lp-ink-3">
          Preview · connects when accounts arrive
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-6">
        <section>
          <h2 className="px-2 font-mono text-[9px] font-medium uppercase tracking-[0.06em] text-lp-ink-3">
            Appearance
          </h2>
          <ul className="mt-2 overflow-hidden rounded-xl border border-lp-rule bg-lp-paper-2 shadow-[var(--lp-shadow-card)]">
            <li className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-5">
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-lp-ink">Theme</p>
                <p className="mt-0.5 text-xs leading-relaxed text-lp-ink-2">
                  {theme === "dark" ? "Dark — easy on the eyes at night." : "Light — clean and focused by day."}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <div className="flex rounded-full border border-lp-rule bg-lp-paper p-0.5 shadow-[var(--lp-shadow-interactive)]">
                  <button
                    type="button"
                    onClick={() => {
                      if (theme !== "light") toggleTheme();
                    }}
                    aria-pressed={theme === "light"}
                    aria-label="Use light theme"
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium tracking-[-0.01em] transition-colors ${
                      theme === "light"
                        ? "bg-lp-ink text-lp-paper shadow-sm"
                        : "text-lp-ink-2 hover:text-lp-ink"
                    }`}
                  >
                    <Sun aria-hidden="true" className="h-3.5 w-3.5" />
                    Light
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (theme !== "dark") toggleTheme();
                    }}
                    aria-pressed={theme === "dark"}
                    aria-label="Use dark theme"
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium tracking-[-0.01em] transition-colors ${
                      theme === "dark"
                        ? "bg-lp-ink text-lp-paper shadow-sm"
                        : "text-lp-ink-2 hover:text-lp-ink"
                    }`}
                  >
                    <Moon aria-hidden="true" className="h-3.5 w-3.5" />
                    Dark
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </section>

        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="px-2 font-mono text-[9px] font-medium uppercase tracking-[0.06em] text-lp-ink-3">
              {section.heading}
            </h2>
            <ul className="mt-2 divide-y divide-lp-rule/60 overflow-hidden rounded-xl border border-lp-rule bg-lp-paper-2 shadow-[var(--lp-shadow-card)]">
              {section.rows.map((row) => (
                <li
                  key={row.label}
                  className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-5"
                >
                  <div className="min-w-0">
                    <p
                      className={`text-[13px] font-medium ${
                        "danger" in row && row.danger ? "text-lp-accent" : "text-lp-ink"
                      }`}
                    >
                      {row.label}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-lp-ink-2">
                      {row.detail}
                    </p>
                  </div>
                  {section.heading === "Account" ? (
                    <button
                      type="button"
                      onClick={() => openAuth("signUp")}
                      className="shrink-0 rounded-full border border-lp-rule bg-lp-paper px-3.5 py-1.5 text-xs font-medium tracking-[-0.01em] text-lp-ink shadow-[var(--lp-shadow-interactive)] transition-colors hover:border-[color-mix(in_srgb,var(--lp-ink)_20%,transparent)] hover:bg-lp-paper-2"
                    >
                      Create an account
                    </button>
                  ) : (
                    <span className="shrink-0 rounded-full border border-dashed border-lp-rule px-3 py-1.5 font-mono text-[10px] tabular-nums uppercase tracking-wide text-lp-ink-3">
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
