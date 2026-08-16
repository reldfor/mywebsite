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
      className={`grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-ink/40 ${className}`}
    >
      {dark ? (
        <Sun aria-hidden="true" className="h-4.5 w-4.5 animate-pop-in" />
      ) : (
        <Moon aria-hidden="true" className="h-4.5 w-4.5 animate-pop-in" />
      )}
    </button>
  );
}
