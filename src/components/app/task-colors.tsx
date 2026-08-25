import { FlaskConical, ListTodo, Package, Palette, Terminal, Zap } from "lucide-react";
import type { CategoryColor, CategoryIcon } from "@/features/todos/types";

export const categoryColors: CategoryColor[] = [
  "blue",
  "cyan",
  "green",
  "pink",
  "yellow",
  "gray",
];

export const categoryIcons: CategoryIcon[] = [
  "package",
  "palette",
  "terminal",
  "zap",
  "flask",
  "list",
];

export const categoryColorClasses: Record<
  CategoryColor,
  { pill: string; bar: string; tint: string; dot: string }
> = {
  blue: {
    pill: "bg-lp-paper-3 text-lp-ink-2 border border-lp-rule",
    bar: "bg-lp-paper-3 text-lp-ink-2 border border-lp-rule",
    tint: "bg-lp-paper-3",
    dot: "bg-[var(--lp-label-personal)]",
  },
  cyan: {
    pill: "bg-lp-paper-3 text-lp-ink-2 border border-lp-rule",
    bar: "bg-lp-paper-3 text-lp-ink-2 border border-lp-rule",
    tint: "bg-lp-paper-3",
    dot: "bg-[var(--lp-label-personal)]",
  },
  green: {
    pill: "bg-lp-paper-3 text-lp-ink-2 border border-lp-rule",
    bar: "bg-lp-paper-3 text-lp-ink-2 border border-lp-rule",
    tint: "bg-lp-paper-3",
    dot: "bg-[var(--lp-label-errand)]",
  },
  pink: {
    pill: "bg-lp-paper-3 text-lp-ink-2 border border-lp-rule",
    bar: "bg-lp-paper-3 text-lp-ink-2 border border-lp-rule",
    tint: "bg-lp-paper-3",
    dot: "bg-[var(--lp-label-side)]",
  },
  yellow: {
    pill: "bg-lp-paper-3 text-lp-ink-2 border border-lp-rule",
    bar: "bg-lp-paper-3 text-lp-ink-2 border border-lp-rule",
    tint: "bg-lp-paper-3",
    dot: "bg-[var(--lp-label-work)]",
  },
  gray: {
    pill: "bg-lp-paper-3 text-lp-ink-2 border border-lp-rule",
    bar: "bg-lp-paper-3 text-lp-ink-2 border border-lp-rule",
    tint: "bg-[var(--lp-glass)]",
    dot: "bg-lp-ink-4",
  },
};

const iconMap = {
  package: Package,
  palette: Palette,
  terminal: Terminal,
  zap: Zap,
  flask: FlaskConical,
  list: ListTodo,
} as const;

export function CategoryIconComponent({
  icon,
  className,
}: {
  icon: CategoryIcon;
  className?: string;
}) {
  const Icon = iconMap[icon];
  return <Icon aria-hidden="true" className={className} />;
}
