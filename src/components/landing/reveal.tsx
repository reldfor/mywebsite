"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<"idle" | "prep" | "visible">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let io: IntersectionObserver | null = null;
    const raf = requestAnimationFrame(() => {
      if (typeof IntersectionObserver === "undefined") {
        setState("visible");
        return;
      }
      setState("prep");
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setState("visible");
              io?.disconnect();
            }
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -48px 0px" },
      );
      io.observe(el);
    });
    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${state === "prep" ? "reveal-prep" : ""} ${state === "visible" ? "is-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
