"use client";

import { useState, type KeyboardEvent } from "react";
import { Check, Plus, X } from "lucide-react";
import { ConfirmDialog } from "@/modules/app-chrome/components/confirm-dialog";
import { Popover } from "@/modules/app-chrome/components/popover";
import {
  CategoryIconComponent,
  categoryColorClasses,
  categoryColors,
} from "@/modules/app-chrome/components/task-colors";
import { useTasks } from "@/modules/tasks/store/tasks-provider";
import { LABEL_COLORS, labelDotClasses } from "@/modules/tasks/domain/label-colors";
import type { Category, Label, Task } from "@/modules/tasks/domain/types";
import { chipBase, chipGhost, chipIdle } from "./shared";

export function TagsField({
  task,
  onChange,
}: {
  task: Task;
  onChange?: (patch: Partial<Task>) => void;
}) {
  const {
    tasks,
    labels,
    categories,
    updateTask,
    assignLabel,
    unassignLabel,
    addCategory,
    deleteCategory,
    addLabel,
    deleteLabel,
  } = useTasks();

  function applyPatch(patch: Partial<Task>) {
    if (onChange) onChange(patch);
    else updateTask(task.id, patch);
  }

  function handleToggleCategory(categoryId: string) {
    const active = task.categoryId === categoryId;
    applyPatch({ categoryId: active ? null : categoryId });
  }

  function handleToggleLabel(labelId: string) {
    const active = task.labelIds.includes(labelId);
    if (onChange) {
      const next = active
        ? task.labelIds.filter((id) => id !== labelId)
        : [...task.labelIds, labelId];
      onChange({ labelIds: next });
      return;
    }
    if (active) unassignLabel(task.id, labelId);
    else assignLabel(task.id, labelId);
  }

  const [newCategory, setNewCategory] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );
  const [labelToDelete, setLabelToDelete] = useState<Label | null>(null);

  const assignedCategory =
    categories.find((category) => category.id === task.categoryId) ?? null;
  const assignedLabels = labels.filter((label) =>
    task.labelIds.includes(label.id),
  );
  const hasTags = Boolean(assignedCategory) || assignedLabels.length > 0;

  function tasksByCategory(id: string) {
    return tasks.filter((t) => t.categoryId === id).length;
  }

  function tasksByLabel(id: string) {
    return tasks.filter((t) => t.labelIds.includes(id)).length;
  }

  function handleCreateCategory(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    const name = newCategory.trim();
    if (!name) return;
    const color = categoryColors[categories.length % categoryColors.length];
    const id = addCategory(name, "list", color);
    applyPatch({ categoryId: id });
    setNewCategory("");
  }

  function handleCreateLabel(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    const name = newLabel.trim();
    if (!name) return;
    const tone = LABEL_COLORS[labels.length % LABEL_COLORS.length];
    const id = addLabel(name, tone);
    if (onChange) {
      onChange({ labelIds: [...task.labelIds, id] });
    } else {
      assignLabel(task.id, id);
    }
    setNewLabel("");
  }

  return (
    <>
      <Popover
        align="left"
        label="Categories and labels"
        trigger={({ open, toggle }) => (
          <span className="flex min-w-0 max-w-full flex-wrap items-center gap-1.5">
            {assignedCategory ? (
              <button
                type="button"
                aria-haspopup="dialog"
                aria-expanded={open}
                onClick={toggle}
                className={`${chipBase} border ${categoryColorClasses[assignedCategory.color].pill}`}
              >
                <CategoryIconComponent
                  icon={assignedCategory.icon}
                  className="h-3 w-3"
                />
                {assignedCategory.name}
              </button>
            ) : null}
            {assignedLabels.map((label) => (
              <button
                key={label.id}
                type="button"
                aria-haspopup="dialog"
                aria-expanded={open}
                onClick={toggle}
                className={`${chipBase} ${chipIdle}`}
              >
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full ${labelDotClasses[label.tone]}`}
                />
                {label.name}
              </button>
            ))}
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded={open}
              onClick={toggle}
              aria-label="Edit categories and labels"
              className={`${chipBase} ${hasTags ? chipIdle : chipGhost}`}
            >
              <Plus aria-hidden="true" className="h-3.5 w-3.5" />
              {hasTags ? null : "Tags"}
            </button>
          </span>
        )}
      >
        {(close) => (
          <div className="w-64 p-2">
            <p className="px-2 pb-1 pt-1.5 font-mono text-[9px] font-medium uppercase tracking-[0.06em] text-lp-ink-3">
              Category
            </p>
            {categories.map((category) => {
              const active = task.categoryId === category.id;
              return (
                <div
                  key={category.id}
                  className="group flex items-center gap-1 pr-1"
                >
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    onClick={() => handleToggleCategory(category.id)}
                    className={`flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] font-medium transition-colors ${
                      active
                        ? "text-lp-ink"
                        : "text-lp-ink-2 hover:bg-[var(--lp-hover-wash)] hover:text-lp-ink"
                    }`}
                  >
                    <CategoryIconComponent
                      icon={category.icon}
                      className="h-3.5 w-3.5 shrink-0 text-lp-ink-3"
                    />
                    <span className="min-w-0 flex-1 truncate text-left">
                      {category.name}
                    </span>
                    {active ? (
                      <Check
                        aria-hidden="true"
                        className="h-3.5 w-3.5 shrink-0 text-lp-accent"
                        strokeWidth={2.5}
                      />
                    ) : null}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      setCategoryToDelete(category);
                    }}
                    aria-label={`Delete category ${category.name}`}
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-lp-ink-3 opacity-0 transition-all hover:bg-[var(--lp-hover-wash)] hover:text-lp-ink focus-visible:opacity-100 group-hover:opacity-100"
                  >
                    <X aria-hidden="true" className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
            {newCategory ? (
              <div className="p-1">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value)}
                  onKeyDown={handleCreateCategory}
                  onBlur={() => setNewCategory("")}
                  placeholder="New category, Enter to save"
                  aria-label="New category name"
                  autoFocus
                  className="h-8 w-full rounded-md border border-lp-accent bg-lp-paper px-2.5 text-[13px] text-lp-ink outline-none placeholder:text-lp-ink-4"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setNewCategory(" ")}
                className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] font-medium text-lp-ink-3 transition-colors hover:bg-[var(--lp-hover-wash)] hover:text-lp-ink"
              >
                <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                New category
              </button>
            )}
            <div aria-hidden="true" className="mx-2 my-1.5 h-px bg-lp-rule" />
            <p className="px-2 pb-1 pt-0.5 font-mono text-[9px] font-medium uppercase tracking-[0.06em] text-lp-ink-3">
              Labels
            </p>
            {labels.map((label) => {
              const active = task.labelIds.includes(label.id);
              return (
                <div
                  key={label.id}
                  className="group flex items-center gap-1 pr-1"
                >
                  <button
                    type="button"
                    role="menuitemcheckbox"
                    aria-checked={active}
                    onClick={() => handleToggleLabel(label.id)}
                    className={`flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] font-medium transition-colors ${
                      active
                        ? "text-lp-ink"
                        : "text-lp-ink-2 hover:bg-[var(--lp-hover-wash)] hover:text-lp-ink"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${labelDotClasses[label.tone]}`}
                    />
                    <span className="min-w-0 flex-1 truncate text-left">
                      {label.name}
                    </span>
                    {active ? (
                      <Check
                        aria-hidden="true"
                        className="h-3.5 w-3.5 shrink-0 text-lp-accent"
                        strokeWidth={2.5}
                      />
                    ) : null}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      setLabelToDelete(label);
                    }}
                    aria-label={`Delete label ${label.name}`}
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-lp-ink-3 opacity-0 transition-all hover:bg-[var(--lp-hover-wash)] hover:text-lp-ink focus-visible:opacity-100 group-hover:opacity-100"
                  >
                    <X aria-hidden="true" className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
            {newLabel ? (
              <div className="p-1">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(event) => setNewLabel(event.target.value)}
                  onKeyDown={handleCreateLabel}
                  onBlur={() => setNewLabel("")}
                  placeholder="New label, Enter to save"
                  aria-label="New label name"
                  autoFocus
                  className="h-8 w-full rounded-md border border-lp-accent bg-lp-paper px-2.5 text-[13px] text-lp-ink outline-none placeholder:text-lp-ink-4"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setNewLabel(" ")}
                className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] font-medium text-lp-ink-3 transition-colors hover:bg-[var(--lp-hover-wash)] hover:text-lp-ink"
              >
                <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                New label
              </button>
            )}
          </div>
        )}
      </Popover>

      {categoryToDelete ? (
        <ConfirmDialog
          title="Delete this category?"
          message={
            <>
              “{categoryToDelete.name}” will be deleted.{" "}
              {tasksByCategory(categoryToDelete.id) > 0
                ? `${tasksByCategory(categoryToDelete.id)} task${
                    tasksByCategory(categoryToDelete.id) === 1 ? "" : "s"
                  } will no longer be categorized.`
                : "No tasks are using it."}
            </>
          }
          onCancel={() => setCategoryToDelete(null)}
          onConfirm={() => {
            deleteCategory(categoryToDelete.id);
            setCategoryToDelete(null);
          }}
        />
      ) : null}

      {labelToDelete ? (
        <ConfirmDialog
          title="Delete this label?"
          message={
            <>
              “{labelToDelete.name}” will be deleted.{" "}
              {tasksByLabel(labelToDelete.id) > 0
                ? `${tasksByLabel(labelToDelete.id)} task${
                    tasksByLabel(labelToDelete.id) === 1 ? "" : "s"
                  } will no longer have this label.`
                : "No tasks are using it."}
            </>
          }
          onCancel={() => setLabelToDelete(null)}
          onConfirm={() => {
            deleteLabel(labelToDelete.id);
            setLabelToDelete(null);
          }}
        />
      ) : null}
    </>
  );
}
