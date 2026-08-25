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
      </div>
    </section>
  );
}
