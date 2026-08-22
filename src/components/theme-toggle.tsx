"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/features/theme/theme-provider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={`grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-ink-soft shadow-[var(--shadow-interactive)] transition-colors hover:border-ink/15 hover:text-ink dark:shadow-none ${className}`}
    >
      {dark ? (
        <Sun aria-hidden="true" className="h-4 w-4 animate-pop-in" />
      ) : (
        <Moon aria-hidden="true" className="h-4 w-4 animate-pop-in" />
      )}
    </button>
  );
}
