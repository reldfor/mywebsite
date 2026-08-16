import { ArrowRight } from "lucide-react";
import { ProductMock } from "@/components/landing/product-mock";
import { Button } from "@/components/ui/button";
import { authLinks, container } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-14 sm:pt-20 lg:pb-24 lg:pt-28">
      <div aria-hidden="true" className="ruled pointer-events-none absolute inset-0" />
      <div
        className={`${container} relative grid items-center gap-14 lg:grid-cols-12 lg:gap-12`}
      >
        <div className="lg:col-span-6">
          <p
            className="animate-tick-in inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-pen"
            style={{ animationDelay: "50ms" }}
          >
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-pen" />
            No account required to start
          </p>
          <h1
            className="animate-tick-in mt-6 font-display text-[clamp(2.5rem,6vw,3.75rem)] font-extrabold leading-[1.05] tracking-[-0.03em]"
            style={{ animationDelay: "130ms" }}
          >
            A simple workspace for everything you need to get done.
          </h1>
          <p
            className="animate-tick-in mt-6 max-w-xl text-lg leading-relaxed text-ink-soft"
            style={{ animationDelay: "210ms" }}
          >
            Tick works the way a paper list does — only faster. Capture tasks in
            seconds, set priorities, and keep everything organized without any
            setup.
          </p>
          <div
            className="animate-tick-in mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: "290ms" }}
          >
            <Button href={authLinks.guestWorkspace} size="lg">
              Start for free
            </Button>
            <Button href={authLinks.signUp} size="lg" variant="secondary">
              Create an account
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Button>
          </div>
          <p
            className="animate-tick-in mt-6 font-mono text-xs text-ink-faint"
            style={{ animationDelay: "370ms" }}
          >
            Guest tasks carry over when you sign up — nothing is lost.
          </p>
        </div>

        <div className="lg:col-span-6">
          <ProductMock />
        </div>
      </div>
    </section>
  );
}
