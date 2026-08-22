"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  CalendarClock,
  CheckCheck,
  Inbox,
  Settings,
  Sun,
  Timeline,
} from "lucide-react";
import { useTasks } from "@/features/todos/tasks-provider";
import { countDueToday, countOpenTasks } from "@/features/todos/selectors";
import { useMemo } from "react";

const primaryNav = [
  { href: "/app", label: "Inbox", icon: Inbox, exact: true },
  { href: "/app/today", label: "Today", icon: Sun },
  { href: "/app/upcoming", label: "Upcoming", icon: CalendarClock },
  { href: "/app/completed", label: "Completed", icon: CheckCheck },
  { href: "/app/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/app/timeline", label: "Timeline", icon: Timeline },
];

export function Sidebar() {
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
    <aside className="hidden w-[220px] shrink-0 flex-col border-r border-line bg-paper px-3 py-4 md:flex lg:w-[240px]">
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
        <p className="px-2.5 font-mono text-[10px] leading-relaxed tabular-nums text-ink-faint">
          Guest workspace · up to 10 tasks
          <br />
          Sync connects in a later build
        </p>
      </div>
    </aside>
  );
}
