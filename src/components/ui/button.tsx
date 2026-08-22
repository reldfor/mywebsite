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
  primary: "bg-ink text-paper hover:bg-ink/90",
  secondary:
    "bg-surface text-ink border border-line shadow-[var(--shadow-interactive)] hover:border-ink/20 hover:bg-paper dark:shadow-none",
  marker: "bg-ink text-paper hover:bg-ink/90",
  "on-ink": "bg-paper text-ink hover:bg-white",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  md: "h-9 px-4 text-[13px]",
  lg: "h-10 px-5 text-[13px]",
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
      className={`inline-flex items-center justify-center gap-1.5 rounded-full font-medium tracking-[-0.01em] transition-colors duration-150 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
