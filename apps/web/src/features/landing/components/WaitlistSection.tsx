"use client";

import { WaitlistForm } from "@/features/waitlist";
import { useT } from "@/i18n";

export function WaitlistSection() {
  const t = useT();

  return (
    <section
      id="register"
      className="relative z-10 overflow-visible bg-gray-soft px-5 py-24 sm:px-8 md:py-32"
    >
      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 overflow-visible md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-pink">
            {t.waitlist.eyebrow}
          </p>
          <h2 className="text-h1 text-text">
            {t.waitlist.titleBefore}{" "}
            <span className="text-brand-pink">{t.waitlist.titleHighlight}</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-muted md:text-lg">
            {t.waitlist.body}
          </p>
          <p className="mt-6 text-base font-semibold leading-relaxed text-ink">
            {t.waitlist.closing}
          </p>
        </div>

        <WaitlistForm />
      </div>
    </section>
  );
}
