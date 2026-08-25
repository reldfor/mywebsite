"use client";

import { useTasks } from "@/features/todos/tasks-provider";

export function Toast() {
  const { toast, dismissToast } = useTasks();

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 bottom-20 z-50 flex justify-center px-4 md:bottom-6"
    >
      <div className="flex items-center gap-3 rounded-full border border-lp-rule bg-lp-ink px-4 py-2.5 shadow-[var(--lp-shadow-card)]">
        <p className="text-[13px] font-medium tracking-[-0.01em] text-lp-paper">{toast.message}</p>
        {toast.undo ? (
          <button
            type="button"
            onClick={() => {
              toast.undo?.();
              dismissToast();
            }}
            className="text-[13px] font-medium text-lp-paper/70 underline decoration-lp-paper/30 underline-offset-4 hover:text-lp-paper"
          >
            Undo
          </button>
        ) : null}
        <button
          type="button"
          onClick={dismissToast}
          aria-label="Dismiss notification"
          className="grid h-6 w-6 place-items-center rounded-full text-lp-paper/60 transition-colors hover:bg-lp-paper/10 hover:text-lp-paper"
        >
          <span aria-hidden="true" className="text-sm leading-none">
            ×
          </span>
        </button>
      </div>
    </div>
  );
}
