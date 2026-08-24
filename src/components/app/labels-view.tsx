"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Pencil,
  Plus,
  Tag,
  Trash2,
} from "lucide-react";
import { useTasks } from "@/features/todos/tasks-provider";
import {
  LABEL_COLORS,
  labelDotClasses,
  labelTextClasses,
} from "@/features/todos/label-colors";
import type { Label, LabelTone } from "@/features/todos/types";
import { ConfirmDialog } from "./confirm-dialog";

function EditLabelDialog({
  label,
  onSave,
  onCancel,
}: {
  label: Label;
  onSave: (patch: { name: string; tone: LabelTone }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(label.name);
  const [tone, setTone] = useState<LabelTone>(label.tone);
  const [toneOpen, setToneOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave({ name: trimmed, tone });
  }

  useEffect(() => {
    if (!toneOpen) return;
    function onPointerDown(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setToneOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [toneOpen]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (toneOpen) {
          setToneOpen(false);
        } else {
          onCancel();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onCancel, toneOpen]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/30 p-4 backdrop-blur-[2px]"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Edit label"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-pop)] animate-pop-in"
      >
        <h2 className="text-[14px] font-semibold tracking-[-0.01em] text-ink">
          Edit label
        </h2>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
          }}
          autoFocus
          maxLength={40}
          aria-label="Label name"
          className="mt-4 h-9 w-full rounded-full border border-line bg-surface px-3.5 text-[13px] text-ink outline-none transition-colors focus:border-ink/30"
        />

        <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.08em] text-ink-faint">
          Color
        </p>
        <div className="relative mt-2" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setToneOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={toneOpen}
            className="inline-flex h-9 w-full items-center justify-between rounded-full border border-line bg-surface px-3.5 text-[13px] text-ink transition-colors hover:border-ink/15"
          >
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`h-3 w-3 rounded-full ${labelDotClasses[tone]}`}
              />
              <span className="capitalize">{tone}</span>
            </span>
            <ChevronDown
              aria-hidden="true"
              className={`h-3.5 w-3.5 text-ink-faint transition-transform ${toneOpen ? "rotate-180" : ""}`}
            />
          </button>
          {toneOpen ? (
            <div
              role="listbox"
              aria-label="Color"
              className="absolute top-full left-0 z-10 mt-1 grid w-full grid-cols-6 gap-1.5 rounded-xl border border-line bg-surface p-2.5 shadow-[var(--shadow-pop)] animate-pop-in"
            >
              {LABEL_COLORS.map((t) => (
                <button
                  key={t}
                  type="button"
                  role="option"
                  aria-selected={tone === t}
                  aria-label={t}
                  title={t}
                  onClick={() => {
                    setTone(t);
                    setToneOpen(false);
                  }}
                  className={`grid h-7 w-7 place-items-center rounded-full transition-transform hover:scale-110 ${
                    tone === t ? "ring-2 ring-ink ring-offset-2 ring-offset-surface" : ""
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-4 w-4 rounded-full ${labelDotClasses[t]}`}
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-8 items-center rounded-full border border-line bg-surface px-4 text-[13px] font-medium text-ink-soft transition-colors hover:border-ink/15 hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!name.trim()}
            className="inline-flex h-8 items-center rounded-full bg-ink px-4 text-[13px] font-medium text-paper transition-colors hover:bg-ink/90 disabled:pointer-events-none disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export function LabelsView() {
  const { labels, updateLabel, deleteLabel, addLabel } = useTasks();
  const [open, setOpen] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingLabel, setEditingLabel] = useState<Label | null>(null);
  const [labelToDelete, setLabelToDelete] = useState<Label | null>(null);

  function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    addLabel(name, "gray");
    setNewName("");
    setAdding(false);
  }

  return (
    <div className="mx-auto w-full max-w-[640px] px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex h-9 items-center justify-between border-b border-line">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Collapse labels" : "Expand labels"}
          className="flex items-center gap-1.5"
        >
          {open ? (
            <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 text-ink-faint" />
          ) : (
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 text-ink-faint" />
          )}
          <h1 className="text-[13px] font-semibold tracking-[-0.01em]">Labels</h1>
        </button>
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          aria-label="Add label"
          className="grid h-7 w-7 place-items-center rounded-full text-ink-faint transition-colors hover:bg-ink/[0.04] hover:text-ink"
        >
          <Plus aria-hidden="true" className="h-3.5 w-3.5" />
        </button>
      </div>

      {open ? (
        <>
          {adding ? (
            <div className="flex h-10 items-center gap-2 border-b border-line/60">
              <Tag aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-ink-faint" />
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd();
                  if (e.key === "Escape") {
                    setAdding(false);
                    setNewName("");
                  }
                }}
                onBlur={() => {
                  if (!newName.trim()) {
                    setAdding(false);
                  }
                }}
                autoFocus
                placeholder="Label name"
                maxLength={40}
                aria-label="New label name"
                className="h-7 min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-faint"
              />
              {newName.trim() ? (
                <button
                  type="button"
                  onClick={handleAdd}
                  aria-label="Create label"
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-faint hover:text-ink"
                >
                  <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>
          ) : null}

          {labels.length > 0 ? (
            <ul>
              {labels.map((label) => (
                <li key={label.id} className="border-b border-line/60 last:border-0">
                  <Link
                    href={`/app/labels/${label.id}`}
                    className="group flex h-10 items-center justify-between gap-3"
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <Tag
                        aria-hidden="true"
                        className={`h-3.5 w-3.5 shrink-0 ${labelTextClasses[label.tone]}`}
                      />
                      <span className="truncate text-[13px] text-ink">{label.name}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setEditingLabel(label);
                        }}
                        aria-label={`Edit label ${label.name}`}
                        className="grid h-6 w-6 place-items-center rounded-full text-ink-faint transition-colors hover:text-ink"
                      >
                        <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setLabelToDelete(label);
                        }}
                        aria-label={`Delete label ${label.name}`}
                        className="grid h-6 w-6 place-items-center rounded-full text-ink-faint transition-colors hover:text-ink"
                      >
                        <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ) : null}

      {editingLabel ? (
        <EditLabelDialog
          label={editingLabel}
          onCancel={() => setEditingLabel(null)}
          onSave={({ name, tone }) => {
            updateLabel(editingLabel.id, { name, tone });
            setEditingLabel(null);
          }}
        />
      ) : null}

      {labelToDelete ? (
        <ConfirmDialog
          title="Delete this label?"
          message={
            <>
              “{labelToDelete.name}” will be deleted.
            </>
          }
          onConfirm={() => {
            deleteLabel(labelToDelete.id);
            setLabelToDelete(null);
          }}
          onCancel={() => setLabelToDelete(null)}
        />
      ) : null}
    </div>
  );
}
