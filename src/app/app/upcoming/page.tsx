import type { Metadata } from "next";
import { TaskList } from "@/components/app/task-list";

export const metadata: Metadata = {
  title: "Upcoming — Tick",
  description: "Tasks with a future due date.",
};

export default function UpcomingPage() {
  return <TaskList view="upcoming" />;
}
