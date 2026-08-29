import type { Metadata } from "next";
import { Header } from "@/modules/landing/header";
import { Hero } from "@/modules/landing/hero";
import { Features } from "@/modules/landing/features";
import { Testimonials } from "@/modules/landing/testimonials";
import { Pricing } from "@/modules/landing/pricing";
import { Faq } from "@/modules/landing/faq";
import { FinalCta } from "@/modules/landing/final-cta";
import { Footer } from "@/modules/landing/footer";

export const metadata: Metadata = {
  title: "Tick — a todo list you'll actually finish",
  description:
    "A quiet, keyboard-first todo app. Five views, no login required, ten tasks free forever. Pro is free at launch.",
};

export default function Home() {
  return (
    <div className="tick-landing min-h-screen bg-lp-paper text-lp-ink">
      <Header />
      <main id="main">
        <Hero />
        <Features />
        <Testimonials />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
