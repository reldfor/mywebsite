import type { Metadata } from "next";
import { LabelTasks } from "@/components/app/label-tasks";
import { seedLabels } from "@/features/todos/seed";

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
