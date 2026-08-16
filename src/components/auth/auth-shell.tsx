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
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <div
        aria-hidden="true"
        className="ruled pointer-events-none absolute inset-0 opacity-60"
      />

      <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col items-center px-5 pb-12 pt-10 sm:pt-14">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-faint transition-colors hover:text-ink"
        >
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
          Back to home
        </Link>

        <div className="mt-6">
          <Logo />
        </div>

        <div className="mt-7 w-full rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-pen">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {description}
          </p>
          <div className="mt-7">{children}</div>
        </div>
      </main>

      <footer className="relative pb-6">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-5 font-mono text-[11px] text-ink-faint">
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
