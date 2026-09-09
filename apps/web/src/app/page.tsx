"use client";

import {
  Header,
  Hero,
  SolutionSection,
  HowItWorks,
  AudienceCards,
  Differentials,
  FAQ,
  Footer,
} from "@/features/landing";
import { CookieBanner } from "@/features/consent";
import { CurvedLoop } from "@/components/bits";
import { useT } from "@/i18n";

export default function HomePage() {
  const t = useT();

  return (
    <>
      <Header />
      <main className="relative flex-1 overflow-x-clip">
        <Hero />
        <SolutionSection />
        <HowItWorks />

        <CurvedLoop
          marqueeText={t.marquees.green}
          speed={40}
          ribbonFill="var(--pastel-green)"
          bridgeAbove
        />

        <AudienceCards />
        <Differentials />
        <FAQ />

        <CurvedLoop
          marqueeText={t.marquees.pink}
          speed={42}
          direction="right"
          ribbonFill="var(--pastel-pink)"
          bridgeAbove
          bridgeBelow
          bridgeBelowFill="#1a1214"
          className="bg-pastel-pink"
        />
      </main>
      <Footer showDivider={false} />
      <CookieBanner />
    </>
  );
}
