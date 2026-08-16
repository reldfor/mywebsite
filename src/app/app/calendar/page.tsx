import type { Metadata } from "next";
import { CalendarView } from "@/components/app/calendar-view";

export const metadata: Metadata = {
  title: "Calendar — Tick",
  description: "Your month at a glance.",
};

export default function CalendarPage() {
  return <CalendarView />;
}
