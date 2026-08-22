"use client";

import { Plus } from "lucide-react";
import { useTasks } from "@/features/todos/tasks-provider";

export function MobileAddButton() {
  const { addTaskInputRef, tasks, taskLimit, showToast } = useTasks();

  function focusAdd() {
    if (tasks.length >= taskLimit) {
      showToast(`You've reached the ${taskLimit}-task guest limit.`);
      return;
    }
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
      className="fixed bottom-[76px] right-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-ink text-paper shadow-[var(--shadow-fab)] transition-colors hover:bg-ink/90 md:hidden"
    >
      <Plus aria-hidden="true" className="h-5 w-5" strokeWidth={2.5} />
    </button>
  );
}
