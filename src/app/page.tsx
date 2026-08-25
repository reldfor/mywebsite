import type { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { Faq } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";

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
