import type { Metadata } from "next";
import Link from "next/link";
import { authLinks } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Settings — Tick",
  description: "Your account and workspace settings.",
};

const sections = [
  {
    heading: "Account",
    rows: [
      {
        label: "Sign in or create an account",
        detail: "Unlimited tasks, synced across devices.",
        link: authLinks.signUp,
        linkLabel: "Create an account",
      },
      {
        label: "Guest workspace",
        detail: "Up to 10 tasks, stored in this browser only.",
        link: authLinks.signIn,
        linkLabel: "Sign in",
      },
    ],
  },
  {
    heading: "Appearance",
    rows: [
      {
        label: "Theme",
        detail:
          "Dark and light follow your device. Switch anytime with the sun/moon button in the header.",
        chip: "Header control",
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
  return (
    <div className="mx-auto w-full max-w-[640px] px-4 py-6 sm:px-6 sm:py-8">
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em]">
          Settings
        </h1>
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
                  {"link" in row && row.link ? (
                    <Link
                      href={row.link}
                      className="shrink-0 rounded-full border border-line bg-paper px-3.5 py-1.5 text-xs font-medium text-ink transition-colors hover:border-ink/15"
                    >
                      {row.linkLabel}
                    </Link>
                  ) : "chip" in row && row.chip ? (
                    <span className="shrink-0 rounded-full border border-line bg-paper px-3 py-1.5 font-mono text-[10px] tabular-nums uppercase tracking-wide text-ink-soft">
                      {row.chip}
                    </span>
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
    </div>
  );
}
