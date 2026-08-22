"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Check, Plus, Search } from "lucide-react";

function PriorityDot({ level }: { level: "high" | "medium" | "low" }) {
  const opacities = {
    high: "bg-ink",
    medium: "bg-ink/40",
    low: "bg-ink/20",
  } as const;
  const labels = { high: "High", medium: "Medium", low: "Low" } as const;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2 py-0.5">
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${opacities[level]}`} />
      <span className="text-[10px] font-medium tracking-wide text-ink-soft">
        {labels[level]}
      </span>
    </span>
  );
}

function LabelChip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-line bg-surface px-2 py-0.5 text-[10px] font-medium text-ink-soft">
      {label}
    </span>
  );
}

function Checkbox({ completed, delay = 0 }: { completed?: boolean; delay?: number }) {
  if (!completed) {
    return (
      <span
        aria-hidden="true"
        className="h-5 w-5 shrink-0 rounded-full border border-line bg-surface"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="relative h-5 w-5 shrink-0 rounded-full border border-ink bg-ink"
    >
      <svg viewBox="0 0 20 20" className="mock-tick absolute inset-0 h-full w-full p-[3.5px]">
        <path
          d="M5 10.5l3.2 3.2L15 6.8"
          fill="none"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ animationDelay: delay ? `${delay}ms` : undefined }}
        />
      </svg>
    </span>
  );
}

export function ProductMock() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let io: IntersectionObserver | null = null;
    const raf = requestAnimationFrame(() => {
      if (typeof IntersectionObserver === "undefined") {
        setActive(true);
        return;
      }
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setActive(true);
              io?.disconnect();
            }
          }
        },
        { threshold: 0.25 },
      );
      io.observe(el);
    });
    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`${active ? "mock-active" : ""} relative overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--shadow-card)]`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div className="flex items-baseline gap-2.5">
          <p className="text-[14px] font-semibold tracking-[-0.01em]">Today</p>
          <p className="hidden font-mono text-[11px] tabular-nums text-ink-faint sm:block">
            Fri, 21 Aug
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="hidden items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-ink-faint sm:inline-flex">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ink/20" />
            Synced
          </span>
          <span
            aria-hidden="true"
            className="grid h-6 w-6 place-items-center rounded-full bg-ink text-[11px] font-medium text-paper"
          >
            N
          </span>
        </div>
      </div>

      <div className="border-b border-line bg-paper px-4 py-2.5">
        <div className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2">
          <Search aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-ink-faint" />
          <span className="text-xs text-ink-faint">Search tasks…</span>
          <kbd className="ml-auto hidden rounded border border-line bg-paper px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-ink-faint sm:block">
            ⌘K
          </kbd>
        </div>
        <div className="mt-2.5 flex gap-1.5">
          <span className="rounded-full bg-ink px-3 py-1 text-xs font-medium text-paper">
            All
          </span>
          <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs text-ink-soft">
            Due soon
          </span>
          <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs text-ink-soft">
            High priority
          </span>
          <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs text-ink-soft">
            Labels
          </span>
        </div>
      </div>

      <div className="px-1.5 py-1">
        <div
          className="mock-row group flex items-center gap-3 rounded-lg px-3 py-2.5"
          style={{ "--i": 0 } as CSSProperties}
        >
          <Checkbox />
          <p className="min-w-0 flex-1 truncate text-[13px] font-medium">Ship the landing page</p>
          <LabelChip label="Design" />
          <PriorityDot level="high" />
          <span className="hidden font-mono text-[11px] tabular-nums text-ink-faint sm:block">Mon 24 Aug</span>
        </div>

        <div
          className="mock-row group flex items-center gap-3 rounded-lg px-3 py-2.5"
          style={{ "--i": 1 } as CSSProperties}
        >
          <Checkbox />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium">Review Q3 roadmap</p>
            <div className="mt-1 flex items-center gap-2">
              <span aria-hidden="true" className="h-1 w-14 overflow-hidden rounded-full bg-line">
                <span className="block h-full w-1/2 rounded-full bg-ink" />
              </span>
              <span className="font-mono text-[10px] tabular-nums text-ink-faint">2/4 done</span>
            </div>
          </div>
          <LabelChip label="Work" />
          <PriorityDot level="medium" />
          <span className="hidden font-mono text-[11px] font-medium tabular-nums text-ink sm:block">
            Today
          </span>
        </div>

        <div
          className="mock-row group flex items-center gap-3 rounded-lg px-3 py-2.5"
          style={{ "--i": 2 } as CSSProperties}
        >
          <Checkbox completed />
          <p className="min-w-0 flex-1">
            <span className="relative inline-block max-w-full truncate align-middle">
              <span
                aria-hidden="true"
                className="mock-strike absolute inset-x-[-2px] top-1/2 h-[1px] -translate-y-1/2 bg-ink/15"
              />
              <span className="relative text-[13px] font-medium text-ink-faint">
                Book dentist appointment
              </span>
            </span>
          </p>
          <LabelChip label="Personal" />
          <span className="hidden font-mono text-[11px] tabular-nums text-ink-faint line-through sm:block">
            12 Aug
          </span>
        </div>

        <div
          className="mock-row group flex items-center gap-3 rounded-lg px-3 py-2.5"
          style={{ "--i": 3 } as CSSProperties}
        >
          <Checkbox />
          <p className="min-w-0 flex-1 truncate text-[13px] font-medium">
            Reply to Marta about the redesign
          </p>
          <LabelChip label="Work" />
          <PriorityDot level="low" />
          <span className="hidden font-mono text-[11px] tabular-nums text-ink-faint sm:block">Today</span>
        </div>

        <div
          className="mock-row group flex items-center gap-3 rounded-lg px-3 py-2.5"
          style={{ "--i": 4 } as CSSProperties}
        >
          <Checkbox completed />
          <p className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink-faint line-through">
            Buy oat milk
          </p>
          <LabelChip label="Errands" />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-line px-4 py-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-paper">
          <Plus aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.5} />
          New task
        </span>
        <span className="hidden font-mono text-[10px] tabular-nums text-ink-faint sm:block">
          Press N to add · 2 of 5 done
        </span>
      </div>

      <div className="mock-toast absolute bottom-3 left-3 flex items-center gap-2 rounded-lg border border-line bg-ink px-3 py-2 shadow-[var(--shadow-pop)]">
        <Check aria-hidden="true" className="h-3 w-3 text-paper" strokeWidth={3} />
        <span className="text-xs font-medium text-paper">Task completed</span>
        <span className="rounded text-xs font-medium text-paper/60">Undo</span>
      </div>
    </div>
  );
}
