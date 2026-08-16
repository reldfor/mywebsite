"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Check, Plus, Search } from "lucide-react";

const priorityMeta = {
  high: { dot: "bg-danger", text: "text-danger", label: "High" },
  medium: { dot: "bg-warning", text: "text-warning", label: "Medium" },
  low: { dot: "bg-slate-400", text: "text-ink-faint", label: "Low" },
} as const;

function PriorityChip({ level }: { level: keyof typeof priorityMeta }) {
  const meta = priorityMeta[level];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2 py-0.5">
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      <span className={`font-mono text-[10px] font-medium uppercase tracking-wide ${meta.text}`}>
        {meta.label}
      </span>
    </span>
  );
}

function LabelChip({ label, tone }: { label: string; tone: "pen" | "marker" | "gray" }) {
  const tones = {
    pen: "bg-pen-soft text-pen",
    marker: "bg-marker/30 text-ink",
    gray: "bg-ink/5 text-ink-soft",
  } as const;
  return (
    <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-medium ${tones[tone]}`}>
      {label}
    </span>
  );
}

function Checkbox({ completed, delay = 0 }: { completed?: boolean; delay?: number }) {
  if (!completed) {
    return (
      <span
        aria-hidden="true"
        className="h-5 w-5 shrink-0 rounded-full border-2 border-line bg-surface transition-colors duration-200 group-hover:border-ink/50"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="relative h-5 w-5 shrink-0 rounded-full border-2 border-pen bg-pen-soft"
    >
      <svg viewBox="0 0 20 20" className="mock-tick absolute inset-0 h-full w-full p-[3px]">
        <path
          d="M5 10.5l3.2 3.2L15 6.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-pen"
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
      className={`${active ? "mock-active" : ""} relative overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)]`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-line/70 px-5 py-4">
        <div className="flex items-baseline gap-3">
          <p className="font-display text-base font-bold tracking-tight">Today</p>
          <p className="hidden font-mono text-[11px] text-ink-faint sm:block">
            Fri, 21 Aug
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-wide text-pen sm:inline-flex">
            <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-pen" />
            Synced
          </span>
          <span
            aria-hidden="true"
            className="grid h-7 w-7 place-items-center rounded-full bg-ink text-[11px] font-semibold text-paper"
          >
            N
          </span>
        </div>
      </div>

      <div className="border-b border-line/70 bg-paper/60 px-5 py-3">
        <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2">
          <Search aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-ink-faint" />
          <span className="font-mono text-xs text-ink-faint">Search tasks…</span>
          <kbd className="ml-auto hidden rounded-md border border-line bg-paper px-1.5 py-0.5 font-mono text-[10px] text-ink-faint sm:block">
            ⌘K
          </kbd>
        </div>
        <div className="mt-2.5 flex gap-1.5">
          <span className="rounded-full bg-pen px-3 py-1 text-xs font-medium text-paper">
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

      <div className="px-2 py-1.5">
        <div
          className="mock-row group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors duration-200 hover:bg-paper/70"
          style={{ "--i": 0 } as CSSProperties}
        >
          <Checkbox />
          <p className="min-w-0 flex-1 truncate text-sm font-medium">Ship the landing page</p>
          <LabelChip label="Design" tone="pen" />
          <PriorityChip level="high" />
          <span className="hidden font-mono text-[11px] text-ink-faint sm:block">Mon 24 Aug</span>
        </div>

        <div
          className="mock-row group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors duration-200 hover:bg-paper/70"
          style={{ "--i": 1 } as CSSProperties}
        >
          <Checkbox />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">Review Q3 roadmap</p>
            <div className="mt-1 flex items-center gap-2">
              <span aria-hidden="true" className="h-1 w-14 overflow-hidden rounded-full bg-line">
                <span className="block h-full w-1/2 rounded-full bg-pen" />
              </span>
              <span className="font-mono text-[10px] text-ink-faint">2/4 done</span>
            </div>
          </div>
          <LabelChip label="Work" tone="gray" />
          <PriorityChip level="medium" />
          <span className="hidden font-mono text-[11px] font-medium text-warning sm:block">
            Today
          </span>
        </div>

        <div
          className="mock-row group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors duration-200 hover:bg-paper/70"
          style={{ "--i": 2 } as CSSProperties}
        >
          <Checkbox completed />
          <p className="min-w-0 flex-1">
            <span className="relative inline-block max-w-full truncate align-middle">
              <span
                aria-hidden="true"
                className="mock-strike absolute inset-x-[-2px] top-1/2 h-[0.45em] -translate-y-1/2 rounded-[3px] bg-marker/90"
              />
              <span className="relative text-sm font-medium text-ink-faint">
                Book dentist appointment
              </span>
            </span>
          </p>
          <LabelChip label="Personal" tone="marker" />
          <span className="hidden font-mono text-[11px] text-ink-faint line-through sm:block">
            12 Aug
          </span>
        </div>

        <div
          className="mock-row group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors duration-200 hover:bg-paper/70"
          style={{ "--i": 3 } as CSSProperties}
        >
          <Checkbox />
          <p className="min-w-0 flex-1 truncate text-sm font-medium">
            Reply to Marta about the redesign
          </p>
          <LabelChip label="Work" tone="gray" />
          <PriorityChip level="low" />
          <span className="hidden font-mono text-[11px] text-ink-faint sm:block">Today</span>
        </div>

        <div
          className="mock-row group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors duration-200 hover:bg-paper/70"
          style={{ "--i": 4 } as CSSProperties}
        >
          <Checkbox completed />
          <p className="min-w-0 flex-1 truncate text-sm font-medium text-ink-faint line-through">
            Buy oat milk
          </p>
          <LabelChip label="Errands" tone="pen" />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-line/70 px-5 py-3.5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-pen px-3.5 py-1.5 text-xs font-semibold text-paper">
          <Plus aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
          New task
        </span>
        <span className="hidden font-mono text-[10px] text-ink-faint sm:block">
          Press N to add · 2 of 5 done
        </span>
      </div>

      <div className="mock-toast absolute bottom-4 left-4 flex items-center gap-2.5 rounded-xl bg-inverse px-3.5 py-2.5 shadow-[var(--shadow-fab)]">
        <Check aria-hidden="true" className="h-3.5 w-3.5 text-marker" strokeWidth={3} />
        <span className="text-xs font-medium text-inverse-ink">Task completed</span>
        <span className="rounded-md text-xs font-semibold text-marker">Undo</span>
      </div>
    </div>
  );
}
