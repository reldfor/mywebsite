import type { LabelTone } from "@/modules/tasks/domain/types";

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
  yellow: "bg-[var(--lp-priority-med)]",
  green: "bg-[var(--lp-label-errand)]",
  teal: "bg-[var(--lp-label-errand)]",
  cyan: "bg-[var(--lp-label-personal)]",
  blue: "bg-[var(--lp-label-personal)]",
  indigo: "bg-[var(--lp-label-personal)]",
  purple: "bg-[var(--lp-label-side)]",
  pink: "bg-[var(--lp-label-side)]",
  brown: "bg-lp-ink-4",
};

export const labelTextClasses: Record<LabelTone, string> = {
  gray: "text-lp-ink-4",
  red: "text-lp-accent",
  orange: "text-[var(--lp-priority-med)]",
  yellow: "text-[var(--lp-priority-med)]",
  green: "text-[var(--lp-label-errand)]",
  teal: "text-[var(--lp-label-errand)]",
  cyan: "text-[var(--lp-label-personal)]",
  blue: "text-[var(--lp-label-personal)]",
  indigo: "text-[var(--lp-label-personal)]",
  purple: "text-[var(--lp-label-side)]",
  pink: "text-[var(--lp-label-side)]",
  brown: "text-lp-ink-4",
};

export const legacyLabelToneMap: Record<string, LabelTone> = {
  pen: "blue",
  marker: "yellow",
};
