"use client";

import { Header, WaitlistSection, Footer } from "@/features/landing";
import { CookieBanner } from "@/features/consent";
import { ClickSpark } from "@/components/bits";

export default function RegisterPage() {
  return (
    <ClickSpark sparkColor="#e07a96" sparkSize={10} sparkRadius={18} sparkCount={9}>
      <Header />
      <main className="flex-1 pt-24 md:pt-28">
        <WaitlistSection />
      </main>
      <Footer />
      <CookieBanner />
    </ClickSpark>
  );
}
