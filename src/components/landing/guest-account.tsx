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
      className="scroll-mt-20 border-t border-line/80 bg-surface/60 py-20 lg:py-28"
    >
      <div className={container}>
        <Reveal>
          <SectionHeading
            eyebrow="Guest or account"
            title="Start light. Grow when you need to."
            description="One product, two ways in. The guest tier exists so you never have to commit before trying — the account exists so you never outgrow it."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal className="h-full">
            <article className="flex h-full flex-col rounded-2xl border border-line bg-surface p-8">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-ink-faint">
                  Guest mode
                </p>
                <span className="rounded-full border border-line bg-paper px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-ink-soft">
                  No sign-up
                </span>
              </div>
              <h3 className="mt-5 font-display text-2xl font-extrabold tracking-tight">
                Start right now
              </h3>
              <ul className="mt-6 flex flex-col gap-3.5">
                {guestItems.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[15px]">
                    <Check
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-pen"
                      strokeWidth={3}
                    />
                    <span className="text-ink-soft">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 pt-2">
                <Button
                  href={authLinks.guestWorkspace}
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  Start for free
                </Button>
                <p className="text-center font-mono text-xs text-ink-faint">
                  Sign up later — your guest tasks move with you.
                </p>
              </div>
            </article>
          </Reveal>

          <Reveal delay={90} className="h-full">
            <article className="flex h-full flex-col rounded-2xl bg-ink p-8 text-paper shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-paper/60">
                  Free account
                </p>
                <span className="rounded-full bg-marker px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-marker-ink">
                  Unlimited
                </span>
              </div>
              <h3 className="mt-5 font-display text-2xl font-extrabold tracking-tight">
                The full workspace
              </h3>
              <ul className="mt-6 flex flex-col gap-3.5">
                {accountItems.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[15px]">
                    <Check
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-marker"
                      strokeWidth={3}
                    />
                    <span className="text-paper/90">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 pt-2">
                <Button
                  href={authLinks.signUp}
                  variant="marker"
                  size="lg"
                  className="w-full"
                >
                  Create an account
                </Button>
                <p className="text-center font-mono text-xs text-paper/50">
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
