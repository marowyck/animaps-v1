"use client";

import {
  Header,
  Hero,
  SolutionSection,
  HowItWorks,
  AudienceCards,
  Differentials,
  FAQ,
  WaitlistSection,
  Footer,
} from "@/features/landing";
import { CookieBanner } from "@/features/consent";
import { ClickSpark, CurvedLoop } from "@/components/bits";

export default function HomePage() {
  return (
    <ClickSpark sparkColor="#e07a96" sparkSize={10} sparkRadius={18} sparkCount={9}>
      <Header />
      <main className="flex-1">
        <Hero />
        <SolutionSection />
        <HowItWorks />

        <CurvedLoop
          marqueeText="Match ideal · Adoção com cuidado · Crie sua conta"
          speed={40}
          ribbonFill="var(--pastel-green)"
          bridgeAbove
        />

        <AudienceCards />
        <Differentials />
        <FAQ />

        <CurvedLoop
          marqueeText="Seu match espera · Entre na plataforma"
          speed={42}
          direction="right"
          ribbonFill="var(--pastel-pink)"
          bridgeAbove
        />

        <WaitlistSection />
      </main>
      <Footer />
      <CookieBanner />
    </ClickSpark>
  );
}
