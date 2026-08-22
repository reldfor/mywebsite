"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function ViewSwitch() {
  const pathname = usePathname();
  const calendar = pathname === "/app/calendar";

  const linkClasses = (active: boolean) =>
    `rounded-full px-3 py-1 text-xs font-medium transition-colors ${
      active
        ? "bg-ink text-paper"
        : "text-ink-soft hover:text-ink"
    }`;

  return (
    <div
      role="group"
      aria-label="Schedule view"
      className="inline-flex rounded-full border border-line bg-surface p-0.5 shadow-[var(--shadow-interactive)] dark:shadow-none"
    >
      <Link
        href="/app/calendar"
        aria-current={calendar ? "page" : undefined}
        className={linkClasses(calendar)}
      >
        Calendar
      </Link>
      <Link
        href="/app/timeline"
        aria-current={calendar ? undefined : "page"}
        className={linkClasses(!calendar)}
      >
        Timeline
      </Link>
    </div>
  );
}
