import type { Label, Subtask, Task } from "./types";
import { daysFromNow } from "@/modules/tasks/domain/date";

export const seedLabels = [
  { id: "work", name: "Work", tone: "blue" },
  { id: "personal", name: "Personal", tone: "yellow" },
  { id: "errands", name: "Errands", tone: "gray" },
] as Label[];

export function createSeedTasks(now = new Date()): Task[] {
  const createdAt = now.toISOString();
  const base = {
    status: "todo" as const,
    completedAt: null,
    startDate: null,
    endDate: null,
    categoryId: null,
    createdAt,
    updatedAt: createdAt,
  };
  let position = 0;
  const nextPosition = () => ++position;
  const subtasks = (titles: string[]): Subtask[] =>
    titles.map((title, index) => ({
      id: `seed-subtask-${position}-${index + 1}`,
      title,
      completed: false,
      position: index + 1,
    }));
  return [
    {
      ...base,
      id: "seed-welcome",
      title: "Welcome to Tick — this inbox is a live tutorial",
      description:
        "The tasks below teach the basics by letting you try them for real. Everything here works like a normal task, so edit, complete, or delete lessons as you go. When you need to find something fast, use Search in the top bar, or narrow the list with Filters.",
      priority: "none",
      dueAt: null,
      labelIds: [],
      subtasks: [],
      position: nextPosition(),
    },
    {
      ...base,
      id: "seed-complete",
      title: "Check me off",
      description: "Click my circle, then find me in Completed.",
      priority: "none",
      dueAt: null,
      labelIds: ["personal"],
      subtasks: [],
      position: nextPosition(),
    },
    {
      ...base,
      id: "seed-today",
      title: "I'm due today",
      description: "You'll see me in Today — your daily focus list.",
      priority: "medium",
      dueAt: daysFromNow(0),
      labelIds: [],
      subtasks: [],
      position: nextPosition(),
    },
    {
      ...base,
      id: "seed-upcoming",
      title: "Due in three days",
      description: "Future tasks wait in Upcoming until it's their turn.",
      priority: "low",
      dueAt: daysFromNow(3),
      labelIds: [],
      subtasks: [],
      position: nextPosition(),
    },
    {
      ...base,
      id: "seed-priority",
      title: "Priorities and labels",
      description: "Open me to see my Work label and high priority up close.",
      priority: "high",
      dueAt: null,
      labelIds: ["work"],
      subtasks: [],
      position: nextPosition(),
    },
    {
      ...base,
      id: "seed-subtasks",
      title: "Big task? Break it down",
      description: "Small steps beat vague ones:",
      priority: "none",
      dueAt: null,
      labelIds: [],
      subtasks: subtasks([
        "Check me off",
        "Add one of your own in the detail panel",
        "Delete this lesson when you're done",
      ]),
      position: nextPosition(),
    },
  ];
}
