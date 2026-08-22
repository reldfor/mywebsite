"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/react";
import {
  Archive,
  Copy,
  LogOut,
  MoreHorizontal,
  RotateCcw,
  Settings,
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
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
        danger
          ? "text-ink hover:bg-ink/[0.06]"
          : "text-ink-soft hover:bg-ink/[0.04] hover:text-ink"
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
  includeDelete = true,
  onDelete,
}: {
  task: Task;
  trigger: (props: { open: boolean; toggle: () => void }) => ReactNode;
  includeDelete?: boolean;
  onDelete?: () => void;
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
          {includeDelete ? (
            <MenuItem
              icon={Trash2}
              label="Delete"
              danger
              onClick={() => (onDelete ? onDelete() : deleteTask(task.id))}
              onClose={close}
            />
          ) : null}
        </div>
      )}
    </Popover>
  );
}

export function RowMenu({ task }: { task: Task }) {
  return (
    <TaskActionsMenu
      task={task}
      includeDelete={false}
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
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-faint transition-colors hover:bg-ink/[0.04] hover:text-ink focus-visible:bg-ink/[0.04] md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
        >
          <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
        </button>
      )}
    />
  );
}

export function UserMenu() {
  const { isLoaded, isSignedIn, user } = useUser();
  const clerk = useClerk();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  if (!isLoaded) {
    return (
      <button
        type="button"
        aria-label="Account menu"
        className="grid h-8 w-8 place-items-center rounded-full bg-ink text-paper"
      >
        <span aria-hidden="true" className="text-[13px] font-semibold">
          G
        </span>
      </button>
    );
  }

  if (isSignedIn && user) {
    const displayName =
      user.fullName?.trim() ||
      user.primaryEmailAddress?.emailAddress?.split("@")[0] ||
      "Your account";
    const email = user.primaryEmailAddress?.emailAddress ?? null;
    const initials = (user.fullName ?? email ?? "T")
      .split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    async function handleSignOut() {
      if (signingOut) return;
      setSigningOut(true);
      await clerk.signOut();
      router.push("/");
    }

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
            className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-ink text-paper transition-colors hover:bg-ink/90"
          >
            {user.hasImage && user.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.imageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span aria-hidden="true" className="text-xs font-semibold">
                {initials}
              </span>
            )}
          </button>
        )}
      >
        {() => (
          <div className="p-3">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-ink text-xs font-semibold text-paper">
                {user.hasImage && user.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span aria-hidden="true">{initials}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-ink">{displayName}</p>
                {email ? (
                  <p className="truncate font-mono text-[10px] tabular-nums tracking-wide text-ink-faint">
                    {email}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-2 border-t border-line pt-3">
              <Link
                href="/app/settings"
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-ink-soft transition-colors hover:bg-ink/[0.04] hover:text-ink"
              >
                <Settings aria-hidden="true" className="h-4 w-4" />
                Settings
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-ink/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogOut aria-hidden="true" className="h-4 w-4" />
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </div>
        )}
      </Popover>
    );
  }

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
          className="grid h-8 w-8 place-items-center rounded-full bg-ink text-paper transition-colors hover:bg-ink/90"
        >
          <span aria-hidden="true" className="text-xs font-semibold">
            G
          </span>
        </button>
      )}
    >
      {() => (
        <div className="p-3">
          <p className="text-[13px] font-semibold text-ink">Guest workspace</p>
          <p className="mt-0.5 font-mono text-[10px] tabular-nums tracking-wide text-ink-faint">
            No account · 10 task limit
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <Link
              href={authLinks.signIn}
              className="inline-flex h-8 w-full items-center justify-center rounded-full border border-line bg-surface text-[13px] font-medium text-ink transition-colors hover:border-ink/15"
            >
              Sign in
            </Link>
            <Link
              href={authLinks.signUp}
              className="inline-flex h-8 w-full items-center justify-center rounded-full bg-ink text-[13px] font-medium text-paper transition-colors hover:bg-ink/90"
            >
              Create an account
            </Link>
          </div>
          <p className="mt-3 border-t border-line pt-2.5 font-mono text-[10px] leading-relaxed tabular-nums text-ink-faint">
            Guest tasks carry over when you sign up.
          </p>
        </div>
      )}
    </Popover>
  );
}
