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
import {
  AuthOverlay,
  type AuthOverlayMode,
} from "@/components/auth/auth-overlay";
import { useTasks } from "@/features/todos/tasks-provider";
import type { Task } from "@/features/todos/types";

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
  const { tasks, taskLimit } = useTasks();
  const [signingOut, setSigningOut] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthOverlayMode>("signIn");

  function openAuth(mode: AuthOverlayMode) {
    setAuthMode(mode);
    setAuthOpen(true);
  }

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
      user.primaryEmailAddress?.emailAddress?.split("@")[0] ?? "Your account";
    const initials = displayName
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
            <div className="flex flex-col items-center pt-1">
              <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-ink text-sm font-semibold text-paper">
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
              <p className="mt-2 max-w-full truncate text-[13px] font-semibold text-ink">
                {displayName}
              </p>
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
    <>
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
        {(close) => {
          const used = tasks.length;
          const pct = Math.min(100, Math.round((used / taskLimit) * 100));
          const nearLimit = used >= taskLimit - 2;

          return (
          <div className="p-3">
            <div className="flex flex-col items-center pt-1">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink text-sm font-semibold text-paper">
                <span aria-hidden="true">G</span>
              </div>
              <p className="mt-2 text-[13px] font-semibold text-ink">Guest</p>
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={taskLimit}
                aria-valuenow={used}
                aria-label={`${used} of ${taskLimit} guest tasks used`}
                className="mt-2.5 w-full"
              >
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
                  <div
                    className={`h-full rounded-full transition-[width] duration-300 ${
                      nearLimit ? "bg-warning" : "bg-ink"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-1.5 font-mono text-[10px] tabular-nums tracking-wide text-ink-faint">
                  {used}/{taskLimit} tasks
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  close();
                  openAuth("signIn");
                }}
                className="mt-3 inline-flex h-8 w-full items-center justify-center rounded-full bg-ink text-[13px] font-medium text-paper transition-colors hover:bg-ink/90"
              >
                Sign in
              </button>
            </div>
          </div>
        );
        }}
      </Popover>
      {authOpen ? (
        <AuthOverlay
          mode={authMode}
          onClose={() => setAuthOpen(false)}
          onSwitch={setAuthMode}
        />
      ) : null}
    </>
  );
}
