import type { Metadata } from "next";
import { TimelineView } from "@/components/app/timeline-view";

export const metadata: Metadata = {
  title: "Timeline — Tick",
  description: "Your work across categories, laid out over time.",
};

export default function TimelinePage() {
  return <TimelineView />;
}
