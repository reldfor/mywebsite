export type Priority = "none" | "low" | "medium" | "high" | "urgent";

export type TaskStatus = "todo" | "in_progress" | "completed" | "archived";

export type LabelTone = "pen" | "marker" | "gray";

export type CategoryColor =
  | "blue"
  | "cyan"
  | "green"
  | "pink"
  | "yellow"
  | "gray";

export type CategoryIcon =
  | "package"
  | "palette"
  | "terminal"
  | "zap"
  | "flask"
  | "list";

export type Category = {
  id: string;
  name: string;
  icon: CategoryIcon;
  color: CategoryColor;
};

export type Label = {
  id: string;
  name: string;
  tone: LabelTone;
};

export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
  position: number;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueAt: string | null;
  completedAt: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
  labelIds: string[];
  subtasks: Subtask[];
  categoryId: string | null;
  startDate: string | null;
  endDate: string | null;
};

export type View = "inbox" | "today" | "upcoming" | "completed";

export type SortKey = "manual" | "due" | "priority" | "created" | "updated";

export type Filters = {
  statuses: Array<"open" | "completed" | "archived">;
  priorities: Priority[];
  due: "all" | "today" | "overdue" | "upcoming" | "none";
  labelIds: string[];
};
