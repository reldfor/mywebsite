"use client";

import { Plus } from "lucide-react";
import { useTasks } from "@/features/todos/tasks-provider";

export function MobileAddButton() {
  const { addTaskInputRef } = useTasks();

  function focusAdd() {
    addTaskInputRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    addTaskInputRef.current?.focus({ preventScroll: true });
  }

  return (
    <button
      type="button"
      onClick={focusAdd}
      aria-label="Add a task"
      className="fixed bottom-20 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-ink text-paper shadow-[var(--shadow-fab)] transition-colors hover:bg-pen md:hidden"
    >
      <Plus aria-hidden="true" className="h-6 w-6" strokeWidth={2.5} />
    </button>
  );
}
