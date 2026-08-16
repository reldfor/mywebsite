"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { AddTask } from "@/components/app/add-task";
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
  todayISO,
} from "@/lib/date";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function coversDay(task: Task, day: string): boolean {
  if (!task.startDate || task.status === "archived") return false;
  const end = task.endDate ?? task.startDate;
  return task.startDate <= day && end >= day;
}

function DayPill({ task }: { task: Task }) {
  const { toggleTask, setSelectedTaskId, categories } = useTasks();
  const completed = task.status === "completed";
  const category = categories.find((cat) => cat.id === task.categoryId);
  const colors = category
    ? categoryColorClasses[category.color]
    : categoryColorClasses.gray;

  return (
    <div
      className={`flex w-full items-center gap-1 rounded-md px-1.5 py-[3px] transition-opacity ${
        colors.pill
      } ${completed ? "opacity-60" : ""}`}
    >
      <button
        type="button"
        onClick={() => toggleTask(task.id)}
        aria-label={
          completed ? `Reopen ${task.title}` : `Complete ${task.title}`
        }
        aria-pressed={completed}
        className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full border transition-colors"
      >
        {completed ? (
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-current" />
        ) : null}
      </button>
      <button
        type="button"
        onClick={() => setSelectedTaskId(task.id)}
        className={`min-w-0 flex-1 truncate rounded-sm text-left text-[11px] font-medium transition-opacity hover:opacity-70 ${
          completed ? "line-through" : ""
        }`}
      >
        {task.title}
      </button>
    </div>
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
  const weeks = useMemo(() => {
    const result: string[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [days]);

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
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex justify-end">
        <ViewSwitch />
      </div>

      <div className="mt-5">
        <AddTask date={selectedDate} />
        {selectedDate ? (
          <p className="mt-1.5 px-1 font-mono text-[10px] leading-relaxed text-pen">
            Tasks you add will be dated {formatDueShort(selectedDate)} — click a
            day to change it.
          </p>
        ) : null}
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between gap-3 border-b border-line/70 px-4 py-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setViewDate((date) => addMonths(date, -1))}
              aria-label="Previous month"
              className="grid h-8 w-8 place-items-center rounded-full border border-line bg-surface text-ink-soft transition-colors hover:border-ink/40 hover:text-ink"
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            </button>
            <h1 className="w-[150px] text-center font-display text-lg font-extrabold tracking-tight sm:text-xl">
              {monthLabel(viewDate)}
            </h1>
            <button
              type="button"
              onClick={() => setViewDate((date) => addMonths(date, 1))}
              aria-label="Next month"
              className="grid h-8 w-8 place-items-center rounded-full border border-line bg-surface text-ink-soft transition-colors hover:border-ink/40 hover:text-ink"
            >
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToToday}
              className="h-8 rounded-full border border-line bg-surface px-3 text-xs font-semibold text-ink-soft transition-colors hover:border-ink/40 hover:text-ink"
            >
              Today
            </button>
            <button
              type="button"
              onClick={focusAdd}
              aria-label="Add a task"
              className="grid h-8 w-8 place-items-center rounded-full bg-ink text-paper transition-colors hover:bg-pen"
            >
              <Plus aria-hidden="true" className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <table
          aria-label={`${monthLabel(viewDate)} calendar`}
          className="w-full border-collapse"
        >
          <thead>
            <tr>
              {weekdays.map((weekday) => (
                <th
                  key={weekday}
                  scope="col"
                  className="border-b border-line/70 py-2 text-center font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-ink-faint"
                >
                  {weekday}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, weekIndex) => (
              <tr key={weekIndex}>
                {week.map((day) => {
                  const inMonth = isSameMonth(day, viewDate);
                  const isToday = day === today;
                  const selected = day === selectedDate;
                  const tasksForDay = dayTasks.get(day) ?? [];
                  const expanded = expandedDates.has(day);
                  const visible = expanded
                    ? tasksForDay
                    : tasksForDay.slice(0, maxVisible);
                  const more = tasksForDay.length - visible.length;

                  return (
                    <td
                      key={day}
                      className={`min-w-0 border border-line/50 p-1 align-top sm:p-1.5 ${
                        inMonth ? "" : "bg-paper/60"
                      } ${isToday ? "bg-pen/[0.04]" : ""}`}
                    >
                      <button
                        type="button"
                        onClick={() => selectDay(day)}
                        aria-pressed={selected}
                        aria-label={`Select ${formatDueShort(day)}`}
                        className={`grid h-6 w-6 place-items-center rounded-full font-mono text-[11px] transition-colors ${
                          isToday
                            ? "bg-pen font-semibold text-paper"
                            : selected
                              ? "bg-pen-soft font-semibold text-pen"
                              : inMonth
                                ? "text-ink-soft hover:bg-ink/5 hover:text-ink"
                                : "text-ink-faint/60 hover:bg-ink/5 hover:text-ink-faint"
                        }`}
                      >
                        {dayOfMonth(day)}
                      </button>

                      {tasksForDay.length > 0 ? (
                        <div className="mt-1 flex flex-col gap-[3px]">
                          {visible.map((task) => (
                            <DayPill key={task.id} task={task} />
                          ))}
                          {more > 0 ? (
                            <button
                              type="button"
                              onClick={() => toggleExpand(day)}
                              className="self-start rounded px-1.5 py-0.5 font-mono text-[10px] text-ink-faint transition-colors hover:bg-ink/5 hover:text-ink"
                            >
                              {expanded ? "− fewer" : `+${more} more`}
                            </button>
                          ) : null}
                        </div>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
