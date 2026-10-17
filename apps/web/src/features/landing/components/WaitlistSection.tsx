"use client";

import { WaitlistForm } from "@/features/waitlist";
import { useT } from "@/i18n";

export function WaitlistSection() {
  const t = useT();

  return (
    <section
      id="register"
      className="relative z-10 overflow-visible bg-background px-5 py-24 sm:px-8 md:py-32"
    >
      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 overflow-visible md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="text-label mb-4 text-primary-ink">{t.waitlist.eyebrow}</p>
          <h2 className="text-h1 text-balance text-text">
            {t.waitlist.titleBefore}{" "}
            <span className="text-primary-ink">{t.waitlist.titleHighlight}</span>
          </h2>
          <p className="text-body-lg mt-5 text-text-secondary">{t.waitlist.body}</p>
          <p className="text-body mt-6 font-semibold text-text">{t.waitlist.closing}</p>
        </div>

        <WaitlistForm />
      </div>
    </section>
  );
}
