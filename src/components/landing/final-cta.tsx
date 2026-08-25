import Link from "next/link";
import { authLinks, container } from "@/lib/constants";

export function FinalCta() {
  return (
    <section className="border-t border-lp-rule py-20 md:py-[120px]">
      <div className={`${container} text-center`}>
        <h2 className="text-[clamp(36px,4.5vw,52px)] leading-[1.05] font-medium tracking-[-0.03em] text-lp-ink">
          Start checking things off.
        </h2>
        <p className="mt-5 text-[17px] text-lp-ink-2">No account. No onboarding. Just open it.</p>
        <div className="mt-10">
          <Link href={authLinks.guestWorkspace} className="btn-primary btn-xl">
            Open the app <span aria-hidden="true">→</span>
          </Link>
        </div>
        <p className="mt-6 flex flex-wrap items-center justify-center gap-2 font-mono text-xs text-lp-ink-3">
          Free
          <span className="text-lp-ink-4">·</span>
          No account needed
          <span className="text-lp-ink-4">·</span>
          10 tasks
          <span className="text-lp-ink-4">·</span>
          Pro is free at launch
        </p>
      </div>
    </section>
  );
}
