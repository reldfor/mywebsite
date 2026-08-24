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
  gray: "bg-gray-400 dark:bg-gray-500",
  red: "bg-red-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-400",
  green: "bg-green-500",
  teal: "bg-teal-500",
  cyan: "bg-cyan-500",
  blue: "bg-blue-500",
  indigo: "bg-indigo-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  brown: "bg-amber-700",
};

export const labelTextClasses: Record<LabelTone, string> = {
  gray: "text-gray-400 dark:text-gray-500",
  red: "text-red-500",
  orange: "text-orange-500",
  yellow: "text-yellow-500 dark:text-yellow-400",
  green: "text-green-500",
  teal: "text-teal-500",
  cyan: "text-cyan-500",
  blue: "text-blue-500",
  indigo: "text-indigo-500",
  purple: "text-purple-500",
  pink: "text-pink-500",
  brown: "text-amber-700 dark:text-amber-600",
};

export const legacyLabelToneMap: Record<string, LabelTone> = {
  pen: "blue",
  marker: "yellow",
};
