"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { Heart, Building2, Stethoscope, Landmark, type LucideIcon } from "lucide-react";
import { useT } from "@/i18n";
import { AnimatedContent, Blob } from "@/components/bits";
import { SectionDivider } from "./SectionDivider";
import { AUDIENCE_EVENT, AUDIENCE_KEYS, type AudienceKey } from "../audience";

const AUDIENCE_META: Record<
  AudienceKey,
  { icon: LucideIcon; tone: string; photo: string; fit: "cover" | "contain" }
> = {
  guardians: {
    icon: Heart,
    tone: "bg-primary-soft text-primary-ink",
    photo: "/images/hero-pet.jpg",
    fit: "cover",
  },
  ngos: {
    icon: Building2,
    tone: "bg-success-soft text-success-ink",
    photo: "/images/auth/rescue.png",
    fit: "cover",
  },
  clinics: {
    icon: Stethoscope,
    tone: "bg-info-soft text-info-ink",
    photo: "/images/auth/adoption.png",
    fit: "cover",
  },
  agencies: {
    icon: Landmark,
    tone: "bg-secondary-soft text-secondary-ink",
    photo: "/images/auth/wildlife.png",
    fit: "cover",
  },
};

const PHOTO_MASK =
  "polygon(58% 2%, 74% 0%, 88% 7%, 98% 20%, 100% 40%, 97% 58%, 92% 76%, 80% 92%, 62% 99%, 44% 100%, 26% 94%, 12% 82%, 2% 64%, 0% 44%, 4% 26%, 16% 12%, 34% 4%)";

function audienceFromHash(): AudienceKey | null {
  const key = window.location.hash.replace("#audience-", "");
  return (AUDIENCE_KEYS as readonly string[]).includes(key) ? (key as AudienceKey) : null;
}

export function AudienceCards() {
  const t = useT();
  const [active, setActive] = useState<AudienceKey>("guardians");
  const tabRefs = useRef<Partial<Record<AudienceKey, HTMLButtonElement | null>>>({});

  useEffect(() => {
    const sync = () => {
      const fromHash = audienceFromHash();
      if (fromHash) setActive(fromHash);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent(AUDIENCE_EVENT, { detail: active }));
  }, [active]);

  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const index = AUDIENCE_KEYS.indexOf(active);
    let next = index;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (index + 1) % AUDIENCE_KEYS.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      next = (index - 1 + AUDIENCE_KEYS.length) % AUDIENCE_KEYS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = AUDIENCE_KEYS.length - 1;
    else return;
    e.preventDefault();
    const key = AUDIENCE_KEYS[next];
    setActive(key);
    tabRefs.current[key]?.focus();
  };

  const card = t.audience.cards[active];
  const ActiveIcon = AUDIENCE_META[active].icon;

  return (
    <section
      id="audience"
      className="relative z-10 flex min-h-[100svh] flex-col justify-center overflow-hidden bg-background px-5 py-24 sm:px-8 md:py-32"
    >
      {AUDIENCE_KEYS.map((key) => (
        <span
          key={key}
          id={`audience-${key}`}
          className="absolute top-0 scroll-mt-16"
          aria-hidden
        />
      ))}

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-12">
        <AnimatedContent stagger className="min-w-0 lg:col-span-6">
          <p className="text-label mb-4 text-success-ink">{t.audience.eyebrow}</p>
          <h2 className="text-h1 text-balance text-text">
            {t.audience.titleBefore}{" "}
            <span className="text-success-ink">{t.audience.titleHighlight}</span>
          </h2>
          <p className="text-body-lg mt-5 max-w-lg text-text-secondary">{t.audience.body}</p>

          <div
            role="tablist"
            aria-label={t.audience.eyebrow}
            className="mt-10 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap"
          >
            {AUDIENCE_KEYS.map((key) => {
              const { icon: Icon, tone } = AUDIENCE_META[key];
              const selected = key === active;
              return (
                <button
                  key={key}
                  ref={(el) => {
                    tabRefs.current[key] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`audience-tab-${key}`}
                  aria-selected={selected}
                  aria-controls="audience-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(key)}
                  onKeyDown={onTabKeyDown}
                  className={[
                    "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-body-sm font-semibold transition-colors duration-(--duration-fast)",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                    selected ? tone : "text-text-secondary hover:bg-surface hover:text-text",
                  ].join(" ")}
                >
                  <Icon size={16} strokeWidth={2.25} aria-hidden />
                  {t.audience.cards[key].title}
                </button>
              );
            })}
          </div>

          <div
            id="audience-panel"
            role="tabpanel"
            aria-labelledby={`audience-tab-${active}`}
            className="mt-6 min-h-36 rounded-[1.6rem] bg-surface p-6"
          >
            <div key={active} className="animate-fade-in">
              <span
                className={`mb-3 flex size-10 items-center justify-center rounded-full ${AUDIENCE_META[active].tone}`}
              >
                <ActiveIcon size={18} strokeWidth={2.25} aria-hidden />
              </span>
              <h3 className="text-h3 text-text">{card.title}</h3>
              <p className="text-body mt-2 text-text-secondary">{card.body}</p>
            </div>
          </div>
        </AnimatedContent>

        <div className="relative mx-auto w-full max-w-xl lg:col-span-6 lg:mr-0">
          <Blob
            variant={0}
            className="absolute -top-8 -left-8 size-28 text-primary/20 sm:size-36"
          />
          <Blob
            variant={2}
            className="absolute -right-6 -bottom-8 size-36 text-secondary/25"
          />
          <div
            className="relative aspect-[5/4] w-full bg-surface-accent shadow-lg"
            style={{ clipPath: PHOTO_MASK }}
          >
            {AUDIENCE_KEYS.map((key) => (
              <Image
                key={key}
                src={AUDIENCE_META[key].photo}
                alt={key === active ? t.audience.cards[key].title : ""}
                aria-hidden={key !== active}
                fill
                sizes="(max-width: 1024px) 90vw, 36rem"
                className={[
                  AUDIENCE_META[key].fit === "cover" ? "object-cover" : "object-contain p-8",
                  "transition-[opacity,scale] duration-700 ease-(--ease-out) motion-reduce:transition-none",
                  key === active ? "scale-100 opacity-100" : "scale-[1.03] opacity-0",
                ].join(" ")}
              />
            ))}
          </div>
        </div>
      </div>
      <SectionDivider fill="var(--warning-soft)" />
    </section>
  );
}
