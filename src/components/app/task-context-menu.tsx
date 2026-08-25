"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Archive, Copy, RotateCcw, Trash2 } from "lucide-react";
import { useTasks } from "@/features/todos/tasks-provider";
import type { Task } from "@/features/todos/types";
import type { ComponentType, SVGProps } from "react";

type Position = { x: number; y: number };

function MenuItem({
  icon: Icon,
  label,
  danger,
  onClick,
  onClose,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  danger?: boolean;
  onClick: () => void;
  onClose: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={() => {
        onClick();
        onClose();
      }}
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
        danger
          ? "text-lp-accent hover:bg-lp-accent-soft"
          : "text-lp-ink-2 hover:bg-[var(--lp-hover-wash)] hover:text-lp-ink"
      }`}
    >
      <Icon aria-hidden="true" className="h-4 w-4" />
      {label}
    </button>
  );
}

export function TaskContextMenu({
  task,
  pos,
  onClose,
}: {
  task: Task;
  pos: Position | null;
  onClose: () => void;
}) {
  const { duplicateTask, archiveTask, restoreTask, deleteTask } = useTasks();
  const ref = useRef<HTMLDivElement | null>(null);
  const [adjustedPos, setAdjustedPos] = useState<Position | null>(pos);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync external prop to internal clamped position
    setAdjustedPos(pos);
  }, [pos]);

  useEffect(() => {
    if (!pos || !adjustedPos) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    let { x, y } = adjustedPos;
    const pad = 8;
    if (x + rect.width > window.innerWidth - pad) x = window.innerWidth - rect.width - pad;
    if (y + rect.height > window.innerHeight - pad) y = window.innerHeight - rect.height - pad;
    if (x < pad) x = pad;
    if (y < pad) y = pad;
    if (x !== adjustedPos.x || y !== adjustedPos.y) setAdjustedPos({ x, y });
  }, [pos, adjustedPos]);

  useEffect(() => {
    if (!pos) return;
    function onMouseDown(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) onClose();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    }
    function onScroll() {
      onClose();
    }
    function onResize() {
      onClose();
    }
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [pos, onClose]);

  if (!pos || !adjustedPos) return null;

  const archived = task.status === "archived";

  return createPortal(
    <div
      ref={ref}
      role="menu"
      aria-label={`Actions for ${task.title}`}
      style={{ position: "fixed", left: adjustedPos.x, top: adjustedPos.y }}
      className="z-[60] w-44 rounded-xl border border-lp-rule bg-lp-paper-2 p-1.5 shadow-[var(--lp-shadow-card)] animate-pop-in"
      onContextMenu={(e) => e.preventDefault()}
    >
      <MenuItem icon={Copy} label="Duplicate" onClick={() => duplicateTask(task.id)} onClose={onClose} />
      {archived ? (
        <MenuItem icon={RotateCcw} label="Restore" onClick={() => restoreTask(task.id)} onClose={onClose} />
      ) : (
        <MenuItem icon={Archive} label="Archive" onClick={() => archiveTask(task.id)} onClose={onClose} />
      )}
      <MenuItem icon={Trash2} label="Delete" danger onClick={() => deleteTask(task.id)} onClose={onClose} />
    </div>,
    document.body,
  );
}
