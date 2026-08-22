"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarClock,
  CalendarDays,
  CheckCheck,
  Inbox,
  Sun,
  Timeline,
} from "lucide-react";
import { useTasks } from "@/features/todos/tasks-provider";
import { countDueToday, countOpenTasks } from "@/features/todos/selectors";
import { useMemo } from "react";

const tabs = [
  { href: "/app", label: "Inbox", icon: Inbox, exact: true },
  { href: "/app/today", label: "Today", icon: Sun },
  { href: "/app/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/app/timeline", label: "Timeline", icon: Timeline },
  { href: "/app/upcoming", label: "Upcoming", icon: CalendarClock },
  { href: "/app/completed", label: "Completed", icon: CheckCheck },
];

export function MobileNav() {
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
    <nav
      aria-label="Tasks"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-[8px] md:hidden"
    >
      <div className="grid grid-cols-6">
        {tabs.map((tab) => {
          const active =
            tab.exact === true ? pathname === tab.href : pathname.startsWith(tab.href);
          const count =
            tab.label === "Inbox" ? counts.inbox : tab.label === "Today" ? counts.today : 0;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={navigate}
              aria-current={active ? "page" : undefined}
              className={`relative flex h-[56px] flex-col items-center justify-center gap-1 transition-colors ${
                active ? "text-ink" : "text-ink-faint hover:text-ink"
              }`}
            >
              <span className="relative">
                <tab.icon aria-hidden="true" className={`h-[18px] w-[18px] ${active ? "stroke-[2.2]" : ""}`} />
                {count > 0 ? (
                  <span
                    aria-hidden="true"
                    className="absolute -right-1.5 -top-1 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-ink px-0.5 font-mono text-[8px] font-medium tabular-nums leading-none text-paper"
                  >
                    {count}
                  </span>
                ) : null}
              </span>
              <span className={`text-[10px] ${active ? "font-semibold" : "font-medium"}`}>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
