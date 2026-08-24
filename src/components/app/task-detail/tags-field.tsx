"use client";

import { useState, type KeyboardEvent } from "react";
import { Check, Plus, X } from "lucide-react";
import { ConfirmDialog } from "@/components/app/confirm-dialog";
import { Popover } from "@/components/app/popover";
import {
  CategoryIconComponent,
  categoryColorClasses,
  categoryColors,
} from "@/components/app/task-colors";
import { useTasks } from "@/features/todos/tasks-provider";
import { LABEL_COLORS, labelDotClasses } from "@/features/todos/label-colors";
import type { Category, Label, Task } from "@/features/todos/types";
import { chipBase, chipGhost, chipIdle } from "./shared";

export function TagsField({ task }: { task: Task }) {
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
    updateTask(task.id, { categoryId: id });
    setNewCategory("");
  }

  function handleCreateLabel(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    const name = newLabel.trim();
    if (!name) return;
    const tone = LABEL_COLORS[labels.length % LABEL_COLORS.length];
    const id = addLabel(name, tone);
    assignLabel(task.id, id);
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
            <p className="px-2 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-ink-faint">
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
                    onClick={() =>
                      updateTask(task.id, {
                        categoryId: active ? null : category.id,
                      })
                    }
                    className={`flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] font-medium transition-colors ${
                      active
                        ? "text-ink"
                        : "text-ink-soft hover:bg-ink/[0.04] hover:text-ink"
                    }`}
                  >
                    <CategoryIconComponent
                      icon={category.icon}
                      className="h-3.5 w-3.5 shrink-0 text-ink-faint"
                    />
                    <span className="min-w-0 flex-1 truncate text-left">
                      {category.name}
                    </span>
                    {active ? (
                      <Check
                        aria-hidden="true"
                        className="h-3.5 w-3.5 shrink-0"
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
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-faint opacity-0 transition-all hover:bg-ink/[0.06] hover:text-ink focus-visible:opacity-100 group-hover:opacity-100"
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
                  className="h-8 w-full rounded-md border border-ink bg-paper px-2.5 text-[13px] text-ink outline-none placeholder:text-ink-faint"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setNewCategory(" ")}
                className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] font-medium text-ink-faint transition-colors hover:bg-ink/[0.04] hover:text-ink"
              >
                <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                New category
              </button>
            )}
            <div aria-hidden="true" className="mx-2 my-1.5 h-px bg-line" />
            <p className="px-2 pb-1 pt-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-ink-faint">
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
                    onClick={() =>
                      active
                        ? unassignLabel(task.id, label.id)
                        : assignLabel(task.id, label.id)
                    }
                    className={`flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] font-medium transition-colors ${
                      active
                        ? "text-ink"
                        : "text-ink-soft hover:bg-ink/[0.04] hover:text-ink"
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
                        className="h-3.5 w-3.5 shrink-0"
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
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-faint opacity-0 transition-all hover:bg-ink/[0.06] hover:text-ink focus-visible:opacity-100 group-hover:opacity-100"
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
                  className="h-8 w-full rounded-md border border-ink bg-paper px-2.5 text-[13px] text-ink outline-none placeholder:text-ink-faint"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setNewLabel(" ")}
                className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] font-medium text-ink-faint transition-colors hover:bg-ink/[0.04] hover:text-ink"
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
