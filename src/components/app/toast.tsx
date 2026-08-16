"use client";

import { useTasks } from "@/features/todos/tasks-provider";

export function Toast() {
  const { toast, dismissToast } = useTasks();

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 bottom-20 z-50 flex justify-center px-5 md:bottom-6"
    >
      <div className="animate-toast-in flex items-center gap-3 rounded-xl bg-inverse px-4 py-3 shadow-[var(--shadow-fab)]">
        <p className="text-sm font-medium text-inverse-ink">{toast.message}</p>
        {toast.undo ? (
          <button
            type="button"
            onClick={() => {
              toast.undo?.();
              dismissToast();
            }}
            className="text-sm font-semibold text-marker transition-opacity hover:opacity-80"
          >
            Undo
          </button>
        ) : null}
        <button
          type="button"
          onClick={dismissToast}
          aria-label="Dismiss notification"
          className="grid h-6 w-6 place-items-center rounded-full text-inverse-ink/50 transition-colors hover:bg-inverse-ink/10 hover:text-inverse-ink"
        >
          <span aria-hidden="true" className="text-sm leading-none">
            ×
          </span>
        </button>
      </div>
    </div>
  );
}
