import type { Metadata } from "next";
import { TaskList } from "@/components/app/task-list";

export const metadata: Metadata = {
  title: "Completed — Tick",
  description: "Tasks you've finished, plus anything archived.",
};

export default function CompletedPage() {
  return <TaskList view="completed" />;
}
