export const container = "mx-auto w-full max-w-6xl px-5 sm:px-8";

export const appName = "Tick";

export const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#compare", label: "Guest vs account" },
] as const;

export const authLinks = {
  signIn: "/sign-in",
  signUp: "/sign-up",
  guestWorkspace: "/app",
  privacy: "/privacy",
  terms: "/terms",
  contact: "/contact",
} as const;
