"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { ViewSwitch } from "@/components/app/view-switch";
import { categoryColorClasses } from "@/components/app/task-colors";
import { useTasks } from "@/features/todos/tasks-provider";
import type { Task } from "@/features/todos/types";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import {
  addMonths,
  buildMonthDays,
  dayOfMonth,
  formatDueShort,
  isSameMonth,
  monthLabel,
  startOfMonth,
  timeOf,
  todayISO,
} from "@/lib/date";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function coversDay(task: Task, day: string): boolean {
  if (!task.startDate || task.status === "archived") return false;
  const end = task.endDate ?? task.startDate;
  return task.startDate <= day && end >= day;
}

function DayPill({ task }: { task: Task }) {
  const { setSelectedTaskId, categories } = useTasks();
  const completed = task.status === "completed";
  const category = categories.find((cat) => cat.id === task.categoryId);
  const colors = category
    ? categoryColorClasses[category.color]
    : categoryColorClasses.gray;
  const time = task.dueAt ? timeOf(task.dueAt) : null;

  return (
    <button
      type="button"
      onClick={() => setSelectedTaskId(task.id)}
      title={task.title}
      className={`flex w-full min-w-0 items-center gap-1.5 rounded-md border border-line bg-surface px-1.5 py-1 text-left transition-colors hover:border-ink/15 ${
        completed ? "opacity-50" : ""
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${colors.dot}`}
      />
      <span
        className={`min-w-0 flex-1 truncate text-xs font-medium text-ink ${
          completed ? "line-through" : ""
        }`}
      >
        {task.title}
      </span>
      {time ? (
        <span className="shrink-0 font-mono text-[10px] tabular-nums text-ink-faint">
          {time}
        </span>
      ) : null}
    </button>
  );
}

export function CalendarView() {
  const { tasks, addTaskInputRef } = useTasks();
  const isDesktop = useIsDesktop();
  const [viewDate, setViewDate] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<string | null>(todayISO());
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

  const today = todayISO();
  const days = useMemo(() => buildMonthDays(viewDate), [viewDate]);

  const dayTasks = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const day of days) {
      map.set(day, tasks.filter((task) => coversDay(task, day)));
    }
    return map;
  }, [days, tasks]);

  const maxVisible = isDesktop ? 4 : 3;

  function selectDay(day: string) {
    setSelectedDate((current) => (current === day ? null : day));
  }

  function toggleExpand(day: string) {
    setExpandedDates((current) => {
      const next = new Set(current);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  }

  function goToToday() {
    const todayDate = startOfMonth(new Date());
    setViewDate(todayDate);
    setSelectedDate(todayISO());
  }

  function focusAdd() {
    addTaskInputRef.current?.focus();
  }

  return (
    <div className="mx-auto w-full max-w-[880px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex justify-end">
        <ViewSwitch />
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-line bg-surface">
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setViewDate((date) => addMonths(date, -1))}
              aria-label="Previous month"
              className="grid h-8 w-8 place-items-center rounded-full border border-line bg-surface text-ink-soft transition-colors hover:border-ink/15 hover:text-ink"
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            </button>
            <h1 className="w-[150px] text-center text-[15px] font-semibold tracking-[-0.01em] sm:text-[16px]">
              {monthLabel(viewDate)}
            </h1>
            <button
              type="button"
              onClick={() => setViewDate((date) => addMonths(date, 1))}
              aria-label="Next month"
              className="grid h-8 w-8 place-items-center rounded-full border border-line bg-surface text-ink-soft transition-colors hover:border-ink/15 hover:text-ink"
            >
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToToday}
              className="h-8 rounded-full border border-line bg-surface px-3 text-xs font-medium text-ink-soft transition-colors hover:border-ink/15 hover:text-ink"
            >
              Today
            </button>
            <button
              type="button"
              onClick={focusAdd}
              aria-label="Add a task"
              className="grid h-8 w-8 place-items-center rounded-full bg-ink text-paper transition-colors hover:bg-ink/90"
            >
              <Plus aria-hidden="true" className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div
          aria-label={`${monthLabel(viewDate)} calendar`}
          className="grid grid-cols-7 gap-px bg-line"
        >
          {weekdays.map((weekday) => (
            <div
              key={weekday}
              className="bg-surface py-2 text-center text-[11px] font-medium uppercase tracking-[0.06em] text-ink-faint"
            >
              {weekday}
            </div>
          ))}
          {days.map((day) => {
            const inMonth = isSameMonth(day, viewDate);
            const isToday = day === today;
            const selected = day === selectedDate;
            const tasksForDay = dayTasks.get(day) ?? [];
            const expanded = expandedDates.has(day);
            const visible = expanded
              ? tasksForDay
              : tasksForDay.slice(0, maxVisible);
            const more = tasksForDay.length - visible.length;
            const cellBg = isToday
              ? "bg-ink/[0.03]"
              : inMonth
                ? "bg-surface"
                : "bg-paper";

            return (
              <div
                key={day}
                className={`min-h-[5rem] min-w-0 p-1 sm:p-1.5 ${cellBg}`}
              >
                <button
                  type="button"
                  onClick={() => selectDay(day)}
                  aria-pressed={selected}
                  aria-label={`Select ${formatDueShort(day)}`}
                  className={`grid h-7 w-7 place-items-center rounded-full text-[13px] font-medium tabular-nums transition-colors ${
                    isToday
                      ? "bg-ink font-semibold text-paper"
                      : selected
                        ? "bg-ink/[0.06] font-medium text-ink"
                        : inMonth
                          ? "text-ink-soft hover:bg-ink/[0.04] hover:text-ink"
                          : "text-ink-faint/50 hover:bg-ink/[0.04] hover:text-ink-faint"
                  }`}
                >
                  {dayOfMonth(day)}
                </button>

                {tasksForDay.length > 0 ? (
                  <div className="mt-1 flex flex-col gap-1">
                    {visible.map((task) => (
                      <DayPill key={task.id} task={task} />
                    ))}
                    {more > 0 ? (
                      <button
                        type="button"
                        onClick={() => toggleExpand(day)}
                        aria-expanded={expanded}
                        className="self-start rounded px-1.5 py-1 text-xs font-medium text-ink-faint transition-colors hover:bg-ink/[0.04] hover:text-ink"
                      >
                        {expanded ? "− fewer" : `+${more} more`}
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
