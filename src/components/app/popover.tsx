"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type PopoverProps = {
  trigger: (props: { open: boolean; toggle: () => void }) => ReactNode;
  children: (close: () => void) => ReactNode;
  align?: "left" | "right";
  side?: "top" | "bottom";
  label?: string;
  role?: "dialog" | "menu";
  className?: string;
};

export function Popover({
  trigger,
  children,
  align = "right",
  side = "bottom",
  label,
  role = "dialog",
  className = "",
}: PopoverProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        setOpen(false);
        rootRef.current
          ?.querySelector<HTMLButtonElement>("[aria-haspopup]")
          ?.focus();
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [open]);

  function toggle() {
    setOpen((value) => !value);
  }

  return (
    <div ref={rootRef} className="relative">
      {trigger({ open, toggle })}
      {open ? (
        <div
          role={role}
          aria-label={label}
          className={`absolute z-50 rounded-xl border border-lp-rule bg-lp-paper-2 shadow-[var(--lp-shadow-card)] animate-pop-in ${
            side === "top" ? "bottom-full mb-2 origin-bottom" : "top-full mt-2 origin-top"
          } ${align === "right" ? "right-0" : "left-0"} ${className}`}
        >
          {children(() => setOpen(false))}
        </div>
      ) : null}
    </div>
  );
}
