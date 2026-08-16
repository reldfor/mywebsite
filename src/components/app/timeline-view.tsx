"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { ViewSwitch } from "@/components/app/view-switch";
import {
  CategoryIconComponent,
  categoryColorClasses,
} from "@/components/app/task-colors";
import { useTasks } from "@/features/todos/tasks-provider";
import type { Category, Task } from "@/features/todos/types";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import {
  addMonths,
  buildMonthDays,
  dayOfMonth,
  isSameMonth,
  monthLabel,
  startOfMonth,
  todayISO,
  weekdayOf,
} from "@/lib/date";

const BAR_HEIGHT = 26;
const LANE_GAP = 36;
const ROW_PAD_TOP = 8;
const OTHER_ROW_ID = "__other";

type Bar = {
  task: Task;
  startIdx: number;
  endIdx: number;
  lane: number;
};

function packBars(rowTasks: Task[], dayIndex: Map<string, number>, last: number): Bar[] {
  const bars: Bar[] = [];
  for (const task of rowTasks) {
    if (!task.startDate) continue;
    const startIdx = dayIndex.get(task.startDate);
    const endIdx = dayIndex.get(task.endDate ?? task.startDate);
    if (startIdx === undefined && endIdx === undefined) continue;
    const start = startIdx ?? 0;
    const end = endIdx ?? last;
    if (start > last || end < 0) continue;
    bars.push({
      task,
      startIdx: Math.max(0, start),
      endIdx: Math.min(last, end),
      lane: -1,
    });
  }
  bars.sort((a, b) => a.startIdx - b.startIdx || a.endIdx - b.endIdx);
  for (const bar of bars) {
    let lane = 0;
    while (bars.some((other) => other.lane === lane && bar.startIdx <= other.endIdx)) {
      lane++;
    }
    bar.lane = lane;
  }
  return bars;
}

