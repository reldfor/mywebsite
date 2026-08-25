"use client";

import { useState, type ReactNode } from "react";
import { MobileNav } from "@/components/app/mobile-nav";
import { Sidebar } from "@/components/app/sidebar";
import { TaskDetailPanel } from "@/components/app/task-detail/task-detail-panel";
import { Toast } from "@/components/app/toast";
import { TopBar } from "@/components/app/top-bar";
import { TasksProvider } from "@/features/todos/tasks-provider";
import { ThemeProvider } from "@/features/theme/theme-provider";

export default function AppLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  function toggleSidebar() {
    setSidebarOpen((open) => !open);
  }

  return (
    <ThemeProvider>
      <TasksProvider>
        <div className="app-inter flex h-dvh overflow-hidden bg-lp-paper">
          <Sidebar open={sidebarOpen} onCollapse={toggleSidebar} />
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <TopBar sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
            <div className="flex min-h-0 flex-1 items-stretch">
              <main
                id="main"
                className="min-w-0 flex-1 overflow-y-auto pb-[calc(88px+env(safe-area-inset-bottom))] md:pb-6"
              >
                {children}
              </main>
              <TaskDetailPanel />
            </div>
          </div>
          <MobileNav />
          <Toast />
        </div>
      </TasksProvider>
    </ThemeProvider>
  );
}
