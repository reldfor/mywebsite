"use client";

import type { ReactNode } from "react";
import { MobileNav } from "@/components/app/mobile-nav";
import { Sidebar } from "@/components/app/sidebar";
import { TaskDetailPanel } from "@/components/app/task-detail-panel";
import { Toast } from "@/components/app/toast";
import { TopBar } from "@/components/app/top-bar";
import { TasksProvider } from "@/features/todos/tasks-provider";
import { ThemeProvider } from "@/features/theme/theme-provider";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <TasksProvider>
        <div className="flex h-dvh flex-col bg-paper">
          <TopBar />
          <div className="flex min-h-0 flex-1 items-stretch">
            <Sidebar />
            <main
              id="main"
              className="min-w-0 flex-1 overflow-y-auto pb-24 md:pb-6"
            >
              {children}
            </main>
            <TaskDetailPanel />
          </div>
          <MobileNav />
          <Toast />
        </div>
      </TasksProvider>
    </ThemeProvider>
  );
}
