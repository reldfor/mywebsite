import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import Script from "next/script";
import { ClerkProvider } from "@/features/auth/clerk-provider";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tick — A simple workspace for everything you need to get done",
  description:
    "Tick is a free task workspace. Start without an account, capture up to 10 tasks in seconds, then sign in for unlimited tasks synced across all your devices.",
};

export const viewport: Viewport = {
  themeColor: "#fcfcfc",
};

const themeInitScript = `(function () {
  try {
    var stored = window.localStorage.getItem("tick.theme");
    if (window.location.pathname === "/") {
      if (stored === "dark" || stored === "light") {
        document.documentElement.setAttribute("data-theme", stored);
      }
      return;
    }
    var dark =
      stored === "dark" ||
      (stored !== "light" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#0a0a0a" : "#fcfcfc");
  } catch (e) {}
})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${inter.variable}`}
    >
      <body>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
