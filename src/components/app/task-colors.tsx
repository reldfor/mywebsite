import { FlaskConical, ListTodo, Package, Palette, Terminal, Zap } from "lucide-react";
import type { CategoryColor, CategoryIcon } from "@/features/todos/types";

export const categoryColorClasses: Record<
  CategoryColor,
  { pill: string; bar: string }
> = {
  blue: { pill: "bg-pen-soft text-pen", bar: "bg-pen-soft text-pen" },
  cyan: {
    pill: "bg-[var(--cat-cyan-bg)] text-[var(--cat-cyan)]",
    bar: "bg-[var(--cat-cyan-bg)] text-[var(--cat-cyan)]",
  },
  green: {
    pill: "bg-[var(--cat-emerald-bg)] text-[var(--cat-emerald)]",
    bar: "bg-[var(--cat-emerald-bg)] text-[var(--cat-emerald)]",
  },
  pink: {
    pill: "bg-[var(--cat-rose-bg)] text-[var(--cat-rose)]",
    bar: "bg-[var(--cat-rose-bg)] text-[var(--cat-rose)]",
  },
  yellow: {
    pill: "bg-[var(--cat-amber-bg)] text-[var(--cat-amber)]",
    bar: "bg-[var(--cat-amber-bg)] text-[var(--cat-amber)]",
  },
  gray: { pill: "bg-ink/5 text-ink-soft", bar: "bg-ink/5 text-ink-soft" },
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
