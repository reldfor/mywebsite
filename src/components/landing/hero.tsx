import Link from "next/link";
import { AppMockup } from "@/components/landing/app-mockup";
import { authLinks, container } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-14 pb-16 md:pt-[88px] md:pb-24">
      <div aria-hidden="true" className="tl-grid-overlay" />
      <div className={`${container} relative`}>
        <div className="grid items-center gap-14 md:grid-cols-[7fr_5fr] md:gap-[72px]">
          <div>
            <p className="mb-7 font-mono text-xs text-lp-ink-3">
              <span className="text-lp-accent">{"//"}</span> a todo list you&apos;ll actually use
            </p>
            <h1 className="text-[clamp(44px,6.2vw,78px)] leading-[1.02] font-medium tracking-[-0.035em] text-lp-ink">
              Your tasks,
              <br />
              not your <span className="tl-strike">taskmaster.</span>
            </h1>
            <p className="mt-7 max-w-[540px] text-[17.5px] leading-[1.55] text-lp-ink-2">
              Tick is a quiet, keyboard-first todo list that lives in your browser.
              Open it, type, check things off — no account, no setup, ten tasks free
              forever.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={authLinks.guestWorkspace} className="btn-primary btn-lg">
                Open the app <span aria-hidden="true">→</span>
              </Link>
              <Link href="#features" className="btn-ghost btn-lg">
                See how it works <span aria-hidden="true">↓</span>
              </Link>
            </div>
            <p className="mt-[22px] flex flex-wrap items-center gap-2 font-mono text-xs text-lp-ink-3">
              No account needed
              <span className="text-lp-ink-4">·</span>
              10 tasks free
              <span className="text-lp-ink-4">·</span>
              Pro is free at launch
            </p>
          </div>

          <AppMockup />
        </div>
      </div>
    </section>
  );
}
