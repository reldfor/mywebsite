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
    pill: "bg-ink/[0.06] text-ink border border-line",
    bar: "bg-ink/[0.06] text-ink border border-line",
    tint: "bg-ink/[0.04]",
    dot: "bg-ink",
  },
  cyan: {
    pill: "bg-ink/[0.06] text-ink border border-line",
    bar: "bg-ink/[0.06] text-ink border border-line",
    tint: "bg-ink/[0.04]",
    dot: "bg-ink/60",
  },
  green: {
    pill: "bg-ink/[0.06] text-ink border border-line",
    bar: "bg-ink/[0.06] text-ink border border-line",
    tint: "bg-ink/[0.04]",
    dot: "bg-ink/50",
  },
  pink: {
    pill: "bg-ink/[0.06] text-ink border border-line",
    bar: "bg-ink/[0.06] text-ink border border-line",
    tint: "bg-ink/[0.04]",
    dot: "bg-ink/40",
  },
  yellow: {
    pill: "bg-ink/[0.06] text-ink border border-line",
    bar: "bg-ink/[0.06] text-ink border border-line",
    tint: "bg-ink/[0.04]",
    dot: "bg-ink/30",
  },
  gray: {
    pill: "bg-ink/[0.06] text-ink border border-line",
    bar: "bg-ink/[0.06] text-ink border border-line",
    tint: "bg-ink/[0.03]",
    dot: "bg-ink/20",
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
