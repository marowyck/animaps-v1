import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { AudienceCards } from "@/components/landing/AudienceCards";
import { Differentials } from "@/components/landing/Differentials";
import { SocialProofCarousel } from "@/components/landing/SocialProofCarousel";
import { FAQ } from "@/components/landing/FAQ";
import { WaitlistForm } from "@/components/landing/WaitlistForm";
import { CookieBanner } from "@/components/landing/CookieBanner";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <HowItWorks />
        <AudienceCards />
        <Differentials />
        <SocialProofCarousel />
        <FAQ />
        <WaitlistForm />
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
