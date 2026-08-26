"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { CalendarClock, CheckCheck, Inbox, Settings, Sun, Tag } from "lucide-react";
import { useTasks } from "@/features/todos/tasks-provider";
import { countDueToday, countOpenTasks } from "@/features/todos/selectors";
import { useMemo } from "react";

const tabs = [
  { href: "/app", label: "Inbox", icon: Inbox, exact: true },
  { href: "/app/today", label: "Today", icon: Sun },
  { href: "/app/upcoming", label: "Upcoming", icon: CalendarClock },
  { href: "/app/completed", label: "Completed", icon: CheckCheck },
  { href: "/app/labels", label: "Labels", icon: Tag },
  { href: "/app/settings", label: "Settings", icon: Settings },
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
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[calc(12px+env(safe-area-inset-bottom))] md:hidden"
    >
      <div
        className="pointer-events-auto flex w-full max-w-[380px] rounded-full border shadow-[var(--shadow-fab)]"
        style={{
          background: "var(--lp-pill-bg)",
          borderColor: "var(--lp-pill-border)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
          boxShadow: "var(--lp-pill-shadow)",
        }}
      >
        <div className="relative grid w-full grid-cols-6 gap-0.5 p-1">
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
                className={`relative flex h-[44px] flex-col items-center justify-center gap-[3px] rounded-full transition-colors duration-200 ${
                  active ? "text-lp-paper" : "text-lp-ink-3 hover:text-lp-ink"
                }`}
              >
                {active ? (
                  <motion.div
                    layoutId="mobile-nav-pill"
                    className="absolute inset-0 rounded-full bg-lp-ink shadow-sm"
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 32,
                      mass: 0.9,
                    }}
                    initial={false}
                  />
                ) : null}
                <span className="relative z-10 flex flex-col items-center justify-center gap-[3px]">
                  <span className="relative">
                    <tab.icon
                      aria-hidden="true"
                      className={`h-[17px] w-[17px] transition-colors duration-200 ${active ? "stroke-[2.2]" : "stroke-[1.9]"}`}
                    />
                    {count > 0 ? (
                      <span
                        aria-hidden="true"
                        className={`absolute -right-1 -top-1.5 grid h-3 min-w-3 place-items-center rounded-full px-0.5 font-mono text-[7px] font-bold tabular-nums leading-none ring-1 ring-[var(--lp-pill-bg)] ${
                          active ? "bg-lp-paper text-lp-ink" : "bg-lp-ink text-lp-paper"
                        }`}
                      >
                        {count}
                      </span>
                    ) : null}
                  </span>
                  <span className="text-[9.5px] font-medium leading-none tracking-wide">
                    {tab.label}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
