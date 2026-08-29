import Link from "next/link";
import { Logo } from "@/modules/landing/logo";
import { authLinks, container } from "@/modules/shared/lib/constants";

const columns = [
  {
    heading: "Product",
    links: [
      { label: "Open the app", href: authLinks.guestWorkspace },
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Sign in", href: authLinks.signIn },
      { label: "Create account", href: authLinks.signUp },
      { label: "Migrate from guest", href: "#faq" },
    ],
  },
  {
    heading: "Code",
    links: [
      { label: "GitHub", href: "#" },
      { label: "Roadmap", href: "#" },
      { label: "Issues", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-lp-rule pt-[72px] pb-12">
      <div className={container}>
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-[320px] text-sm leading-[1.55] text-lp-ink-2">
              A quiet place for your todos. Built by people who kept bouncing off the
              bigger apps.
            </p>
          </div>
          {columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <p className="font-mono text-[11px] font-medium tracking-[0.08em] uppercase text-lp-ink-3">
                {column.heading}
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-lp-ink-2 transition-colors duration-150 hover:text-lp-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-lp-rule pt-6 font-mono text-[11px] text-lp-ink-3">
          <span>© 2025 Tick · Made with care</span>
        </div>
      </div>
    </footer>
  );
}
