"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useT } from "@/i18n";
import { AUTH_SLIDES } from "./slides";

const INTERVAL_MS = 6000;

export function AuthImageCarousel() {
  const t = useT();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % AUTH_SLIDES.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  const slide = AUTH_SLIDES[index];
  const copy = t.auth.slides[slide.id];

  return (
    <div
      className="relative h-full min-h-0 w-full overflow-hidden bg-ink"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      {AUTH_SLIDES.map((s, i) => {
        const active = i === index;
        const alt = t.auth.slides[s.id].imageAlt;
        return (
          <Image
            key={s.id}
            src={s.src}
            alt={active ? alt : ""}
            fill
            priority={i === 0}
            sizes="(max-width: 1023px) 100vw, 66vw"
            className={`object-cover transition-opacity duration-700 ease-out ${
              active ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={!active}
          />
        );
      })}

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10"
        aria-hidden
      />

      <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-10 lg:p-12">
        <p className="font-display max-w-xl text-2xl leading-tight tracking-tight text-white md:text-3xl lg:text-4xl">
          {copy.title}
        </p>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/85 md:text-base">
          {copy.body}
        </p>

        <div
          className="mt-6 flex gap-2"
          role="tablist"
          aria-label={t.chrome.slides}
        >
          {AUTH_SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`${t.auth.slides[s.id].title}`}
              onClick={() => setIndex(i)}
              className={`h-2 cursor-pointer rounded-full transition-all ${
                i === index
                  ? "w-8 bg-brand-pink"
                  : "w-2 bg-white/45 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
