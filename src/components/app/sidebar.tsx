"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarClock,
  CheckCheck,
  Inbox,
  PanelLeftClose,
  Settings,
  Sun,
  Tag,
} from "lucide-react";
import { useTasks } from "@/features/todos/tasks-provider";
import { countDueToday, countOpenTasks } from "@/features/todos/selectors";
import { useMemo } from "react";

const primaryNav = [
  { href: "/app", label: "Inbox", icon: Inbox, exact: true },
  { href: "/app/today", label: "Today", icon: Sun },
  { href: "/app/upcoming", label: "Upcoming", icon: CalendarClock },
  { href: "/app/completed", label: "Completed", icon: CheckCheck },
  { href: "/app/labels", label: "Label", icon: Tag },
];

type SidebarProps = {
  open?: boolean;
  onCollapse?: () => void;
};

export function Sidebar({ open = true, onCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { tasks, setSelectedTaskId, setSearchQuery, setSearchOpen } = useTasks();

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
  }

  return (
    <aside
      inert={!open}
      className={`sidebar-shell hidden w-[220px] shrink-0 flex-col border-r border-line bg-paper px-4 py-4 md:flex lg:w-[240px] ${
        open ? "is-open" : ""
      }`}
    >
      {onCollapse ? (
        <div className="flex pb-2">
          <button
            type="button"
            onClick={onCollapse}
            aria-label="Hide sidebar"
            className="grid h-9 w-9 place-items-center rounded-lg text-ink-faint transition-colors hover:bg-ink/[0.04] hover:text-ink"
          >
            <PanelLeftClose aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      ) : null}
      <nav aria-label="Tasks" className="flex flex-col gap-0.5">
        {primaryNav.map((item) => {
          const active =
            item.exact === true ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={navigate}
              aria-current={active ? "page" : undefined}
              className={`flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-colors ${
                active
                  ? "bg-ink text-paper"
                  : "text-ink-soft hover:bg-ink/[0.04] hover:text-ink"
              }`}
            >
              <item.icon
                aria-hidden="true"
                className={`h-4 w-4 shrink-0 ${active ? "text-paper" : "text-ink-faint"}`}
              />
              <span className="flex-1 truncate">{item.label}</span>
              {item.label === "Inbox" && counts.inbox > 0 ? (
                <span
                  className={`font-mono text-[11px] tabular-nums font-medium ${
                    active ? "text-paper/60" : "text-ink-faint"
                  }`}
                >
                  {counts.inbox}
                </span>
              ) : null}
              {item.label === "Today" && counts.today > 0 ? (
                <span
                  className={`font-mono text-[11px] tabular-nums font-medium ${
                    active ? "text-paper/60" : "text-ink-faint"
                  }`}
                >
                  {counts.today}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-3 pb-1 pt-6">
        <nav aria-label="Account">
          <Link
            href="/app/settings"
            onClick={navigate}
            aria-current={pathname.startsWith("/app/settings") ? "page" : undefined}
            className={`flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-colors ${
              pathname.startsWith("/app/settings")
                ? "bg-ink text-paper"
                : "text-ink-soft hover:bg-ink/[0.04] hover:text-ink"
            }`}
          >
            <Settings
              aria-hidden="true"
              className={`h-4 w-4 shrink-0 ${
                pathname.startsWith("/app/settings")
                  ? "text-paper"
                  : "text-ink-faint"
              }`}
            />
            Settings
          </Link>
        </nav>
      </div>
    </aside>
  );
}
