"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/Button";
import { AnimatedHeading, ParticleBurst } from "@/components/bits";
import { HeartDoodle, PawDoodle } from "@/components/illustrations/Doodles";
import { EmptyState } from "@/components/StateBlocks";
import { useToast } from "@/components/Toast";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useT } from "@/i18n";
import { EASE } from "@/lib/motion";
import { recordDiscoverAction } from "./activity";
import { DiscoverCard } from "./DiscoverCard";
import { getMockDiscoverItems } from "./mockDiscoverItems";
import type { DiscoverAction, DiscoverItem } from "./types";

function MatchCelebration({
  item,
  onContinue,
}: {
  item: DiscoverItem;
  onContinue: () => void;
}) {
  const t = useT();
  const reduced = usePrefersReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const photo = item.imageUrl ?? "/images/auth/adoption.png";

  useEffect(() => {
    root.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onContinue();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onContinue]);

  useGSAP(
    () => {
      const frames = root.current?.querySelectorAll<HTMLElement>(".match-frame");
      if (reduced || !frames?.length) return;
      gsap.fromTo(
        frames,
        { scale: 0.82, rotate: -8, opacity: 0 },
        {
          scale: 1,
          rotate: (index) => (index === 0 ? -7 : 5),
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: EASE.celebrate,
        },
      );
    },
    { dependencies: [reduced, item.id] },
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="match-title"
      className="absolute inset-0 z-20 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-text/40 animate-fade-in" onClick={onContinue} />
      <div
        ref={root}
        tabIndex={-1}
        className="animate-modal-in relative w-full max-w-sm overflow-visible rounded-[2rem] bg-primary-soft px-5 pt-8 pb-5 shadow-lg outline-none"
      >
        <ParticleBurst play={reduced ? 0 : 1} count={16} className="z-20" />
        <div className="relative mx-auto h-52">
          <div className="match-frame absolute top-2 left-4 h-40 w-32 -rotate-6 overflow-hidden rounded-[1.8rem] shadow-md">
            <Image src={photo} alt="" fill sizes="8rem" className="object-cover" />
          </div>
          <div className="match-frame absolute top-6 right-3 h-44 w-36 rotate-6 overflow-hidden rounded-[2rem_1.25rem_2rem_1.4rem] border-4 border-surface shadow-lg">
            <Image src={photo} alt="" fill sizes="9rem" className="object-cover" />
          </div>
          <HeartDoodle className="absolute bottom-1 left-1/2 z-10 size-12 -translate-x-1/2 text-primary" />
        </div>
        <div className="relative z-10 mt-2 space-y-3 text-center">
          <PawDoodle className="mx-auto size-8 text-secondary" />
          <AnimatedHeading
            id="match-title"
            as="h2"
            className="text-h2 text-text"
            parts={[{ text: t.discover.matchTitle }]}
          />
          <p className="font-display text-xl text-text">{item.title}</p>
          <p className="text-body-sm text-text-secondary">{t.discover.matched}</p>
          <Button variant="primary" className="w-full" onClick={onContinue}>
            {t.onboarding.continue}
          </Button>
        </div>
      </div>
    </div>
  );
}

function PeekCard({ item, label }: { item: DiscoverItem; label: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-10 top-0 h-[4.5rem] rounded-[2rem] bg-success-soft"
    >
      <div className="flex h-full flex-col justify-start px-5 pt-2">
        <p className="text-caption font-semibold text-success-ink">{label}</p>
        <p className="font-display text-h4 truncate text-text/70">{item.title}</p>
      </div>
    </div>
  );
}

export function DiscoverStack() {
  const t = useT();
  const { toast } = useToast();
  const [index, setIndex] = useState(0);
  const [matched, setMatched] = useState<DiscoverItem | null>(null);
  const items = getMockDiscoverItems(t);
  const item = items[index];
  const next = items[index + 1];

  if (!item) {
    return (
      <EmptyState
        illustration="dog"
        title={t.discover.empty}
        description={t.discover.subtitle}
      />
    );
  }

  const onAction = (action: DiscoverAction) => {
    if (action === "like" || action === "favorite") {
      const result = recordDiscoverAction(
        item.id,
        action,
        Boolean(item.reciprocates),
      );
      const message =
        result === "match"
          ? t.discover.matched
          : result === "favorite"
            ? t.discover.favorited
            : t.discover.liked;
      if (result === "match") {
        setMatched(item);
        return;
      }
      toast({ message, tone: "info" });
      setIndex((i) => i + 1);
      return;
    }

    const messages: Partial<Record<DiscoverAction, string>> = {
      skip: t.discover.skipped,
      report: t.discover.reported,
      share: t.discover.shared,
    };
    const message = messages[action];
    if (message) {
      toast({
        message,
        tone: action === "report" ? "warning" : "info",
      });
    }
    if (action === "skip") {
      setIndex((i) => i + 1);
    }
  };

  return (
    <div className="relative flex h-[calc(100dvh-8rem)] flex-col overflow-visible lg:h-[calc(100dvh-4rem)]">
      {matched ? (
        <MatchCelebration
          item={matched}
          onContinue={() => {
            setMatched(null);
            setIndex((i) => i + 1);
          }}
        />
      ) : null}
      <div className="relative min-h-0 flex-1">
        {next ? <PeekCard item={next} label={t.discover.peek} /> : null}
        <div className={next ? "relative z-10 h-full pt-8" : "relative z-10 h-full"}>
          <DiscoverCard key={item.id} item={item} onAction={onAction} />
        </div>
      </div>
    </div>
  );
}
