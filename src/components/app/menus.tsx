"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/react";
import {
  Archive,
  ChevronDown,
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
          ? "text-lp-accent hover:bg-lp-accent-soft"
          : "text-lp-ink-2 hover:bg-[var(--lp-hover-wash)] hover:text-lp-ink"
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
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-lp-ink-3 transition-colors hover:bg-[var(--lp-hover-wash)] hover:text-lp-ink focus-visible:bg-[var(--lp-hover-wash)] md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
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
        className="grid h-8 w-8 place-items-center rounded-full bg-lp-ink text-lp-paper"
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
            className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-lp-ink text-lp-paper transition-colors hover:bg-[color-mix(in_srgb,var(--lp-ink)_90%,var(--lp-paper))]"
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
              <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-lp-ink text-sm font-semibold text-lp-paper">
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
              <p className="mt-2 max-w-full truncate text-[13px] font-semibold text-lp-ink">
                {displayName}
              </p>
            </div>
            <div className="mt-3 flex flex-col gap-2 border-t border-lp-rule pt-3">
              <Link
                href="/app/settings"
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-lp-ink-2 transition-colors hover:bg-[var(--lp-hover-wash)] hover:text-lp-ink"
              >
                <Settings aria-hidden="true" className="h-4 w-4" />
                Settings
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-lp-ink transition-colors hover:bg-[var(--lp-hover-wash)] disabled:cursor-not-allowed disabled:opacity-60"
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
            className="grid h-8 w-8 place-items-center rounded-full bg-lp-ink text-lp-paper transition-colors hover:bg-[color-mix(in_srgb,var(--lp-ink)_90%,var(--lp-paper))]"
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
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-lp-ink text-sm font-semibold text-lp-paper">
                <span aria-hidden="true">G</span>
              </div>
              <p className="mt-2 text-[13px] font-semibold text-lp-ink">Guest</p>
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={taskLimit}
                aria-valuenow={used}
                aria-label={`${used} of ${taskLimit} guest tasks used`}
                className="mt-2.5 w-full"
              >
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-lp-paper-4">
                  <div
                    className={`h-full rounded-full transition-[width] duration-300 ${
                      nearLimit ? "bg-lp-accent" : "bg-lp-ink"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-1.5 font-mono text-[10px] tabular-nums tracking-wide text-lp-ink-3">
                  {used}/{taskLimit} tasks
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  close();
                  openAuth("signIn");
                }}
                className="mt-3 inline-flex h-8 w-full items-center justify-center rounded-full bg-lp-ink text-[13px] font-medium tracking-[-0.01em] text-lp-paper transition-colors hover:bg-[color-mix(in_srgb,var(--lp-ink)_90%,var(--lp-paper))]"
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

export function SidebarAccountMenu() {
  const { isLoaded, isSignedIn, user } = useUser();
  const clerk = useClerk();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthOverlayMode>("signIn");

  function openAuth(mode: AuthOverlayMode) {
    setAuthMode(mode);
    setAuthOpen(true);
  }

  if (!isLoaded) {
    return (
      <div className="flex h-9 items-center gap-2.5 rounded-lg px-2.5 opacity-60">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-lp-ink text-[11px] font-semibold text-lp-paper">
          —
        </span>
        <span className="text-[13px] font-medium text-lp-ink-2">Loading…</span>
      </div>
    );
  }

  if (isSignedIn && user) {
    const displayName =
      user.primaryEmailAddress?.emailAddress?.split("@")[0] ?? "Your account";
    const email = user.primaryEmailAddress?.emailAddress ?? "";
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
      <>
        <Popover
          align="left"
          side="top"
          label="Account"
          className="w-64"
          trigger={({ open, toggle }) => (
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={open}
              aria-label="Account menu"
              onClick={toggle}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-[var(--lp-hover-wash)]"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-full bg-lp-ink text-[11px] font-semibold text-lp-paper">
                {user.hasImage && user.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.imageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span aria-hidden="true">{initials}</span>
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium leading-none text-lp-ink">
                  {displayName}
                </span>
                {email ? (
                  <span className="block truncate text-[11px] leading-none text-lp-ink-3">
                    {email}
                  </span>
                ) : null}
              </span>
              <ChevronDown
                aria-hidden="true"
                className={`h-3.5 w-3.5 shrink-0 text-lp-ink-3 transition-transform ${open ? "" : "rotate-180"}`}
              />
            </button>
          )}
        >
          {() => (
            <div className="p-3">
              <div className="flex flex-col items-center pt-1">
                <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-lp-ink text-sm font-semibold text-lp-paper">
                  {user.hasImage && user.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span aria-hidden="true">{initials}</span>
                  )}
                </div>
                <p className="mt-2 max-w-full truncate text-[13px] font-semibold text-lp-ink">
                  {displayName}
                </p>
                {email ? (
                  <p className="max-w-full truncate text-[11px] text-lp-ink-3">{email}</p>
                ) : null}
              </div>
              <div className="mt-3 flex flex-col gap-2 border-t border-lp-rule pt-3">
                <Link
                  href="/app/settings"
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-lp-ink-2 transition-colors hover:bg-[var(--lp-hover-wash)] hover:text-lp-ink"
                >
                  <Settings aria-hidden="true" className="h-4 w-4" />
                  Settings
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-lp-ink transition-colors hover:bg-[var(--lp-hover-wash)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LogOut aria-hidden="true" className="h-4 w-4" />
                  {signingOut ? "Signing out…" : "Sign out"}
                </button>
              </div>
            </div>
          )}
        </Popover>
        {authOpen ? (
          <AuthOverlay mode={authMode} onClose={() => setAuthOpen(false)} onSwitch={setAuthMode} />
        ) : null}
      </>
    );
  }

  return (
    <>
      <Popover
        align="left"
        side="top"
        label="Account"
        className="w-64"
        trigger={({ open, toggle }) => (
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={open}
            aria-label="Account menu"
            onClick={toggle}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-[var(--lp-hover-wash)]"
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-lp-ink text-[11px] font-semibold text-lp-paper">
              G
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-medium leading-none text-lp-ink">Guest</span>
            </span>
            <ChevronDown
              aria-hidden="true"
              className={`h-3.5 w-3.5 shrink-0 text-lp-ink-3 transition-transform ${open ? "" : "rotate-180"}`}
            />
          </button>
        )}
      >
        {(close) => (
          <div className="p-3">
            <div className="flex flex-col items-center pt-1">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-lp-ink text-sm font-semibold text-lp-paper">
                <span aria-hidden="true">G</span>
              </div>
              <p className="mt-2 text-[13px] font-semibold text-lp-ink">Guest</p>
              <button
                type="button"
                onClick={() => {
                  close();
                  openAuth("signIn");
                }}
                className="mt-3 inline-flex h-8 w-full items-center justify-center rounded-full bg-lp-ink text-[13px] font-medium tracking-[-0.01em] text-lp-paper transition-colors hover:bg-[color-mix(in_srgb,var(--lp-ink)_90%,var(--lp-paper))]"
              >
                Sign in
              </button>
            </div>
          </div>
        )}
      </Popover>
      {authOpen ? (
        <AuthOverlay mode={authMode} onClose={() => setAuthOpen(false)} onSwitch={setAuthMode} />
      ) : null}
    </>
  );
}
