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
import { LabelsEmptyIllustration } from "@/components/app/empty-states/labels-illustration";
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
        event.stopPropagation();
        if (toneOpen) {
          setToneOpen(false);
        } else {
          onCancel();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [onCancel, toneOpen]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-lp-ink/20 p-4 backdrop-blur-[2px]"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Edit label"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm rounded-xl border border-lp-rule bg-lp-paper-2 p-5 shadow-[var(--lp-shadow-card)] animate-pop-in"
      >
        <h2 className="text-[14px] font-medium tracking-[-0.01em] text-lp-ink">
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
          className="mt-4 h-9 w-full rounded-full border border-lp-rule bg-lp-paper px-3.5 text-[13px] text-lp-ink outline-none transition-colors focus:border-lp-accent placeholder:text-lp-ink-4"
        />

        <p className="mt-4 font-mono text-[9px] font-medium uppercase tracking-[0.06em] text-lp-ink-3">
          Color
        </p>
        <div className="relative mt-2" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setToneOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={toneOpen}
            className="inline-flex h-9 w-full items-center justify-between rounded-full border border-lp-rule bg-lp-paper px-3.5 text-[13px] text-lp-ink transition-colors hover:border-[color-mix(in_srgb,var(--lp-ink)_20%,transparent)]"
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
              className={`h-3.5 w-3.5 text-lp-ink-3 transition-transform ${toneOpen ? "rotate-180 text-lp-accent" : ""}`}
            />
          </button>
          {toneOpen ? (
            <div
              role="listbox"
              aria-label="Color"
              className="absolute top-full left-0 z-10 mt-1 grid w-full grid-cols-6 gap-1.5 rounded-xl border border-lp-rule bg-lp-paper-2 p-2.5 shadow-[var(--lp-shadow-card)] animate-pop-in"
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
                    tone === t ? "ring-2 ring-lp-accent ring-offset-2 ring-offset-lp-paper-2" : ""
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
            className="inline-flex h-8 items-center rounded-full border border-lp-rule bg-[var(--lp-glass)] px-4 text-[13px] font-medium tracking-[-0.01em] text-lp-ink-2 transition-colors hover:border-[color-mix(in_srgb,var(--lp-ink)_20%,transparent)] hover:text-lp-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!name.trim()}
            className="inline-flex h-8 items-center rounded-full bg-lp-ink px-4 text-[13px] font-medium tracking-[-0.01em] text-lp-paper transition-colors hover:bg-[color-mix(in_srgb,var(--lp-ink)_90%,var(--lp-paper))] disabled:pointer-events-none disabled:opacity-40"
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
    <>
      <div className="mt-0 w-full px-6 py-3 sm:mt-[45px] sm:px-6 sm:py-4">
        <div className="flex flex-row items-center justify-between gap-4">
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Collapse labels" : "Expand labels"}
              className="flex items-center gap-1.5"
            >
              {open ? (
                <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 text-lp-ink-3" />
              ) : (
                <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 text-lp-ink-3" />
              )}
              <h1 className="text-2xl font-semibold leading-tight tracking-tight text-lp-ink sm:text-[28px] sm:font-medium sm:tracking-[-0.015em]">
                Labels
              </h1>
            </button>
            <p className="mt-1.5 truncate font-mono text-sm font-medium leading-5 tracking-wide tabular-nums text-lp-ink-2 sm:mt-1 sm:text-[11px]">
              {labels.length} {labels.length === 1 ? "label" : "labels"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-1.5">
            <button
              type="button"
              onClick={() => setAdding((v) => !v)}
              aria-label="Add label"
              className="grid h-7 w-7 place-items-center rounded-full text-lp-ink-3 transition-colors hover:bg-[var(--lp-hover-wash)] hover:text-lp-ink"
            >
              <Plus aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-[640px] px-6 pt-4 sm:px-6 sm:pt-6">

      {open ? (
        <>
          {adding ? (
            <div className="flex h-10 items-center gap-2 border-b border-lp-rule/60">
              <Tag aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-lp-ink-3" />
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
                className="h-7 min-w-0 flex-1 bg-transparent text-[13px] text-lp-ink outline-none placeholder:text-lp-ink-4"
              />
              {newName.trim() ? (
                <button
                  type="button"
                  onClick={handleAdd}
                  aria-label="Create label"
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-lp-ink-3 hover:text-lp-ink"
                >
                  <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>
          ) : null}

          {labels.length > 0 ? (
            <ul>
              {labels.map((label) => (
                <li key={label.id} className="border-b border-lp-rule/60 last:border-0">
                  <Link
                    href={`/app/labels/${label.id}`}
                    className="group flex h-10 items-center justify-between gap-3"
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <Tag
                        aria-hidden="true"
                        className={`h-3.5 w-3.5 shrink-0 ${labelTextClasses[label.tone]}`}
                      />
                      <span className="truncate text-[13px] text-lp-ink">{label.name}</span>
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
                        className="grid h-6 w-6 place-items-center rounded-full text-lp-ink-3 transition-colors hover:text-lp-ink"
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
                        className="grid h-6 w-6 place-items-center rounded-full text-lp-ink-3 transition-colors hover:text-lp-accent"
                      >
                        <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-10 flex flex-col items-center text-center sm:mt-14">
              <LabelsEmptyIllustration className="h-[150px] w-[180px] rounded-[20px]" />
              <h2 className="mt-4 text-[14px] font-medium tracking-[-0.01em] text-lp-ink">No labels yet</h2>
              <p className="mt-1 max-w-xs text-[13px] leading-relaxed text-lp-ink-2">Create your first label to organize tasks.</p>
            </div>
          )}
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
    </>
  );
}
