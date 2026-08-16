"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function ViewSwitch() {
  const pathname = usePathname();
  const calendar = pathname === "/app/calendar";

  const linkClasses = (active: boolean) =>
    `rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
      active
        ? "bg-surface text-ink shadow-sm"
        : "text-ink-soft hover:text-ink"
    }`;

  return (
    <div
      role="group"
      aria-label="Schedule view"
      className="inline-flex rounded-full bg-ink/5 p-0.5"
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
