"use client";

import { useState } from "react";

type LabelId = "work" | "personal" | "errand" | "side";
type Priority = "high" | "med" | "low";

type MockSubtask = {
  id: string;
  title: string;
};

type MockTask = {
  id: string;
  title: string;
  initialDone?: boolean;
  time?: string;
  lateTag?: string;
  priority?: Priority;
  labels?: LabelId[];
  subtasks?: MockSubtask[];
};

const OVERDUE_TASKS: MockTask[] = [
  {
    id: "budget",
    title: "Reply to Maya about the Q4 budget",
    initialDone: true,
    lateTag: "2h late",
  },
];

const TODAY_TASKS: MockTask[] = [
  {
    id: "brief",
    title: "Send the brief to Sam",
    initialDone: true,
    labels: ["work"],
  },
  {
    id: "okrs",
    title: "Draft Q3 OKRs",
    priority: "high",
    time: "14:00",
    labels: ["work"],
    subtasks: [
      { id: "okr-1", title: "Outline three pillars" },
      { id: "okr-2", title: "Add metrics" },
      { id: "okr-3", title: "Review with team" },
    ],
  },
  {
    id: "cleaning",
    title: "Pick up dry cleaning",
    priority: "low",
    labels: ["personal", "errand"],
  },
  {
    id: "pr",
    title: "Review PR #482 — auth refactor",
    priority: "med",
    time: "16:30",
    labels: ["work"],
  },
  {
    id: "domain",
    title: "Renew tick.dev domain",
    priority: "high",
    labels: ["side"],
  },
];

const LABEL_COUNTS: Array<{ id: LabelId; name: string; count: number }> = [
  { id: "work", name: "Work", count: 9 },
  { id: "personal", name: "Personal", count: 4 },
  { id: "errand", name: "Errand", count: 2 },
  { id: "side", name: "Side", count: 3 },
];

function ViewIcon({ view }: { view: string }) {
  const common = {
    viewBox: "0 0 24 24",
    width: 12,
    height: 12,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (view) {
    case "today":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "upcoming":
      return (
        <svg {...common}>
          <path d="m6 17 5-5-5-5" />
          <path d="m13 17 5-5-5-5" />
        </svg>
      );
    case "inbox":
      return (
        <svg {...common}>
          <path d="M22 12h-6l-2 3h-4l-2-3H2" />
          <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        </svg>
      );
    case "completed":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="m8 12 3 3 5-6" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
        </svg>
      );
  }
}

function SidebarItem({
  icon,
  label,
  count,
  active = false,
}: {
  icon?: string;
  label: string;
  count?: number;
  active?: boolean;
}) {
  return (
    <div className={`sidebar-item${active ? " active" : ""}`}>
      {icon && <ViewIcon view={icon} />}
      {label}
      {typeof count === "number" && <span className="count">{count}</span>}
    </div>
  );
}

export function AppMockup() {
  const [doneTasks, setDoneTasks] = useState<Set<string>>(
    () => new Set(OVERDUE_TASKS.concat(TODAY_TASKS).filter((t) => t.initialDone).map((t) => t.id)),
  );
  const [doneSubtasks, setDoneSubtasks] = useState<Set<string>>(() => new Set(["okr-1", "okr-2"]));

  function toggleTask(id: string) {
    setDoneTasks((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleSubtask(id: string) {
    setDoneSubtasks((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function renderTask(task: MockTask) {
    const done = doneTasks.has(task.id);
    const subtaskTotal = task.subtasks?.length ?? 0;
    const subtaskDone = task.subtasks?.filter((s) => doneSubtasks.has(s.id)).length ?? 0;

    return (
      <div key={task.id} className={`task-row${done ? " done" : ""}`}>
        <button
          type="button"
          role="checkbox"
          aria-checked={done}
          aria-label={`Toggle task: ${task.title}`}
          className="checkbox"
          onClick={() => toggleTask(task.id)}
        />
        <div className="task-content">
          <div className="task-title">{task.title}</div>
          {(task.lateTag || task.time || task.priority || task.labels || subtaskTotal > 0) && (
            <div className="task-meta">
              {task.priority && <span className={`priority-dot ${task.priority}`} />}
              {task.lateTag && <span className="task-time overdue">{task.lateTag}</span>}
              {task.time && !task.lateTag && <span className="task-time">{task.time}</span>}
              {task.labels?.map((label) => (
                <span key={label} className={`task-label ${label}`}>
                  {label}
                </span>
              ))}
              {subtaskTotal > 0 && (
                <span className="subtask-progress">
                  {subtaskDone}/{subtaskTotal}
                </span>
              )}
            </div>
          )}
          {task.subtasks && (
            <div className="subtasks">
              {task.subtasks.map((sub) => {
                const subDone = doneSubtasks.has(sub.id);
                return (
                  <div key={sub.id} className={`subtask${subDone ? " done" : ""}`}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={subDone}
                      aria-label={`Toggle subtask: ${sub.title}`}
                      className="mini-check"
                      onClick={() => toggleSubtask(sub.id)}
                    />
                    <span>{sub.title}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <span className="task-drag" aria-hidden="true">
          ⠿
        </span>
      </div>
    );
  }

  return (
    <div>
      <div className="mockup">
        <div className="mockup-chrome">
          <span className="chrome-dot" />
          <span className="chrome-dot" />
          <span className="chrome-dot" />
          <span className="chrome-title">tick.app — Today</span>
        </div>
        <div className="app-grid">
          <aside className="app-sidebar">
            <div className="sidebar-brand">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M7 12 L10 15 L17 8"
                  className="stroke-lp-accent"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Tick
            </div>
            <div className="sidebar-search">
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input placeholder="Search" readOnly aria-hidden="true" tabIndex={-1} />
              <kbd>⌘K</kbd>
            </div>
            <div className="sidebar-section">
              <h5>Views</h5>
              <SidebarItem icon="today" label="Today" count={6} active />
              <SidebarItem icon="upcoming" label="Upcoming" count={12} />
              <SidebarItem icon="inbox" label="Inbox" count={3} />
              <SidebarItem icon="completed" label="Completed" count={28} />
              <SidebarItem icon="settings" label="Settings" />
            </div>
            <div className="sidebar-section">
              <h5>Labels</h5>
              {LABEL_COUNTS.map((label) => (
                <div key={label.id} className="sidebar-item">
                  <span
                    className="label-dot"
                    style={{ background: `var(--lp-label-${label.id})` }}
                  />
                  {label.name}
                  <span className="count">{label.count}</span>
                </div>
              ))}
            </div>
            <div className="sidebar-footer">
              <div>7 / 10 tasks</div>
              <div className="meter">
                <span />
              </div>
            </div>
          </aside>

          <div className="app-main">
            <div className="main-header">
              <h3>Today</h3>
              <div className="date">Tue, 14 Oct · 6 tasks · 2 done</div>
            </div>
            <div className="main-controls">
              <span className="control-pill">
                Sort: Priority <span className="chev">⌄</span>
              </span>
              <span className="control-pill">
                Filter: All <span className="chev">⌄</span>
              </span>
              <span className="count">6 of 6</span>
            </div>
            <div className="task-list">
              <div className="task-group overdue">
                Overdue <span className="group-line" />
              </div>
              {OVERDUE_TASKS.map(renderTask)}
              <div className="task-group">
                Today <span className="group-line" />
              </div>
              {TODAY_TASKS.map(renderTask)}
            </div>
            <div className="composer">
              <span className="composer-plus">+</span>
              <input className="composer-input" placeholder="Type and press enter…" readOnly aria-hidden="true" tabIndex={-1} />
              <kbd>⌘↵</kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
