"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarClock,
  CheckCheck,
  Inbox,
  Menu,
  PanelLeftClose,
  Search,
  Settings,
  Sun,
  Tag,
  X,
} from "lucide-react";
import { useUser } from "@clerk/react";
import { SidebarAccountMenu } from "@/components/app/menus";
import { useTasks } from "@/features/todos/tasks-provider";
import { countDueToday, countOpenTasks } from "@/features/todos/selectors";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { useMemo } from "react";

const primaryNav = [
  { href: "/app", label: "Inbox", icon: Inbox, exact: true },
  { href: "/app/today", label: "Today", icon: Sun },
  { href: "/app/upcoming", label: "Upcoming", icon: CalendarClock },
  { href: "/app/completed", label: "Completed", icon: CheckCheck },
  { href: "/app/labels", label: "Labels", icon: Tag },
];

type SidebarProps = {
  open?: boolean;
  onCollapse?: () => void;
};

export function Sidebar({ open = true, onCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { tasks, taskLimit, searchQuery, setSelectedTaskId, setSearchQuery, setSearchOpen } = useTasks();
  const { isLoaded, isSignedIn } = useUser();
  const isDesktop = useIsDesktop();

  const counts = useMemo(
    () => ({
      inbox: countOpenTasks(tasks),
      today: countDueToday(tasks),
    }),
    [tasks],
  );

  function navigate() {
    setSelectedTaskId(null);
    setSearchQuery("");
    setSearchOpen(false);
    if (!isDesktop) onCollapse?.();
  }

  return (
    <aside
      inert={!open}
      className={`sidebar-shell flex w-[280px] max-w-[85vw] shrink-0 flex-col border-r border-lp-rule bg-lp-paper md:bg-[var(--lp-glass-soft)] px-4 py-4 md:w-[220px] lg:w-[240px] ${
        open ? "is-open" : ""
      }`}
    >
      {onCollapse ? (
        <div className="flex pb-2">
          <button
            type="button"
            onClick={onCollapse}
            aria-label="Hide sidebar"
            className="grid h-9 w-9 place-items-center text-lp-ink-3 transition-colors hover:text-lp-ink md:hidden"
          >
            <Menu aria-hidden="true" className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onCollapse}
            aria-label="Hide sidebar"
            className="hidden h-9 w-9 place-items-center rounded-full text-lp-ink-3 transition-colors hover:bg-[var(--lp-hover-wash)] hover:text-lp-ink md:grid"
          >
            <PanelLeftClose aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      ) : null}
      <div className="mb-3">
        <label htmlFor="sidebar-search" className="sr-only">
          Search tasks
        </label>
        <div className="flex h-11 items-center gap-3 rounded-xl border border-lp-rule bg-lp-paper-2 px-3.5 transition-colors focus-within:border-[color-mix(in_srgb,var(--lp-ink)_20%,transparent)] focus-within:bg-lp-paper md:h-8 md:gap-2 md:rounded-lg md:px-2.5">
          <Search aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-lp-ink-3 md:h-3.5 md:w-3.5" />
          <input
            id="sidebar-search"
            type="search"
            value={searchQuery}
            onChange={(event) => {
              const value = event.target.value;
              setSearchQuery(value);
              setSearchOpen(value.length > 0);
            }}
            placeholder="Search"
            aria-label="Search tasks"
            className="min-w-0 flex-1 bg-transparent text-[14px] text-lp-ink caret-lp-ink outline-none placeholder:text-lp-ink-3 md:text-[13px]"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSearchOpen(false);
              }}
              aria-label="Clear search"
              className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-lp-ink-3 transition-colors hover:bg-[var(--lp-hover-wash)] hover:text-lp-ink"
            >
              <X aria-hidden="true" className="h-3 w-3" />
            </button>
          ) : null}
        </div>
      </div>
      <nav aria-label="Tasks" className="flex flex-col gap-2 md:gap-0.5">
        {primaryNav.map((item) => {
          const active =
            item.exact === true ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={navigate}
              aria-current={active ? "page" : undefined}
              className={`flex h-11 items-center gap-3 rounded-xl px-3.5 text-[14px] font-medium transition-colors md:h-8 md:gap-2.5 md:rounded-lg md:px-2.5 md:text-[13px] ${
                active
                  ? "bg-lp-paper-3 text-lp-ink"
                  : "bg-lp-paper-2 text-lp-ink-2 hover:bg-lp-paper-3 hover:text-lp-ink md:bg-transparent md:hover:bg-[var(--lp-hover-wash)]"
              }`}
            >
              <item.icon
                aria-hidden="true"
                className={`h-[18px] w-[18px] shrink-0 md:h-4 md:w-4 ${active ? "text-lp-ink-2" : "text-lp-ink-3"}`}
              />
              <span className="flex-1 truncate">{item.label}</span>
              {item.label === "Inbox" && counts.inbox > 0 ? (
                <span
                  className={`font-mono text-[10px] tabular-nums font-medium ${
                    active ? "text-lp-ink-2" : "text-lp-ink-3"
                  }`}
                >
                  {counts.inbox}
                </span>
              ) : null}
              {item.label === "Today" && counts.today > 0 ? (
                <span
                  className={`font-mono text-[10px] tabular-nums font-medium ${
                    active ? "text-lp-ink-2" : "text-lp-ink-3"
                  }`}
                >
                  {counts.today}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-2 border-t border-lp-rule pt-4">
        <nav aria-label="Account">
          <Link
            href="/app/settings"
            onClick={navigate}
            aria-current={pathname.startsWith("/app/settings") ? "page" : undefined}
            className={`flex h-11 items-center gap-3 rounded-xl px-3.5 text-[14px] font-medium transition-colors md:h-8 md:gap-2.5 md:rounded-lg md:px-2.5 md:text-[13px] ${
              pathname.startsWith("/app/settings")
                ? "bg-lp-paper-3 text-lp-ink"
                : "bg-lp-paper-2 text-lp-ink-2 hover:bg-lp-paper-3 hover:text-lp-ink md:bg-transparent md:hover:bg-[var(--lp-hover-wash)]"
            }`}
          >
            <Settings
              aria-hidden="true"
              className={`h-[18px] w-[18px] shrink-0 md:h-4 md:w-4 ${
                pathname.startsWith("/app/settings")
                  ? "text-lp-ink-2"
                  : "text-lp-ink-3"
              }`}
            />
            Settings
          </Link>
        </nav>
        <SidebarAccountMenu />
        {isLoaded && !isSignedIn ? (
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={taskLimit}
            aria-valuenow={tasks.length}
            aria-label={`${tasks.length} of ${taskLimit} guest tasks used`}
            className="px-2.5 pt-1"
          >
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-lp-paper-4">
              <div
                className={`h-full rounded-full transition-[width] duration-300 ${
                  tasks.length >= taskLimit - 2 ? "bg-lp-accent" : "bg-lp-ink"
                }`}
                style={{
                  width: `${Math.min(100, Math.round((tasks.length / taskLimit) * 100))}%`,
                }}
              />
            </div>
            <p className="mt-1.5 font-mono text-[10px] tabular-nums tracking-wide text-lp-ink-3">
              {tasks.length}/{taskLimit} tasks
            </p>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
