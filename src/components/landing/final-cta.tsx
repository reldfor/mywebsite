import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/landing/reveal";
import { authLinks, container } from "@/lib/constants";

export function FinalCta() {
  return (
    <section id="start" className="relative overflow-hidden scroll-mt-20 py-16 lg:py-24">
      <div aria-hidden="true" className="ruled pointer-events-none absolute inset-0" />
      <div className={`${container} relative text-center`}>
        <Reveal>
          <h2 className="mx-auto max-w-[560px] text-[28px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[36px] lg:text-[40px]">
            Ready to get organized?
          </h2>
          <p className="mx-auto mt-3 max-w-[480px] text-[15px] leading-[1.6] text-ink-soft">
            Your first task takes ten seconds. The next nine are free too — and
            they&apos;ll still be there on any device when you sign in.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
            <Button href={authLinks.guestWorkspace} size="lg" className="w-full sm:w-auto">
              Start for free
            </Button>
            <Button
              href={authLinks.signUp}
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Create an account
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Button>
          </div>
          <p className="mt-5 font-mono text-xs tabular-nums text-ink-faint">
            Guest: up to 10 tasks · Account: unlimited
          </p>
        </Reveal>
      </div>
    </section>
  );
}
