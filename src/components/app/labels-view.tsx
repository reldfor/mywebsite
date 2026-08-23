"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Pencil, Plus, Tag, Trash2, X } from "lucide-react";
import { ConfirmDialog } from "@/components/app/confirm-dialog";
import { useTasks } from "@/features/todos/tasks-provider";
import { countTasksByLabel } from "@/features/todos/selectors";
import type { LabelTone } from "@/features/todos/types";

const toneOptions: Array<{ value: LabelTone; label: string; dot: string }> = [
  { value: "pen", label: "Pen", dot: "bg-ink" },
  { value: "marker", label: "Marker", dot: "bg-ink/60" },
  { value: "gray", label: "Gray", dot: "bg-ink/25" },
];

const toneDot: Record<LabelTone, string> = {
  pen: "bg-ink",
  marker: "bg-ink/60",
  gray: "bg-ink/25",
};

export function LabelsView() {
  const { labels, tasks, addLabel, updateLabel, deleteLabel } = useTasks();
  const [query, setQuery] = useState("");
  const [newName, setNewName] = useState("");
  const [newTone, setNewTone] = useState<LabelTone>("pen");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editTone, setEditTone] = useState<LabelTone>("pen");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return labels;
    return labels.filter((label) => label.name.toLowerCase().includes(q));
  }, [labels, query]);

  const deleteLabelData = deleteId ? labels.find((l) => l.id === deleteId) ?? null : null;
  const deleteCount = deleteId ? countTasksByLabel(tasks, deleteId) : 0;

  function handleCreate() {
    const name = newName.trim();
    if (!name) return;
    addLabel(name, newTone);
    setNewName("");
  }

  function startEdit(labelId: string) {
    const label = labels.find((l) => l.id === labelId);
    if (!label) return;
    setEditingId(labelId);
    setEditName(label.name);
    setEditTone(label.tone);
  }

  function handleEditSave() {
    if (!editingId) return;
    const name = editName.trim();
    if (!name) return;
    updateLabel(editingId, { name, tone: editTone });
    setEditingId(null);
  }

  return (
    <div className="mx-auto w-full max-w-[640px] px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[22px] font-semibold tracking-[-0.02em]">Labels</h1>
          <p className="mt-1 truncate font-mono text-[11px] tabular-nums text-ink-soft">
            {labels.length} {labels.length === 1 ? "label" : "labels"} · organize tasks with tags
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-xl border border-line bg-surface p-4 shadow-[var(--shadow-card)] dark:shadow-none sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor="new-label-name" className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-faint">
            New label
          </label>
          <input
            id="new-label-name"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
            }}
            placeholder="Label name"
            maxLength={40}
            className="mt-1.5 h-9 w-full rounded-lg border border-line bg-paper px-3 text-[13px] text-ink outline-none placeholder:text-ink-faint focus:border-ink/20"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {toneOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              aria-pressed={newTone === opt.value}
              onClick={() => setNewTone(opt.value)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-medium transition-colors ${newTone === opt.value ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink-soft hover:border-ink/15 hover:text-ink"}`}
            >
              <span aria-hidden="true" className={`h-2 w-2 rounded-full ${opt.dot} ${newTone === opt.value ? "!bg-paper" : ""}`} />
              {opt.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleCreate}
          disabled={!newName.trim()}
          className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full bg-ink px-4 text-[13px] font-medium text-paper transition-colors hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus aria-hidden="true" className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      {labels.length > 3 ? (
        <div className="mt-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search labels…"
            aria-label="Search labels"
            className="h-9 w-full rounded-full border border-line bg-surface px-4 text-[13px] text-ink outline-none placeholder:text-ink-faint focus:border-ink/20"
          />
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <div className="mt-12 flex flex-col items-center text-center">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-ink-faint">
            <Tag aria-hidden="true" className="h-4 w-4" />
          </span>
          <h2 className="mt-3 text-[14px] font-semibold tracking-[-0.01em]">
            {query ? "No matches" : "No labels yet"}
          </h2>
          <p className="mt-1 max-w-xs text-[13px] leading-relaxed text-ink-soft">
            {query ? `Nothing matches “${query.trim()}”.` : "Create your first label to organize tasks."}
          </p>
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-4 text-[13px] font-medium text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink/40"
            >
              Clear search
            </button>
          ) : null}
        </div>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {filtered.map((label) => {
            const count = countTasksByLabel(tasks, label.id);
            const isEditing = editingId === label.id;
            return (
              <li
                key={label.id}
                className="group flex flex-col gap-3 rounded-xl border border-line bg-surface p-4 shadow-[var(--shadow-card)] transition-colors hover:border-ink/10 dark:shadow-none"
              >
                {isEditing ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 rounded-full ${toneDot[editTone]}`} />
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleEditSave();
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        autoFocus
                        maxLength={40}
                        aria-label="Edit label name"
                        className="h-8 min-w-0 flex-1 rounded-lg border border-line bg-paper px-2.5 text-[13px] font-medium text-ink outline-none focus:border-ink/20"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {toneOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          aria-pressed={editTone === opt.value}
                          onClick={() => setEditTone(opt.value)}
                          className={`h-6 w-6 rounded-full border-2 p-0.5 transition-colors ${editTone === opt.value ? "border-ink" : "border-transparent hover:border-line"}`}
                          aria-label={opt.label}
                        >
                          <span className={`block h-full w-full rounded-full ${opt.dot}`} />
                        </button>
                      ))}
                      <span className="ml-auto flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          aria-label="Cancel edit"
                          className="grid h-7 w-7 place-items-center rounded-full text-ink-faint hover:bg-ink/[0.04] hover:text-ink"
                        >
                          <X aria-hidden="true" className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleEditSave}
                          disabled={!editName.trim()}
                          className="inline-flex h-7 items-center rounded-full bg-ink px-3 text-xs font-medium text-paper hover:bg-ink/90 disabled:opacity-40"
                        >
                          Save
                        </button>
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/app/labels/${label.id}`}
                        className="group/link flex min-w-0 items-center gap-2.5"
                      >
                        <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 rounded-full ${toneDot[label.tone]}`} />
                        <span className="truncate text-[14px] font-semibold tracking-[-0.01em] text-ink group-hover/link:underline group-hover/link:decoration-ink/20 group-hover/link:underline-offset-4">
                          {label.name}
                        </span>
                      </Link>
                      <span className="shrink-0 rounded-full border border-line bg-paper px-2 py-0.5 font-mono text-[11px] tabular-nums text-ink-faint">
                        {count} {count === 1 ? "task" : "tasks"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/app/labels/${label.id}`}
                        className="inline-flex h-7 items-center rounded-full border border-line bg-paper px-2.5 text-xs font-medium text-ink-soft transition-colors hover:border-ink/15 hover:text-ink"
                      >
                        <Tag aria-hidden="true" className="mr-1 h-3 w-3" />
                        View
                      </Link>
                      <span className="ml-auto flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => startEdit(label.id)}
                          aria-label={`Edit ${label.name}`}
                          className="grid h-7 w-7 place-items-center rounded-full text-ink-faint transition-colors hover:bg-ink/[0.04] hover:text-ink"
                        >
                          <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(label.id)}
                          aria-label={`Delete ${label.name}`}
                          className="grid h-7 w-7 place-items-center rounded-full text-ink-faint transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                        >
                          <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {deleteLabelData ? (
        <ConfirmDialog
          title="Delete this label?"
          message={
            <>
              “{deleteLabelData.name}” will be deleted.{" "}
              {deleteCount > 0
                ? `${deleteCount} task${deleteCount === 1 ? "" : "s"} will no longer have this label.`
                : "No tasks are using it."}
            </>
          }
          onCancel={() => setDeleteId(null)}
          onConfirm={() => {
            deleteLabel(deleteLabelData.id);
            setDeleteId(null);
          }}
        />
      ) : null}
    </div>
  );
}
