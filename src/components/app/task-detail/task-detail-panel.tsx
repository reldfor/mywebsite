"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  Info,
  MoreHorizontal,
  RotateCcw,
  X,
} from "lucide-react";
import { TaskActionsMenu } from "@/components/app/menus";
import { ConfirmDialog } from "@/components/app/confirm-dialog";
import { useTasks } from "@/features/todos/tasks-provider";
import type { Task } from "@/features/todos/types";
import { formatDateTime } from "@/lib/date";
import { DueDateField } from "./due-date-field";
import { PriorityField } from "./priority-field";
import { SubtasksSection } from "./subtasks-section";
import { TagsField } from "./tags-field";

export function TaskDetailPanel() {
  const {
    tasks,
    selectedTaskId,
    setSelectedTaskId,
    updateTask,
    toggleTask,
    deleteTask,
    restoreTask,
  } = useTasks();

  const task = tasks.find((t) => t.id === selectedTaskId) ?? null;
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [ghost, setGhost] = useState<Task | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const current = task ?? ghost;

  const isOpen = selectedTaskId !== null;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync ghost for exit animation
    if (task) setGhost(task);
  }, [task]);

  useEffect(() => {
    if (selectedTaskId) panelRef.current?.focus();
  }, [selectedTaskId]);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") setSelectedTaskId(null);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, setSelectedTaskId]);

  if (!current) return null;

  function close() {
    setSelectedTaskId(null);
  }

  const completed = current.status === "completed";

  const menuTrigger = ({ open, toggle }: { open: boolean; toggle: () => void }) => (
    <button
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      aria-label="More task actions"
      onClick={toggle}
      className="grid h-8 w-8 place-items-center rounded-full text-lp-ink-3 transition-colors hover:bg-[var(--lp-hover-wash)] hover:text-lp-ink"
    >
      <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
    </button>
  );

  function handleAnimationEnd() {
    if (!isOpen) setGhost(null);
  }

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      inert={!isOpen}
      aria-label={`Details for ${current.title}`}
      onAnimationEnd={handleAnimationEnd}
      onTransitionEnd={handleAnimationEnd}
      className={`detail-shell fixed inset-0 z-50 flex flex-col bg-lp-paper outline-none lg:inset-y-0 lg:left-auto lg:right-0 lg:top-0 lg:h-dvh lg:w-[420px] lg:border-l lg:border-lp-rule ${
        isOpen ? "is-open detail-motion-enter" : "detail-motion-close"
      }`}
    >
      <header className="flex h-14 shrink-0 items-center gap-1 border-b border-lp-rule bg-[var(--lp-glass-soft)] px-3 lg:px-4">
        <button
          type="button"
          onClick={close}
          aria-label="Close task details"
          className="inline-flex h-8 items-center gap-1 rounded-full px-2 text-[13px] font-medium text-lp-ink-2 transition-colors hover:bg-[var(--lp-hover-wash)] hover:text-lp-ink lg:hidden"
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          Back
        </button>
        <span className="min-w-0 flex-1 truncate px-1 text-[13px] font-medium text-lp-ink-3 lg:hidden">
          Task details
        </span>
        <button
          type="button"
          onClick={close}
          aria-label="Close task details"
          className="hidden h-8 w-8 place-items-center rounded-full text-lp-ink-3 transition-colors hover:bg-[var(--lp-hover-wash)] hover:text-lp-ink lg:mr-auto lg:grid"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
        <TaskActionsMenu
          task={current}
          trigger={menuTrigger}
          onDelete={() => setConfirmDelete(true)}
        />
        <button
          type="button"
          onClick={() => setShowInfo((value) => !value)}
          aria-label="Task timestamps"
          aria-expanded={showInfo}
          className={`grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-[var(--lp-hover-wash)] ${
            showInfo ? "text-lp-ink" : "text-lp-ink-3 hover:text-lp-ink"
          }`}
        >
          <Info aria-hidden="true" className="h-4 w-4" />
        </button>
      </header>

      <div
        key={current.id}
        className="flex-1 overflow-y-auto px-5 py-5 sm:px-6"
      >
        {current.status === "archived" ? (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-lp-rule bg-lp-paper-2 px-3 py-2.5">
            <span className="rounded-full border border-lp-rule bg-lp-paper px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide tabular-nums text-lp-ink-2">
              Archived
            </span>
            <button
              type="button"
              onClick={() => restoreTask(current.id)}
              className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-lp-ink underline decoration-lp-rule underline-offset-4 hover:decoration-lp-ink/40"
            >
              <RotateCcw aria-hidden="true" className="h-3 w-3" />
              Restore
            </button>
          </div>
        ) : null}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => toggleTask(current.id)}
            aria-label={completed ? "Reopen task" : "Mark task complete"}
            aria-pressed={completed}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors hover:bg-[var(--lp-hover-wash)]"
          >
            <span
              aria-hidden="true"
              className={`grid h-5 w-5 place-items-center rounded-full border transition-colors duration-150 ${
                completed
                  ? "border-lp-ink bg-lp-ink"
                  : "border-lp-rule bg-[var(--lp-glass)] hover:border-lp-accent"
              }`}
            >
              {completed ? (
                <svg viewBox="0 0 20 20" className="h-full w-full p-[3px]">
                  <path
                    d="M5 10.5l3.2 3.2L15 6.8"
                    fill="none"
                    stroke="var(--lp-paper)"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="task-tick"
                    style={{ strokeDashoffset: 0 }}
                  />
                </svg>
              ) : null}
            </span>
          </button>
          <input
            type="text"
            value={current.title}
            maxLength={200}
            onChange={(event) =>
              updateTask(current.id, { title: event.target.value })
            }
            aria-label="Task title"
            className={`min-w-0 flex-1 rounded-md bg-transparent text-[18px] font-medium tracking-[-0.02em] outline-none placeholder:text-lp-ink-4 ${
              completed ? "text-lp-ink-3 line-through decoration-lp-accent" : "text-lp-ink"
            }`}
          />
        </div>

        <textarea
          value={current.description}
          rows={3}
          maxLength={2000}
          onChange={(event) =>
            updateTask(current.id, { description: event.target.value })
          }
          placeholder="Add a note…"
          aria-label="Task description"
          className="mt-3 w-full resize-none rounded-md bg-transparent px-0.5 py-1 text-[13px] leading-[1.6] text-lp-ink outline-none placeholder:text-lp-ink-4"
        />

        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <DueDateField task={current} />
          <PriorityField task={current} />
          <TagsField task={current} />
        </div>

        <SubtasksSection task={current} />

        {showInfo ? (
          <div className="mt-8 border-t border-lp-rule pt-4">
            <p className="font-mono text-[11px] leading-relaxed tabular-nums text-lp-ink-3">
              Created {formatDateTime(current.createdAt)}
              <br />
              Updated {formatDateTime(current.updatedAt)}
              {current.completedAt ? (
                <>
                  <br />
                  Completed {formatDateTime(current.completedAt)}
                </>
              ) : null}
            </p>
          </div>
        ) : null}
      </div>

      {confirmDelete ? (
        <ConfirmDialog
          title="Delete this task?"
          message={
            <>“{current.title}” will be permanently removed from all views.</>
          }
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => {
            setConfirmDelete(false);
            deleteTask(current.id);
          }}
        />
      ) : null}
    </div>
  );
}
