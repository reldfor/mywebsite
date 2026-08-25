"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft, Tag } from "lucide-react";
import { AddTask } from "@/components/app/add-task";
import { TaskRow } from "@/components/app/task-row";
import { useTasks } from "@/features/todos/tasks-provider";
import { labelTextClasses } from "@/features/todos/label-colors";
import {
  getTasksByLabel,
  matchesSearch,
} from "@/features/todos/selectors";

export function LabelTasks({ labelId }: { labelId: string }) {
  const { tasks, labels, searchQuery, setSearchQuery } = useTasks();
  const label = labels.find((l) => l.id === labelId) ?? null;
  const searching = searchQuery.trim().length > 0;

  const visible = useMemo(() => {
    const base = label ? getTasksByLabel(tasks, labelId) : [];
    return searching ? base.filter((t) => matchesSearch(t, searchQuery)) : base;
  }, [tasks, labelId, label, searching, searchQuery]);

  if (!label) {
    return (
      <div className="mx-auto w-full max-w-[640px] px-4 py-6 sm:px-6 sm:py-8">
        <Link
          href="/app/labels"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-lp-ink-2 hover:text-lp-ink"
        >
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
          All labels
        </Link>
        <div className="mt-16 flex flex-col items-center text-center">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-lp-rule bg-lp-paper-2 text-lp-ink-3 shadow-[var(--lp-shadow-card)]">
            <Tag aria-hidden="true" className="h-4 w-4" />
          </span>
          <h2 className="mt-3 text-[14px] font-medium tracking-[-0.01em] text-lp-ink">Label not found</h2>
          <p className="mt-1 max-w-xs text-[13px] leading-relaxed text-lp-ink-2">
            This label doesn&apos;t exist. It may have been deleted.
          </p>
          <Link
            href="/app/labels"
            className="mt-5 inline-flex h-9 items-center rounded-full bg-lp-ink px-4 text-[13px] font-medium tracking-[-0.01em] text-lp-paper hover:bg-[color-mix(in_srgb,var(--lp-ink)_90%,var(--lp-paper))]"
          >
            Back to labels
          </Link>
        </div>
      </div>
    );
  }

  const total = visible.length;
  const isEmpty = total === 0;

  return (
    <div className="mx-auto w-full max-w-[640px] px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/app/labels"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-lp-ink-2 hover:text-lp-ink"
      >
        <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
        All labels
      </Link>

      <div className="mt-4 flex items-end justify-between gap-4 border-b border-lp-rule pb-4">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 text-[20px] font-medium tracking-[-0.015em] text-lp-ink">
            <Tag aria-hidden="true" className={`h-5 w-5 shrink-0 ${labelTextClasses[label.tone]}`} />
            <span className="truncate">{label.name}</span>
          </h1>
        </div>
      </div>

      {isEmpty ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-lp-rule bg-lp-paper-2 text-lp-ink-3 shadow-[var(--lp-shadow-card)]">
            <Tag aria-hidden="true" className="h-4 w-4" />
          </span>
          <h2 className="mt-3 text-[14px] font-medium tracking-[-0.01em] text-lp-ink">
            {searching ? "No matches" : "No tasks with this label"}
          </h2>
          <p className="mt-1 max-w-xs text-[13px] leading-relaxed text-lp-ink-2">
            {searching
              ? `Nothing matches “${searchQuery.trim()}”.`
              : `Tasks tagged “${label.name}” will show up here.`}
          </p>
          {searching ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-5 inline-flex h-9 items-center rounded-full bg-lp-ink px-4 text-[13px] font-medium tracking-[-0.01em] text-lp-paper hover:bg-[color-mix(in_srgb,var(--lp-ink)_90%,var(--lp-paper))]"
            >
              Clear search
            </button>
          ) : (
            <div className="mt-5 flex justify-center">
              <AddTask />
            </div>
          )}
        </div>
      ) : (
        <>
          <ul className="mt-6">
            {visible.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </ul>
          <div className="mt-6">
            <AddTask />
          </div>
        </>
      )}
    </div>
  );
}
