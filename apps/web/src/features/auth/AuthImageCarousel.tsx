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
      className="relative h-full min-h-0 w-full overflow-hidden bg-footer"
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
          <div
            key={s.id}
            aria-hidden={!active}
            className={`absolute inset-0 transition-opacity duration-1000 ease-(--ease-out) motion-reduce:transition-none ${
              active ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={s.src}
              alt={active ? alt : ""}
              fill
              priority={i === 0}
              sizes="(max-width: 1023px) 100vw, 75vw"
              className={`object-cover ease-linear motion-reduce:!scale-100 motion-reduce:transition-none ${
                active
                  ? "scale-[1.06] transition-transform duration-[7000ms]"
                  : "scale-100 transition-none"
              }`}
            />
          </div>
        );
      })}

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10"
        aria-hidden
      />

      <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-10 lg:p-12">
        <div key={slide.id} className="animate-fade-in-up" aria-live="polite">
          <p className="text-h2 max-w-xl text-balance text-white">{copy.title}</p>
          <p className="text-body mt-3 max-w-lg text-white/85">{copy.body}</p>
        </div>

        <div
          className="mt-5 flex gap-1"
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
              className="group flex h-6 w-9 cursor-pointer items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/35 transition-colors duration-(--duration-fast) group-hover:bg-white/55">
                <span
                  className={`absolute inset-0 origin-left rounded-full bg-primary transition-transform duration-(--duration-slow) ease-(--ease-out) ${
                    i === index ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
