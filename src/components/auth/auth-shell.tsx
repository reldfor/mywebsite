import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/landing/logo";
import { appName, authLinks } from "@/lib/constants";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthShell({ eyebrow, title, description, children }: AuthShellProps) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-paper">
      <div
        aria-hidden="true"
        className="ruled pointer-events-none absolute inset-0 opacity-40"
      />

      <main className="relative mx-auto flex w-full max-w-[420px] flex-1 flex-col items-center px-5 pb-12 pt-8 sm:pt-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-ink-faint transition-colors hover:text-ink"
        >
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
          Back to home
        </Link>

        <div className="mt-6">
          <Logo />
        </div>

        <div className="mt-6 w-full rounded-xl border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-7">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-[22px] font-semibold tracking-[-0.02em]">
            {title}
          </h1>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
            {description}
          </p>
          <div className="mt-6">{children}</div>
        </div>
      </main>

      <footer className="relative pb-6">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-5 font-mono text-[11px] tabular-nums text-ink-faint">
          <span>© 2026 {appName}</span>
          <span aria-hidden="true">·</span>
          <Link href={authLinks.privacy} className="transition-colors hover:text-ink">
            Privacy
          </Link>
          <Link href={authLinks.terms} className="transition-colors hover:text-ink">
            Terms
          </Link>
          <Link href={authLinks.contact} className="transition-colors hover:text-ink">
            Contact
          </Link>
        </div>
      </footer>
    </div>
  );
}
