"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Sidebar } from "@/modules/app-chrome/components/sidebar";
import { TaskDetailPanel } from "@/modules/app-chrome/components/task-detail/task-detail-panel";
import { Toast } from "@/modules/app-chrome/components/toast";
import { TopBar } from "@/modules/app-chrome/components/top-bar";
import { TasksProvider } from "@/modules/tasks/store/tasks-provider";
import { ThemeProvider } from "@/modules/theme/theme-provider";
import { useIsDesktop } from "@/modules/shared/hooks/use-is-desktop";

export default function AppLayout({ children }: { children: ReactNode }) {
  const isDesktop = useIsDesktop();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isDesktop) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSidebarOpen(false);
    }
  }, [isDesktop]);

  function toggleSidebar() {
    setSidebarOpen((open) => !open);
  }

  return (
    <ThemeProvider>
      <TasksProvider>
        <div className="app-inter flex h-dvh overflow-hidden bg-lp-paper">
          <Sidebar open={sidebarOpen} onCollapse={toggleSidebar} />
          {sidebarOpen ? (
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={toggleSidebar}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] md:hidden"
            />
          ) : null}
          <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
            <TopBar sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
            <div className="flex min-h-0 flex-1 items-stretch">
              <main id="main" className="min-w-0 flex-1 overflow-y-auto pb-6">
                {children}
              </main>
              <TaskDetailPanel />
            </div>
          </div>
          <Toast />
        </div>
      </TasksProvider>
    </ThemeProvider>
  );
}
