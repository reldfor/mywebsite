"use client";

import { PanelLeftOpen } from "lucide-react";

type TopBarProps = {
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
};

export function TopBar({ sidebarOpen = true, onToggleSidebar }: TopBarProps) {
  return (
    <header
      className={`sticky top-0 z-40 flex border-b border-lp-rule/60 md:border-b-0 ${sidebarOpen ? "md:hidden" : ""}`}
      style={{
        background: "var(--lp-nav-bg)",
        backdropFilter: "saturate(140%) blur(10px)",
        WebkitBackdropFilter: "saturate(140%) blur(10px)",
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      <div className="mx-auto flex h-14 w-full max-w-none items-center gap-3 px-4 sm:px-6 md:h-[56px]">
        <div className="flex items-center gap-2">
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
          <span className="font-mono text-[11px] font-medium tracking-wide text-lp-ink-2 md:hidden">
            Tick
          </span>
        </div>
      </div>
    </header>
  );
}
