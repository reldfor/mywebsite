import type { Metadata } from "next";
import { LabelsView } from "@/modules/app-chrome/components/labels-view";

export const metadata: Metadata = {
  title: "Labels — Tick",
  description: "Organize tasks with labels.",
};

export default function LabelsPage() {
  return <LabelsView />;
}
