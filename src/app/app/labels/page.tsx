import type { Metadata } from "next";
import { LabelsView } from "@/components/app/labels-view";

export const metadata: Metadata = {
  title: "Labels — Tick",
  description: "Organize tasks with labels.",
};

export default function LabelsPage() {
  return <LabelsView />;
}
