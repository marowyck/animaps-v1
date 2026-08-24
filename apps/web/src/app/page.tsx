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
  CookieBanner,
  Footer,
} from "@/features/landing";

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
