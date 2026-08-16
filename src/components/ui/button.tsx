import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "marker" | "on-ink";
  size?: "md" | "lg";
  className?: string;
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-ink text-paper hover:bg-pen",
  secondary:
    "bg-surface text-ink border border-line hover:border-ink/40 hover:bg-surface-strong",
  marker: "bg-marker text-marker-ink hover:brightness-95",
  "on-ink": "bg-paper text-ink hover:bg-surface-strong",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
