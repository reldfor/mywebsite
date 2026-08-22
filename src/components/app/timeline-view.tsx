"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Popover } from "@/components/app/popover";
import { ViewSwitch } from "@/components/app/view-switch";
import {
  CategoryIconComponent,
  categoryColorClasses,
  categoryColors,
  categoryIcons,
} from "@/components/app/task-colors";
import { useTasks } from "@/features/todos/tasks-provider";
import type {
  Category,
  CategoryColor,
  CategoryIcon,
  Task,
} from "@/features/todos/types";
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

const BAR_HEIGHT = 22;
const LANE_GAP = 30;
const PAD_TOP = 8;
const PAD_BOTTOM = 8;
const CATEGORY_COLUMN = "10rem";
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

function NewCategoryForm({ onDone }: { onDone: () => void }) {
  const { addCategory, showToast } = useTasks();
  const [name, setName] = useState("");
  const [color, setColor] = useState<CategoryColor>("blue");
  const [icon, setIcon] = useState<CategoryIcon>("list");
  const trimmed = name.trim();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trimmed) return;
    addCategory(trimmed, icon, color);
    showToast("Category created");
    onDone();
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-64 flex-col gap-3 p-4">
      <p className="text-[13px] font-semibold text-ink">New category</p>
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-ink-soft">Name</span>
        <input
          autoFocus
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={40}
          placeholder="e.g. Research"
          aria-label="Category name"
          className="h-9 rounded-lg border border-line bg-paper px-3 text-[13px] text-ink outline-none placeholder:text-ink-faint focus:border-ink/20"
        />
      </label>
      <fieldset className="flex flex-col gap-1.5">
        <legend className="text-xs font-medium text-ink-soft">Style</legend>
        <div className="flex gap-2">
          {categoryColors.map((value) => {
            const active = color === value;
            const swatch = categoryColorClasses[value];
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                aria-label={`${value} style`}
                onClick={() => setColor(value)}
                className={`h-7 w-7 rounded-full border ${swatch.pill} ${
                  active
                    ? "ring-1 ring-ink ring-offset-1 ring-offset-surface"
                    : "border-line"
                }`}
              />
            );
          })}
        </div>
      </fieldset>
      <fieldset className="flex flex-col gap-1.5">
        <legend className="text-xs font-medium text-ink-soft">Icon</legend>
        <div className="flex gap-1.5">
          {categoryIcons.map((value) => {
            const active = icon === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                aria-label={`${value} icon`}
                onClick={() => setIcon(value)}
                className={`grid h-8 w-8 place-items-center rounded-lg border transition-colors ${
                  active
                    ? "border-ink bg-ink text-paper"
                    : "border-line text-ink-faint hover:border-ink/15 hover:text-ink"
                }`}
              >
                <CategoryIconComponent icon={value} className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </fieldset>
      <button
        type="submit"
        disabled={!trimmed}
        className="h-9 rounded-full bg-ink text-xs font-medium text-paper transition-colors hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Create category
      </button>
    </form>
  );
}

export function TimelineView() {
  const { tasks, categories, setSelectedTaskId } = useTasks();
  const isDesktop = useIsDesktop();
  const [viewDate, setViewDate] = useState(() => startOfMonth(new Date()));
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  const colW = isDesktop ? 92 : 60;
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
        name: "Uncategorized",
        icon: "list",
        color: "gray",
        bars: packBars(otherTasks, dayIndex, last),
      });
    }
    return result;
  }, [inWindow, categories, dayIndex, last]);

  const todayIdx = dayIndex.get(today);

  useEffect(() => {
    if (todayIdx === undefined) return;
    const el = scrollRef.current;
    if (!el) return;
    const target = todayIdx * colW + colW / 2 - el.clientWidth / 2;
    el.scrollLeft = Math.max(
      0,
      Math.min(target, el.scrollWidth - el.clientWidth),
    );
  }, [viewDate, todayIdx, colW]);

  function toggleCollapse(id: string) {
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="mx-auto w-full max-w-[880px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex justify-end">
        <ViewSwitch />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
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
        <button
          type="button"
          onClick={() => setViewDate(startOfMonth(new Date()))}
          className="h-8 rounded-full border border-line bg-surface px-3 text-xs font-medium text-ink-soft transition-colors hover:border-ink/15 hover:text-ink"
        >
          Today
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-line bg-surface">
        <div className="h-[60dvh] overflow-auto md:h-[64dvh]" ref={scrollRef}>
          <div
            className="relative min-h-full"
            style={{ width: `calc(${days.length * colW}px + ${CATEGORY_COLUMN})` }}
          >
            <div
              className="sticky top-0 z-30 flex border-b border-line bg-surface"
            >
              <div
                aria-hidden="true"
                className="sticky left-0 z-40 shrink-0 border-r border-line bg-surface"
                style={{ width: CATEGORY_COLUMN }}
              />
              {days.map((day, index) => {
                const isToday = day === today;
                return (
                  <div
                    key={day}
                    className={`flex shrink-0 flex-col items-center justify-center gap-0.5 py-2 ${
                      index === 0 ? "" : "border-l border-line"
                    } ${isToday ? "bg-ink/[0.04]" : ""} ${
                      isSameMonth(day, viewDate) ? "" : "opacity-50"
                    }`}
                    style={{ width: colW }}
                  >
                    <span className="text-[10px] font-medium uppercase tracking-[0.06em] text-ink-faint">
                      {weekdayOf(day)}
                    </span>
                    <span
                      className={`grid h-6 w-6 place-items-center rounded-full text-[13px] font-medium tabular-nums ${
                        isToday ? "bg-ink text-paper" : "text-ink-soft"
                      }`}
                    >
                      {dayOfMonth(day)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 right-0">
              {days.map((day, index) =>
                index === 0 ? null : (
                  <div
                    key={day}
                    className="absolute inset-y-0 w-px bg-line"
                    style={{
                      left: `calc(${CATEGORY_COLUMN} + ${index * colW}px)`,
                    }}
                  />
                ),
              )}
              {todayIdx !== undefined ? (
                <div
                  className="absolute inset-y-0 w-px bg-ink/30"
                  style={{
                    left: `calc(${CATEGORY_COLUMN} + ${todayIdx * colW + colW / 2}px)`,
                    transform: "translateX(-50%)",
                  }}
                />
              ) : null}
            </div>

            <div className="relative">
              {rows.map((row) => {
                const isCollapsed = collapsed.has(row.id);
                const colors = categoryColorClasses[row.color];
                const laneCount = isCollapsed
                  ? 0
                  : row.bars.reduce(
                      (max, bar) => Math.max(max, bar.lane + 1),
                      0,
                    );
                const rowHeight = isCollapsed
                  ? PAD_TOP + BAR_HEIGHT + PAD_BOTTOM
                  : PAD_TOP +
                    Math.max(0, laneCount - 1) * LANE_GAP +
                    BAR_HEIGHT +
                    PAD_BOTTOM;

                return (
                  <div
                    key={row.id}
                    className="grid border-b border-line/60"
                    style={{
                      gridTemplateColumns: `${CATEGORY_COLUMN} ${days.length * colW}px`,
                      height: rowHeight,
                    }}
                  >
                    <div className="sticky left-0 z-20 flex items-center gap-2 border-r border-line bg-surface px-2">
                      <button
                        type="button"
                        onClick={() => toggleCollapse(row.id)}
                        aria-label={`${isCollapsed ? "Expand" : "Collapse"} ${row.name}`}
                        aria-expanded={!isCollapsed}
                        className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-ink-faint transition-colors hover:bg-ink/[0.04] hover:text-ink"
                      >
                        <ChevronDown
                          aria-hidden="true"
                          className={`h-3.5 w-3.5 transition-transform ${
                            isCollapsed ? "-rotate-90" : ""
                          }`}
                        />
                      </button>
                      <span
                        className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border border-line bg-surface ${colors.pill}`}
                      >
                        <CategoryIconComponent
                          icon={row.icon}
                          className="h-3.5 w-3.5 text-ink-faint"
                        />
                      </span>
                      <span className="min-w-0 truncate text-xs font-medium text-ink">
                        {row.name}
                      </span>
                    </div>

                    <div className="relative">
                      <div className="relative z-10">
                        {!isCollapsed
                          ? row.bars.map((bar) => {
                              const completed = bar.task.status === "completed";
                              return (
                                <button
                                  key={bar.task.id}
                                  type="button"
                                  onClick={() =>
                                    setSelectedTaskId(bar.task.id)
                                  }
                                  className={`absolute flex items-center truncate rounded-md border border-line bg-ink px-2.5 text-left text-xs font-medium text-paper transition-opacity hover:bg-ink/90 ${
                                    completed ? "opacity-40 line-through" : ""
                                  }`}
                                  style={{
                                    left: bar.startIdx * colW + 2,
                                    width:
                                      (bar.endIdx - bar.startIdx + 1) * colW - 4,
                                    top: PAD_TOP + bar.lane * LANE_GAP,
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
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center border-t border-line px-4 py-2.5">
          <Popover
            align="left"
            label="New category"
            trigger={({ open, toggle }) => (
              <button
                type="button"
                onClick={toggle}
                aria-expanded={open}
                className="inline-flex h-8 items-center gap-1.5 rounded-full border border-dashed border-line px-3 text-xs font-medium text-ink-soft transition-colors hover:border-ink/15 hover:text-ink"
              >
                <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                New category
              </button>
            )}
          >
            {(close) => <NewCategoryForm onDone={close} />}
          </Popover>
        </div>
      </div>
    </div>
  );
}
