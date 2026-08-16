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
      <div className={`${container} py-14`}>
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
              The task workspace that gets out of your way. Free for guests,
              unlimited with an account.
            </p>
          </div>
          {columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-ink-faint">
                {column.heading}
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-soft transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-line/80 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-faint">© 2026 Tick. All rights reserved.</p>
          <p className="font-mono text-[11px] text-ink-faint">
            Guest: 10 tasks · Free account: unlimited
          </p>
        </div>
      </div>
    </footer>
  );
}
