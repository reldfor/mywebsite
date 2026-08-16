import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/landing/reveal";
import { authLinks, container } from "@/lib/constants";

export function FinalCta() {
  return (
    <section id="start" className="relative overflow-hidden scroll-mt-20 py-24 lg:py-32">
      <div aria-hidden="true" className="ruled pointer-events-none absolute inset-0" />
      <div className={`${container} relative text-center`}>
        <Reveal>
          <h2 className="mx-auto max-w-2xl font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            Ready to get organized?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            Your first task takes ten seconds. The next nine are free too — and
            they&apos;ll still be there on any device when you sign in.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-7 font-mono text-xs text-ink-faint">
            Guest: up to 10 tasks · Account: unlimited
          </p>
        </Reveal>
      </div>
    </section>
  );
}
