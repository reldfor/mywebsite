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
