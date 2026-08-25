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
      className={`grid h-9 w-9 place-items-center rounded-full border border-lp-rule bg-lp-paper-2 text-lp-ink-2 shadow-[var(--lp-shadow-interactive)] transition-colors hover:border-[color-mix(in_srgb,var(--lp-ink)_20%,transparent)] hover:text-lp-ink hover:bg-lp-paper ${className}`}
    >
      {dark ? (
        <Sun aria-hidden="true" className="h-4 w-4 animate-pop-in" />
      ) : (
        <Moon aria-hidden="true" className="h-4 w-4 animate-pop-in" />
      )}
    </button>
  );
}
