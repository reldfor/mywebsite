import type { Metadata } from "next";
import { TaskList } from "@/modules/app-chrome/components/task-list";

export const metadata: Metadata = {
  title: "Today — Tick",
  description: "Tasks due today or overdue.",
};

export default function TodayPage() {
  return <TaskList view="today" />;
}
