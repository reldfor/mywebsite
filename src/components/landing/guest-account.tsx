import { Check } from "lucide-react";
import { Reveal } from "@/components/landing/reveal";
import { SectionHeading } from "@/components/landing/section-heading";
import { Button } from "@/components/ui/button";
import { authLinks, container } from "@/lib/constants";

const guestItems = [
  "No account required",
  "Up to 10 tasks",
  "Stored in this browser",
  "Running in seconds",
];

const accountItems = [
  "Unlimited tasks",
  "Email/password or Google sign-in",
  "Synced across all your devices",
  "Export your data anytime",
];

export function GuestAccount() {
  return (
    <section
      id="compare"
      className="scroll-mt-20 border-t border-line bg-surface py-16 lg:py-24"
    >
      <div className={container}>
        <Reveal>
          <SectionHeading
            eyebrow="Guest or account"
            title="Start light. Grow when you need to."
            description="One product, two ways in. The guest tier exists so you never have to commit before trying — the account exists so you never outgrow it."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-2 lg:gap-5">
          <Reveal className="h-full">
            <article className="flex h-full flex-col rounded-xl border border-line bg-paper p-6 sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
                  Guest mode
                </p>
                <span className="rounded-full border border-line bg-surface px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink-soft">
                  No sign-up
                </span>
              </div>
              <h3 className="mt-4 text-[20px] font-semibold tracking-[-0.02em]">
                Start right now
              </h3>
              <ul className="mt-5 flex flex-col gap-2.5">
                {guestItems.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-[13px]">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-line bg-surface">
                      <Check
                        aria-hidden="true"
                        className="h-3 w-3 text-ink"
                        strokeWidth={2.5}
                      />
                    </span>
                    <span className="text-ink-soft">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-col gap-3 pt-1">
                <Button
                  href={authLinks.guestWorkspace}
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  Start for free
                </Button>
                <p className="text-center text-xs text-ink-faint">
                  Sign up later — your guest tasks move with you.
                </p>
              </div>
            </article>
          </Reveal>

          <Reveal delay={60} className="h-full">
            <article className="flex h-full flex-col rounded-xl border border-ink bg-ink p-6 text-paper sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-paper/60">
                  Free account
                </p>
                <span className="rounded-full bg-paper px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink">
                  Unlimited
                </span>
              </div>
              <h3 className="mt-4 text-[20px] font-semibold tracking-[-0.02em]">
                The full workspace
              </h3>
              <ul className="mt-5 flex flex-col gap-2.5">
                {accountItems.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-[13px]">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-paper">
                      <Check
                        aria-hidden="true"
                        className="h-3 w-3 text-ink"
                        strokeWidth={2.5}
                      />
                    </span>
                    <span className="text-paper/80">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-col gap-3 pt-1">
                <Button
                  href={authLinks.signUp}
                  variant="on-ink"
                  size="lg"
                  className="w-full"
                >
                  Create an account
                </Button>
                <p className="text-center text-xs text-paper/50">
                  Free forever — no paid plans, no credit card.
                </p>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