export function TimelineView() {
  const { tasks, categories, setSelectedTaskId } = useTasks();
  const isDesktop = useIsDesktop();
  const [viewDate, setViewDate] = useState(() => startOfMonth(new Date()));
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const colW = isDesktop ? 96 : 64;
  const today = todayISO();

  const days = useMemo(() => buildMonthDays(viewDate), [viewDate]);
  const dayIndex = useMemo(() => {
    const map = new Map<string, number>();
    days.forEach((day, index) => map.set(day, index));
    return map;
  }, [days]);
  const last = days.length - 1;

  const inWindow = useMemo(
    () =>
      tasks.filter(
        (task) =>
          task.status !== "archived" &&
          task.startDate !== null &&
          dayIndex.has(task.startDate),
      ),
    [tasks, dayIndex],
  );

  const rows = useMemo(() => {
    const result: Array<{
      id: string;
      name: string;
      icon: Category["icon"];
      color: Category["color"];
      bars: Bar[];
    }> = [];
    for (const category of categories) {
      const rowTasks = inWindow.filter((task) => task.categoryId === category.id);
      result.push({
        id: category.id,
        name: category.name,
        icon: category.icon,
        color: category.color,
        bars: packBars(rowTasks, dayIndex, last),
      });
    }
    const otherTasks = inWindow.filter(
      (task) => !categories.some((category) => category.id === task.categoryId),
    );
    if (otherTasks.length > 0) {
      result.push({
        id: OTHER_ROW_ID,
        name: "Other",
        icon: "list",
        color: "gray",
        bars: packBars(otherTasks, dayIndex, last),
      });
    }
    return result;
  }, [inWindow, categories, dayIndex, last]);

  const todayIdx = dayIndex.get(today);

  function toggleCollapse(id: string) {
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex justify-end">
        <ViewSwitch />
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
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
        <button
          type="button"
          onClick={() => setViewDate(startOfMonth(new Date()))}
          className="h-8 rounded-full border border-line bg-surface px-3 text-xs font-semibold text-ink-soft transition-colors hover:border-ink/40 hover:text-ink"
        >
          Today
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)]">
        <div className="h-[62dvh] overflow-auto md:h-[68dvh]">
          <div
            className="relative"
            style={{ width: `calc(${days.length * colW}px + 12rem)` }}
          >
            <div
              className="sticky top-0 z-30 flex border-b border-line/70 bg-surface"
            >
              <div
                aria-hidden="true"
                className="sticky left-0 z-40 w-48 shrink-0 border-r border-line/70 bg-surface"
              />
              {days.map((day, index) => {
                const isToday = day === today;
                return (
                  <div
                    key={day}
                    className={`shrink-0 py-2 text-center ${
                      index === 0 ? "" : "border-l border-line/40"
                    } ${isToday ? "text-pen" : ""} ${
                      isSameMonth(day, viewDate) ? "" : "opacity-50"
                    }`}
                    style={{ width: colW }}
                  >
                    <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink-faint">
                      {weekdayOf(day)}
                    </p>
                    <p
                      className={`mt-0.5 font-mono text-[11px] ${
                        isToday ? "font-bold text-pen" : "text-ink-soft"
                      }`}
                    >
                      {dayOfMonth(day)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="relative" style={{ marginLeft: "12rem" }}>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0"
              >
                {days.map((day, index) =>
                  index === 0 ? null : (
                    <div
                      key={day}
                      className="absolute inset-y-0 border-l border-line/40"
                      style={{ left: index * colW }}
                    />
                  ),
                )}
                {todayIdx !== undefined ? (
                  <div
                    className="absolute inset-y-0 w-px bg-pen/50"
                    style={{ left: todayIdx * colW }}
                  />
                ) : null}
              </div>

              <div className="relative z-10">
                {rows.map((row) => {
                  const isCollapsed = collapsed.has(row.id);
                  const colors = categoryColorClasses[row.color];
                  const laneCount = isCollapsed
                    ? 0
                    : row.bars.reduce((max, bar) => Math.max(max, bar.lane + 1), 0);
                  const rowHeight = isCollapsed
                    ? 40
                    : ROW_PAD_TOP + Math.max(1, laneCount) * LANE_GAP;

                  return (
                    <div
                      key={row.id}
                      className="flex border-b border-line/60"
                      style={{ height: rowHeight }}
                    >
                      <div className="sticky left-0 z-20 flex w-48 shrink-0 items-center gap-2 border-r border-line/70 bg-surface px-2.5">
                        <button
                          type="button"
                          onClick={() => toggleCollapse(row.id)}
                          aria-label={`${isCollapsed ? "Expand" : "Collapse"} ${row.name}`}
                          aria-expanded={!isCollapsed}
                          className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-ink-faint transition-colors hover:bg-ink/5 hover:text-ink"
                        >
                          <ChevronDown
                            aria-hidden="true"
                            className={`h-3.5 w-3.5 transition-transform ${
                              isCollapsed ? "-rotate-90" : ""
                            }`}
                          />
                        </button>
                        <span
                          className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg ${colors.pill}`}
                        >
                          <CategoryIconComponent
                            icon={row.icon}
                            className="h-3.5 w-3.5"
                          />
                        </span>
                        <span className="min-w-0 truncate text-xs font-semibold text-ink">
                          {row.name}
                        </span>
                      </div>

                      <div className="relative min-w-0 flex-1 overflow-hidden">
                        {!isCollapsed
                          ? row.bars.map((bar) => {
                              const completed = bar.task.status === "completed";
                              return (
                                <button
                                  key={bar.task.id}
                                  type="button"
                                  onClick={() => setSelectedTaskId(bar.task.id)}
                                  className={`absolute flex items-center truncate rounded-lg px-2.5 text-left text-[11px] font-medium transition-[box-shadow,opacity] hover:ring-2 hover:ring-ink/15 ${
                                    colors.bar
                                  } ${completed ? "opacity-60 line-through" : ""}`}
                                  style={{
                                    left: bar.startIdx * colW,
                                    width: (bar.endIdx - bar.startIdx + 1) * colW,
                                    top: ROW_PAD_TOP + bar.lane * LANE_GAP,
                                    height: BAR_HEIGHT,
                                  }}
                                >
                                  {bar.task.title}
                                </button>
                              );
                            })
                          : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
