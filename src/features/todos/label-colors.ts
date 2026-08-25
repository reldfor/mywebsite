import type { LabelTone } from "@/features/todos/types";

export const LABEL_COLORS: LabelTone[] = [
  "gray",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "cyan",
  "blue",
  "indigo",
  "purple",
  "pink",
  "brown",
];

export const labelDotClasses: Record<LabelTone, string> = {
  gray: "bg-lp-ink-4",
  red: "bg-lp-accent",
  orange: "bg-[var(--lp-priority-med)]",
  yellow: "bg-yellow-500",
  green: "bg-[var(--lp-label-errand)]",
  teal: "bg-teal-500",
  cyan: "bg-cyan-500",
  blue: "bg-[var(--lp-label-personal)]",
  indigo: "bg-indigo-500",
  purple: "bg-[var(--lp-label-side)]",
  pink: "bg-pink-500",
  brown: "bg-amber-700",
};

export const labelTextClasses: Record<LabelTone, string> = {
  gray: "text-lp-ink-4",
  red: "text-lp-accent",
  orange: "text-[var(--lp-priority-med)]",
  yellow: "text-yellow-500",
  green: "text-[var(--lp-label-errand)]",
  teal: "text-teal-500",
  cyan: "text-cyan-500",
  blue: "text-[var(--lp-label-personal)]",
  indigo: "text-indigo-500",
  purple: "text-[var(--lp-label-side)]",
  pink: "text-pink-500",
  brown: "text-amber-700",
};

export const legacyLabelToneMap: Record<string, LabelTone> = {
  pen: "blue",
  marker: "yellow",
};
