"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Logo } from "@/components/landing/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/app/menus";
import { useTasks } from "@/features/todos/tasks-provider";

export function TopBar() {
  const { searchOpen, setSearchOpen, searchQuery, setSearchQuery } = useTasks();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    inputRef.current?.focus();
  }, [expanded]);

  useEffect(() => {
    if (!searchOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSearchQuery("");
        setSearchOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [searchOpen, setSearchQuery, setSearchOpen]);

  function openSearch() {
    setSearchOpen(true);
    setExpanded(true);
  }

  function closeSearch() {
    setSearchQuery("");
    setSearchOpen(false);
    setExpanded(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className={expanded ? "hidden" : ""}>
          <Logo />
        </div>

        <div className={expanded ? "flex-1" : "hidden"}>
          <div className="mx-auto flex h-10 w-full max-w-xl items-center gap-2.5 rounded-full border border-line bg-surface px-3.5 transition-colors focus-within:border-pen">
            <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-faint" />
            <input
              ref={inputRef}
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search tasks"
              aria-label="Search tasks"
              className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-faint transition-colors hover:bg-ink/5 hover:text-ink"
              >
                <X aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={closeSearch}
                aria-label="Close search"
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-faint transition-colors hover:bg-ink/5 hover:text-ink"
              >
                <X aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!expanded ? (
            <button
              type="button"
              onClick={openSearch}
              aria-label="Open search"
              className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-ink/40"
            >
              <Search aria-hidden="true" className="h-4.5 w-4.5" />
            </button>
          ) : null}
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
