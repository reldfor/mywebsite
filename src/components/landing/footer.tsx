import Link from "next/link";
import { Logo } from "@/components/landing/logo";
import { authLinks, container, navLinks } from "@/lib/constants";

const columns = [
  {
    heading: "Product",
    links: navLinks.map((link) => ({ label: link.label, href: link.href })),
  },
  {
    heading: "Account",
    links: [
      { label: "Sign in", href: authLinks.signIn },
      { label: "Create an account", href: authLinks.signUp },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Privacy", href: authLinks.privacy },
      { label: "Terms", href: authLinks.terms },
      { label: "Contact", href: authLinks.contact },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className={`${container} py-10 lg:py-12`}>
        <div className="grid gap-8 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-[280px] text-[13px] leading-[1.5] text-ink-soft">
              The task workspace that gets out of your way. Free for guests,
              unlimited with an account.
            </p>
          </div>
          {columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
                {column.heading}
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-ink-soft transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs tabular-nums text-ink-faint">© 2026 Tick. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
