import { ArrowRight } from "lucide-react";
import { ProductMock } from "@/components/landing/product-mock";
import { Button } from "@/components/ui/button";
import { authLinks, container } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-14 pt-10 sm:pt-14 lg:pb-20 lg:pt-20">
      <div aria-hidden="true" className="ruled pointer-events-none absolute inset-0" />
      <div
        className={`${container} relative grid items-center gap-10 lg:grid-cols-12 lg:gap-10`}
      >
        <div className="lg:col-span-6">
          <p
            className="animate-tick-in inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[11px] font-medium tracking-[0.08em] text-ink-soft"
            style={{ animationDelay: "50ms" }}
          >
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ink/20" />
            No account required to start
          </p>
          <h1
            className="animate-tick-in mt-5 max-w-[560px] text-[32px] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-[40px] lg:text-[48px]"
            style={{ animationDelay: "110ms" }}
          >
            A simple workspace for everything you need to get done.
          </h1>
          <p
            className="animate-tick-in mt-4 max-w-[480px] text-[16px] leading-[1.6] text-ink-soft"
            style={{ animationDelay: "170ms" }}
          >
            Tick works the way a paper list does — only faster. Capture tasks in
            seconds, set priorities, and keep everything organized without any
            setup.
          </p>
          <div
            className="animate-tick-in mt-7 flex flex-col gap-2.5 sm:flex-row sm:items-center"
            style={{ animationDelay: "230ms" }}
          >
            <Button href={authLinks.guestWorkspace} size="lg">
              Start for free
            </Button>
            <Button href={authLinks.signUp} size="lg" variant="secondary">
              Create an account
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Button>
          </div>
          <p
            className="animate-tick-in mt-5 text-xs leading-relaxed text-ink-faint"
            style={{ animationDelay: "290ms" }}
          >
            Guest tasks carry over when you sign up — nothing is lost.
          </p>
        </div>

        <div className="lg:col-span-6 lg:pl-4">
          <ProductMock />
        </div>
      </div>
    </section>
  );
}
