"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type PopoverProps = {
  trigger: (props: { open: boolean; toggle: () => void }) => ReactNode;
  children: (close: () => void) => ReactNode;
  align?: "left" | "right";
  label?: string;
  role?: "dialog" | "menu";
  className?: string;
};

export function Popover({
  trigger,
  children,
  align = "right",
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
        setOpen(false);
        rootRef.current
          ?.querySelector<HTMLButtonElement>("[aria-haspopup]")
          ?.focus();
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
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
          className={`absolute top-full z-40 mt-2 origin-top rounded-xl border border-line bg-surface shadow-[var(--shadow-pop)] animate-pop-in ${
            align === "right" ? "right-0" : "left-0"
          } ${className}`}
        >
          {children(() => setOpen(false))}
        </div>
      ) : null}
    </div>
  );
}
