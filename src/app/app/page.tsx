import type { Metadata } from "next";
import { TaskList } from "@/components/app/task-list";

export const metadata: Metadata = {
  title: "Inbox — Tick",
  description: "Your open tasks in one place.",
};

export default function InboxPage() {
  return <TaskList view="inbox" />;
}
