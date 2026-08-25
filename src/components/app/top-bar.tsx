"use client";

import { PanelLeftOpen } from "lucide-react";

type TopBarProps = {
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
};

export function TopBar({ sidebarOpen = true, onToggleSidebar }: TopBarProps) {
  return (
    <header
      className="sticky top-0 z-40"
      style={{
        background: "var(--lp-nav-bg)",
        backdropFilter: "saturate(140%) blur(10px)",
        WebkitBackdropFilter: "saturate(140%) blur(10px)",
      }}
    >
      <div className="mx-auto flex h-[56px] w-full max-w-none items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center">
          {!sidebarOpen && onToggleSidebar ? (
            <button
              type="button"
              onClick={onToggleSidebar}
              aria-label="Show sidebar"
              className="animate-sidebar-toggle-in hidden h-9 w-9 place-items-center rounded-full border border-lp-rule bg-lp-paper-2 text-lp-ink-2 shadow-[var(--lp-shadow-interactive)] transition-colors hover:border-[color-mix(in_srgb,var(--lp-ink)_20%,transparent)] hover:text-lp-ink hover:bg-lp-paper md:grid"
            >
              <PanelLeftOpen aria-hidden="true" className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="flex items-center gap-1.5" />
      </div>
    </header>
  );
}
