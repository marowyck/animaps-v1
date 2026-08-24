import {
  Header,
  Hero,
  ProblemSection,
  SolutionSection,
  HowItWorks,
  AudienceCards,
  Differentials,
  SocialProofCarousel,
  FAQ,
  WaitlistSection,
  Footer,
} from "@/features/landing";
import { CookieBanner } from "@/features/consent";

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
        <WaitlistSection />
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
