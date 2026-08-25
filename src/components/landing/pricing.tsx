import Link from "next/link";
import { authLinks, container } from "@/lib/constants";

const GUEST_FEATURES = [
  "10 tasks",
  "All five views",
  "Labels & priorities",
  "Dark mode",
  "No login ever",
];

const PRO_FEATURES = [
  "Unlimited tasks",
  "Cloud sync across devices",
  "Account + data export",
  "Priority support",
];

function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      aria-hidden="true"
      className="mt-[3px] shrink-0 stroke-lp-accent"
    >
      <path
        d="M4 12.5 L9.5 17.5 L20 6.5"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-16 border-t border-lp-rule py-20 md:py-24">
      <div className={container}>
        <p className="mb-3.5 font-mono text-xs text-lp-accent">03 / Pricing</p>
        <h2 className="max-w-[720px] text-[clamp(30px,4vw,46px)] leading-[1.05] font-medium tracking-[-0.03em] text-lp-ink">
          Simple. Honest. Free to start.
        </h2>

        <div className="mx-auto mt-12 grid max-w-[760px] items-start gap-6 md:grid-cols-2">
          <div className="flex flex-col overflow-hidden rounded-lg border border-lp-rule bg-lp-paper-2">
            <div className="border-b border-lp-rule px-6 pt-5 pb-5">
              <p className="font-mono text-[11px] tracking-[0.08em] uppercase text-lp-ink-3">
                Guest
              </p>
              <p className="mt-2 text-[26px] font-medium tracking-[-0.02em] text-lp-ink">
                Free forever
              </p>
              <p className="mt-1 text-[13px] text-lp-ink-3">
                10 tasks · no account · your browser only
              </p>
            </div>
            <ul className="flex flex-col gap-2.5 px-6 py-6 text-sm text-lp-ink-2">
              {GUEST_FEATURES.map((feature) => (
                <li key={feature} className="flex gap-2.5">
                  <Check />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col overflow-hidden rounded-lg border border-lp-accent bg-lp-paper-2">
            <div className="relative rounded-t-lg border-b border-lp-rule bg-lp-accent-soft px-6 pt-5 pb-5">
              <span className="absolute top-4 right-4 rounded-[3px] bg-lp-accent px-[6px] py-[2px] font-mono text-[9px] tracking-[0.06em] uppercase text-lp-paper">
                Early access
              </span>
              <p className="font-mono text-[11px] tracking-[0.08em] uppercase text-lp-accent-2">
                Pro
              </p>
              <p className="mt-2 text-[26px] font-medium tracking-[-0.02em] text-lp-ink">
                Free at launch
              </p>
              <p className="mt-1 text-[13px] text-lp-ink-3">Everything in Guest, plus:</p>
            </div>
            <ul className="flex flex-col gap-2.5 px-6 py-6 text-sm text-lp-ink-2">
              {PRO_FEATURES.map((feature) => (
                <li key={feature} className="flex gap-2.5">
                  <Check />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-6 text-center font-mono text-xs text-lp-ink-3">
          Pro is free while we&apos;re in early access — early users keep it free.
        </p>

        <div className="mt-10 text-center">
          <Link href={authLinks.guestWorkspace} className="btn-primary btn-lg">
            Open the app <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
