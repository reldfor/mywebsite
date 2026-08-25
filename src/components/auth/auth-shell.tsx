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
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-lp-paper">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--lp-grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--lp-grid-line) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.6), transparent 60%)",
          WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,0.6), transparent 60%)",
        }}
      />

      <main className="relative mx-auto flex w-full max-w-[420px] flex-1 flex-col items-center px-5 pb-12 pt-8 sm:pt-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-lp-ink-3 transition-colors hover:text-lp-ink"
        >
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
          Back to home
        </Link>

        <div className="mt-6">
          <Logo />
        </div>

        <div className="mt-6 w-full rounded-xl border border-lp-rule bg-lp-paper-2 p-6 shadow-[var(--lp-shadow-card)] sm:p-7">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-lp-accent">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-[22px] font-medium tracking-[-0.02em] text-lp-ink">
            {title}
          </h1>
          <p className="mt-1.5 text-[13px] leading-relaxed text-lp-ink-2">
            {description}
          </p>
          <div className="mt-6">{children}</div>
        </div>
      </main>

      <footer className="relative border-t border-lp-rule pb-6 pt-6">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-5 font-mono text-[11px] tabular-nums text-lp-ink-3">
          <span>© 2026 {appName}</span>
          <span aria-hidden="true">·</span>
          <Link href={authLinks.privacy} className="transition-colors hover:text-lp-accent">
            Privacy
          </Link>
          <Link href={authLinks.terms} className="transition-colors hover:text-lp-accent">
            Terms
          </Link>
          <Link href={authLinks.contact} className="transition-colors hover:text-lp-accent">
            Contact
          </Link>
        </div>
      </footer>
    </div>
  );
}
