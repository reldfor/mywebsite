import type { Metadata } from "next";
import { LabelTasks } from "@/modules/app-chrome/components/label-tasks";
import { seedLabels } from "@/modules/tasks/domain/seed";

export const metadata: Metadata = {
  title: "Label — Tick",
  description: "Tasks for this label.",
};

export function generateStaticParams() {
  return seedLabels.map((label) => ({ labelId: label.id }));
}

export default async function LabelPage({
  params,
}: {
  params: Promise<{ labelId: string }>;
}) {
  const { labelId } = await params;
  return <LabelTasks labelId={labelId} />;
}
