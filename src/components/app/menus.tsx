"use client";

import Link from "next/link";
import {
  Archive,
  Copy,
  MoreHorizontal,
  RotateCcw,
  Trash2,
} from "lucide-react";
import type { ComponentType, ReactNode, SVGProps } from "react";
import { Popover } from "@/components/app/popover";
import { useTasks } from "@/features/todos/tasks-provider";
import type { Task } from "@/features/todos/types";
import { authLinks } from "@/lib/constants";

type MenuItemProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  danger?: boolean;
  onClick: () => void;
  onClose: () => void;
};

function MenuItem({ icon: Icon, label, danger, onClick, onClose }: MenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={() => {
        onClick();
        onClose();
      }}
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        danger
          ? "text-danger hover:bg-danger-soft"
          : "text-ink-soft hover:bg-ink/5 hover:text-ink"
      }`}
    >
      <Icon aria-hidden="true" className="h-4 w-4" />
      {label}
    </button>
  );
}

export function TaskActionsMenu({
  task,
  trigger,
}: {
  task: Task;
  trigger: (props: { open: boolean; toggle: () => void }) => ReactNode;
}) {
  const { duplicateTask, archiveTask, restoreTask, deleteTask } = useTasks();
  const archived = task.status === "archived";

  return (
    <Popover
      role="menu"
      label="Task actions"
      trigger={trigger}
    >
      {(close) => (
        <div className="w-44 p-1.5">
          <MenuItem icon={Copy} label="Duplicate" onClick={() => duplicateTask(task.id)} onClose={close} />
          {archived ? (
            <MenuItem icon={RotateCcw} label="Restore" onClick={() => restoreTask(task.id)} onClose={close} />
          ) : (
            <MenuItem icon={Archive} label="Archive" onClick={() => archiveTask(task.id)} onClose={close} />
          )}
          <MenuItem icon={Trash2} label="Delete" danger onClick={() => deleteTask(task.id)} onClose={close} />
        </div>
      )}
    </Popover>
  );
}

export function RowMenu({ task }: { task: Task }) {
  return (
    <TaskActionsMenu
      task={task}
      trigger={({ open, toggle }) => (
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={`Actions for ${task.title}`}
          onClick={(event) => {
            event.stopPropagation();
            toggle();
          }}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-faint transition-colors hover:bg-ink/5 hover:text-ink focus-visible:bg-ink/5 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
        >
          <MoreHorizontal aria-hidden="true" className="h-4.5 w-4.5" />
        </button>
      )}
    />
  );
}

export function UserMenu() {
  return (
    <Popover
      align="right"
      label="Account"
      className="w-64"
      trigger={({ open, toggle }) => (
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="Account menu"
          onClick={toggle}
          className="grid h-9 w-9 place-items-center rounded-full bg-ink text-paper transition-colors hover:bg-pen"
        >
          <span aria-hidden="true" className="font-display text-sm font-extrabold">
            G
          </span>
        </button>
      )}
    >
      {() => (
        <div className="p-3">
          <p className="text-sm font-semibold text-ink">Guest workspace</p>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            Preview · no account yet
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <Link
              href={authLinks.signIn}
              className="inline-flex h-9 w-full items-center justify-center rounded-full border border-line bg-surface text-sm font-semibold text-ink transition-colors hover:border-ink/40 hover:bg-surface-strong"
            >
              Sign in
            </Link>
            <Link
              href={authLinks.signUp}
              className="inline-flex h-9 w-full items-center justify-center rounded-full bg-ink text-sm font-semibold text-paper transition-colors hover:bg-pen"
            >
              Create an account
            </Link>
          </div>
          <p className="mt-3 border-t border-line/80 pt-2.5 font-mono text-[10px] leading-relaxed text-ink-faint">
            Guest tasks carry over when you sign up. Account sync connects in a
            later build.
          </p>
        </div>
      )}
    </Popover>
  );
}
