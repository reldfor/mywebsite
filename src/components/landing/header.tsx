"use client";

import Link from "next/link";
import { useAuth } from "@clerk/react";
import { Logo } from "@/components/landing/logo";
import { authLinks, container, navLinks } from "@/lib/constants";

export function Header() {
  const { isSignedIn } = useAuth();

  return (
    <header className="tl-nav sticky top-0 z-50 border-b border-lp-rule">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-lp-ink focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-lp-paper"
      >
        Skip to content
      </a>
      <div className={`${container} flex items-center justify-between gap-4 py-[13px]`}>
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
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
