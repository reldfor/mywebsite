"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { Logo } from "@/components/landing/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/app/menus";
import { useTasks } from "@/features/todos/tasks-provider";

const viewLabels: Record<string, string> = {
  "/app": "Inbox",
  "/app/today": "Today",
  "/app/upcoming": "Upcoming",
  "/app/completed": "Completed",
  "/app/calendar": "Calendar",
  "/app/timeline": "Timeline",
  "/app/settings": "Settings",
};

export function TopBar() {
  const { searchOpen, setSearchOpen, searchQuery, setSearchQuery } = useTasks();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [expanded, setExpanded] = useState(false);

  const viewLabel = viewLabels[pathname] ?? (pathname.startsWith("/app") ? "Workspace" : "");

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
    <header className="sticky top-0 z-40 border-b border-line bg-paper/80 backdrop-blur-[8px]">
      <div className="mx-auto flex h-[56px] w-full max-w-none items-center justify-between gap-3 px-4 sm:px-6">
        <div className={expanded ? "hidden" : ""}>
          <Logo />
        </div>

        <div
          className={
            expanded || !viewLabel
              ? "hidden"
              : "hidden min-w-0 flex-1 items-center justify-center md:flex"
          }
        >
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-[13px] text-ink-soft">
              <li className="text-ink-faint">Workspace</li>
              <li aria-hidden="true" className="text-ink-faint">
                /
              </li>
              <li className="truncate font-medium text-ink">{viewLabel}</li>
            </ol>
          </nav>
        </div>

        <div className={expanded ? "flex-1" : "hidden"}>
          <div className="mx-auto flex h-9 w-full max-w-xl items-center gap-2 rounded-full border border-line bg-surface px-3 transition-colors focus-within:border-ink/20">
            <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-faint" />
            <input
              ref={inputRef}
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search tasks"
              aria-label="Search tasks"
              className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-faint"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-faint transition-colors hover:bg-ink/[0.04] hover:text-ink"
              >
                <X aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={closeSearch}
                aria-label="Close search"
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-faint transition-colors hover:bg-ink/[0.04] hover:text-ink"
              >
                <X aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {!expanded ? (
            <button
              type="button"
              onClick={openSearch}
              aria-label="Open search"
              className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-ink-soft transition-colors hover:border-ink/15 hover:text-ink"
            >
              <Search aria-hidden="true" className="h-4 w-4" />
            </button>
          ) : null}
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
