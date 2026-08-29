"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  Info,
  MoreHorizontal,
  RotateCcw,
  X,
} from "lucide-react";
import { TaskActionsMenu } from "@/modules/app-chrome/components/menus";
import { ConfirmDialog } from "@/modules/app-chrome/components/confirm-dialog";
import { useTasks } from "@/modules/tasks/store/tasks-provider";
import type { Task } from "@/modules/tasks/domain/types";
import { formatDateTime } from "@/modules/shared/lib/date";
import { DueDateField } from "./due-date-field";
import { PriorityField } from "./priority-field";
import { SubtasksSection } from "./subtasks-section";
import { TagsField } from "./tags-field";

function buildPatch(original: Task, draft: Task): Partial<Task> {
  const patch: Partial<Task> = {};
  if (original.title !== draft.title) patch.title = draft.title;
  if (original.description !== draft.description) patch.description = draft.description;
  if (original.priority !== draft.priority) patch.priority = draft.priority;
  if (original.dueAt !== draft.dueAt) patch.dueAt = draft.dueAt;
  if (original.startDate !== draft.startDate) patch.startDate = draft.startDate;
  if (original.endDate !== draft.endDate) patch.endDate = draft.endDate;
  if (original.categoryId !== draft.categoryId) patch.categoryId = draft.categoryId;
  if (original.status !== draft.status) patch.status = draft.status;
  if (original.completedAt !== draft.completedAt) patch.completedAt = draft.completedAt;
  if (JSON.stringify(original.labelIds) !== JSON.stringify(draft.labelIds)) patch.labelIds = draft.labelIds;
  if (JSON.stringify(original.subtasks) !== JSON.stringify(draft.subtasks)) patch.subtasks = draft.subtasks;
  return patch;
}

export function TaskDetailPanel() {
  const {
    tasks,
    selectedTaskId,
    setSelectedTaskId,
    updateTask,
    deleteTask,
    restoreTask,
  } = useTasks();

  const task = tasks.find((t) => t.id === selectedTaskId) ?? null;
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [ghost, setGhost] = useState<Task | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [draft, setDraft] = useState<Task | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const originalRef = useRef<Task | null>(null);
  const pendingDraftRef = useRef<Task | null>(null);

  const isOpen = selectedTaskId !== null;
  const displayTask = draft ?? task ?? ghost;
  // eslint-disable-next-line react-hooks/refs -- isDirty reads ref during render intentionally
  const original = originalRef.current;
  const isDirty = Boolean(
    draft && original && Object.keys(buildPatch(original, draft)).length > 0,
  );

  const syncDraft = useCallback(
    (nextTask: Task | null) => {
      if (nextTask) {
        setDraft(nextTask);
        originalRef.current = nextTask;
        pendingDraftRef.current = nextTask;
        setGhost(nextTask);
      }
    },
    [],
  );

  useEffect(() => {
    if (task) {
      const prevId = originalRef.current?.id ?? null;
      if (prevId && prevId !== task.id && pendingDraftRef.current && originalRef.current) {
        const prevDraft = pendingDraftRef.current;
        const prevOriginal = originalRef.current;
        const patch = buildPatch(prevOriginal, prevDraft);
        if (Object.keys(patch).length > 0) {
          updateTask(prevOriginal.id, patch);
        }
      }
      if (originalRef.current?.id !== task.id) {
        syncDraft(task);
      } else if (!isDirty) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- sync draft when task updates externally and not editing
        setDraft(task);
        originalRef.current = task;
        pendingDraftRef.current = task;
        setGhost(task);
      }
    }
  }, [task, syncDraft, isDirty, updateTask]);

  useEffect(() => {
    pendingDraftRef.current = draft;
  }, [draft]);

  useEffect(() => {
    if (selectedTaskId) panelRef.current?.focus();
  }, [selectedTaskId]);

  const handleSave = useCallback(async () => {
    if (!draft || !originalRef.current) return false;
    const patch = buildPatch(originalRef.current, draft);
    if (Object.keys(patch).length === 0) return false;
    const id = draft.id;
    const snapshot = draft;
    setIsSaving(true);
    try {
      await updateTask(id, patch);
      originalRef.current = snapshot;
      return true;
    } finally {
      setIsSaving(false);
    }
  }, [draft, updateTask]);

  const close = useCallback(() => {
    if (draft && originalRef.current) {
      const patch = buildPatch(originalRef.current, draft);
      if (Object.keys(patch).length > 0) {
        const id = originalRef.current.id;
        updateTask(id, patch);
      }
    }
    setSelectedTaskId(null);
  }, [draft, updateTask, setSelectedTaskId]);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  function handleAnimationEnd() {
    if (!isOpen) {
      setGhost(null);
      setDraft(null);
      originalRef.current = null;
      pendingDraftRef.current = null;
    }
  }

  if (!displayTask) return null;

  const current = displayTask;
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

  function updateDraft(patch: Partial<Task>) {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  function toggleDraftComplete() {
    setDraft((prev) => {
      if (!prev) return prev;
      const isComp = prev.status === "completed";
      return {
        ...prev,
        status: isComp ? "todo" : "completed",
        completedAt: isComp ? null : new Date().toISOString(),
      };
    });
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
            onClick={toggleDraftComplete}
            aria-label={completed ? "Reopen task" : "Mark task complete"}
            aria-pressed={completed}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors hover:bg-[var(--lp-hover-wash)]"
          >
            <span
              aria-hidden="true"
              className={`grid h-[18px] w-[18px] place-items-center rounded-full border transition-colors duration-150 ${
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
            onChange={(event) => updateDraft({ title: event.target.value })}
            aria-label="Task title"
            className={`min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1 text-[15px] font-medium tracking-[-0.01em] outline-none placeholder:text-lp-ink-4 focus:border-lp-rule focus:bg-lp-paper ${
              completed ? "text-lp-ink-3 line-through decoration-lp-accent" : "text-lp-ink"
            }`}
          />
        </div>

        <textarea
          value={current.description}
          rows={3}
          maxLength={2000}
          onChange={(event) => updateDraft({ description: event.target.value })}
          placeholder="Add a note…"
          aria-label="Task description"
          className="mt-3 w-full resize-none rounded-lg border border-lp-rule bg-lp-paper px-3 py-2.5 text-[13px] leading-relaxed text-lp-ink outline-none placeholder:text-lp-ink-4 focus:border-lp-accent"
        />

        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <DueDateField task={current} onChange={updateDraft} />
          <PriorityField task={current} onChange={updateDraft} />
          <TagsField task={current} onChange={updateDraft} />
        </div>

        <SubtasksSection task={current} onChange={updateDraft} />

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

      <div className="flex shrink-0 items-center gap-2 bg-lp-paper px-5 py-3 sm:px-6 lg:hidden">
        <button
          type="button"
          onClick={close}
          className="h-9 flex-1 rounded-full border border-lp-rule bg-lp-paper px-4 text-[13px] font-medium text-lp-ink-2 transition-colors hover:bg-[var(--lp-hover-wash)] hover:text-lp-ink"
        >
          {isDirty || isSaving ? (isSaving ? "Saving…" : "Save & close") : "Close"}
        </button>
      </div>
      {(isDirty || isSaving) && (
        <div className="hidden shrink-0 items-center gap-2 bg-lp-paper px-5 py-3 sm:px-6 lg:flex">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-lp-rule bg-lp-paper px-5 text-[13px] font-medium text-lp-ink transition-colors hover:bg-[var(--lp-hover-wash)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.5} />
            {isSaving ? "Saving…" : "Save"}
          </button>
        </div>
      )}

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
