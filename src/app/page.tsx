import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { ValueStrip } from "@/components/landing/value-strip";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { GuestAccount } from "@/components/landing/guest-account";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { ThemeProvider } from "@/features/theme/theme-provider";

export default function Home() {
  return (
    <ThemeProvider>
      <Header />
      <main id="main">
        <Hero />
        <ValueStrip />
        <Features />
        <HowItWorks />
        <GuestAccount />
        <FinalCta />
      </main>
      <Footer />
    </ThemeProvider>
  );
}
