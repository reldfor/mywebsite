"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Logo } from "@/modules/landing/logo";
import { authLinks, container, navLinks } from "@/modules/shared/lib/constants";

export function Header() {
  const { isSignedIn } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="tl-nav sticky top-0 z-50">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-lp-ink focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-lp-paper"
      >
        Skip to content
      </a>
      <div
        className={`${container} relative flex items-center justify-between gap-4 transition-all duration-300 ease-out ${scrolled ? "py-[8px] !max-w-[980px]" : "py-[13px]"}`}
      >
        <Logo />

        <nav
          aria-label="Primary"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium text-lp-ink-2 transition-colors duration-150 hover:text-lp-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {!isSignedIn && (
            <Link href={authLinks.signIn} className="btn-ghost hidden md:inline-flex">
              Sign in
            </Link>
          )}
          <Link href={authLinks.guestWorkspace} className="btn-primary">
            Open the app <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
