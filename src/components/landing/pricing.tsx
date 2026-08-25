"use client";

import Link from "next/link";
import { useState } from "react";
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
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isInside, setIsInside] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const cardBase = "flex flex-col overflow-hidden rounded-lg bg-lp-paper-2";
  const guestCard = `${cardBase} border border-lp-rule`;
  const proCard = `${cardBase} border border-lp-accent`;

  return (
    <section
      id="pricing"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsInside(true)}
      onMouseLeave={() => setIsInside(false)}
      style={
        {
          "--mouse-x": `${pos.x}px`,
          "--mouse-y": `${pos.y}px`,
        } as React.CSSProperties
      }
      className="relative scroll-mt-16 overflow-hidden border-t border-lp-rule py-20 md:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 ease-out"
        style={{
          opacity: isInside ? 1 : 0,
          background: `radial-gradient(355px circle at var(--mouse-x) var(--mouse-y), rgba(194,65,12,0.14), rgba(194,65,12,0.06) 32%, transparent 68%)`,
        }}
      />
      <div className={`${container} relative z-10`}>
        <p className="mb-3.5 font-mono text-xs text-lp-accent">03 / Pricing</p>
        <h2 className="max-w-[720px] text-[clamp(30px,4vw,46px)] leading-[1.05] font-medium tracking-[-0.03em] text-lp-ink">
          Simple. Honest. Free to start.
        </h2>

        <div className="mx-auto mt-12 grid max-w-[760px] items-start gap-6 md:grid-cols-2">
          <div className={guestCard}>
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

          <div className={proCard}>
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
