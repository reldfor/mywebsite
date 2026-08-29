export const container = "mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10";

export const appName = "Tick";

export const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
] as const;

export const authLinks = {
  signIn: "/sign-in",
  signUp: "/sign-up",
  guestWorkspace: "/app",
  privacy: "/privacy",
  terms: "/terms",
  contact: "/contact",
} as const;
