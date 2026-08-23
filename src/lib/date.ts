const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function parseISODate(value: string): Date {
  const [y, m, d] = value.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function daysUntil(dueISO: string): number {
  const due = parseISODate(dueISO).getTime();
  const today = startOfToday().getTime();
  return Math.round((due - today) / 86400000);
}

export function isOverdue(dueISO: string): boolean {
  return daysUntil(dueISO) < 0;
}

export function isDueToday(dueISO: string): boolean {
  return daysUntil(dueISO) === 0;
}

export function isUpcoming(dueISO: string): boolean {
  return daysUntil(dueISO) > 0;
}

export function formatDueShort(dueISO: string): string {
  const diff = daysUntil(dueISO);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  const date = parseISODate(dueISO);
  return `${weekdays[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
}

export function formatDateTime(value: string): string {
  const date = new Date(value);
  const time = `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
  return `${weekdays[date.getDay()]} ${date.getDate()} ${
    months[date.getMonth()]
  }, ${time}`;
}

export function daysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

export function datetimeFromNow(days: number, hours = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hours, 0, 0, 0);
  return date.toISOString();
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

export function monthLabel(date: Date): string {
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function startOfWeekMonday(date: Date): Date {
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  result.setDate(result.getDate() + diff);
  return result;
}

export function startOfWeekSunday(date: Date): Date {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  result.setDate(result.getDate() - result.getDay());
  return result;
}

export function addDays(date: Date, delta: number): Date {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  result.setDate(result.getDate() + delta);
  return result;
}

export function buildWeekDays(anchor: Date): string[] {
  const start = startOfWeekSunday(anchor);
  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const cursor = addDays(start, i);
    days.push(toISODate(cursor));
  }
  return days;
}

export function weekLabel(weekDays: string[]): string {
  if (weekDays.length === 0) return "";
  const first = parseISODate(weekDays[0]);
  const last = parseISODate(weekDays[weekDays.length - 1]);
  if (
    first.getFullYear() === last.getFullYear() &&
    first.getMonth() === last.getMonth()
  ) {
    return `${months[first.getMonth()]} ${first.getDate()} – ${last.getDate()}, ${first.getFullYear()}`;
  }
  if (first.getFullYear() === last.getFullYear()) {
    return `${months[first.getMonth()]} ${first.getDate()} – ${months[last.getMonth()]} ${last.getDate()}, ${first.getFullYear()}`;
  }
  return `${months[first.getMonth()]} ${first.getDate()}, ${first.getFullYear()} – ${months[last.getMonth()]} ${last.getDate()}, ${last.getFullYear()}`;
}

export function formatHour(hour: number): string {
  if (hour === 0) return "12 AM";
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return "12 PM";
  return `${hour - 12} PM`;
}

export function timezoneLabel(): string {
  const offset = -new Date().getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const abs = Math.abs(offset);
  const hours = String(Math.floor(abs / 60)).padStart(2, "0");
  const minutes = abs % 60;
  if (minutes === 0) return `GMT${sign}${String(Math.floor(abs / 60))}`;
  return `GMT${sign}${hours}:${String(minutes).padStart(2, "0")}`;
}

export function minutesOf(value: string): number | null {
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})/.exec(value);
  if (!match) return null;
  return Number(match[2]) * 60 + Number(match[3]);
}

export function buildMonthDays(monthDate: Date): string[] {
  const cursor = startOfWeekMonday(startOfMonth(monthDate));
  const days: string[] = [];
  const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
  for (let i = 0; i < 42; i++) {
    days.push(toISODate(cursor));
    cursor.setDate(cursor.getDate() + 1);
    if (days.length % 7 === 0) {
      const last = parseISODate(days[days.length - 1]);
      if (last.getTime() >= monthEnd.getTime()) break;
    }
  }
  return days;
}

export function dayOfMonth(dateISO: string): number {
  return parseISODate(dateISO).getDate();
}

export function timeOf(value: string): string | null {
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})/.exec(value);
  if (!match) return null;
  return `${match[2]}:${match[3]}`;
}

export function weekdayOf(dateISO: string): string {
  return weekdays[parseISODate(dateISO).getDay()];
}

export function isSameMonth(dateISO: string, monthDate: Date): boolean {
  const date = parseISODate(dateISO);
  return (
    date.getFullYear() === monthDate.getFullYear() &&
    date.getMonth() === monthDate.getMonth()
  );
}
