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
  primary: "bg-lp-ink text-lp-paper hover:bg-[color-mix(in_srgb,var(--lp-ink)_90%,var(--lp-paper))]",
  secondary:
    "bg-lp-paper-2 text-lp-ink border border-lp-rule shadow-[var(--lp-shadow-interactive)] hover:border-[color-mix(in_srgb,var(--lp-ink)_20%,transparent)] hover:bg-lp-paper",
  marker: "bg-lp-ink text-lp-paper hover:bg-[color-mix(in_srgb,var(--lp-ink)_90%,var(--lp-paper))]",
  "on-ink": "bg-lp-paper text-lp-ink hover:bg-white",
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
