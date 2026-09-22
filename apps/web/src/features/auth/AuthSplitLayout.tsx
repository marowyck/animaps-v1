"use client";

import type { ReactNode } from "react";
import { Blob } from "@/components/bits";
import { PawDoodle } from "@/components/illustrations/Doodles";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { useT } from "@/i18n";
import { AuthImageCarousel } from "./AuthImageCarousel";

type AuthSplitLayoutProps = {
  children: ReactNode;
};

export function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  const t = useT();
  return (
    <div className="grid h-dvh max-h-dvh grid-rows-[36vh_minmax(0,1fr)] overflow-hidden bg-background lg:grid-cols-[minmax(0,3fr)_minmax(18rem,1fr)] lg:grid-rows-1">
      <aside className="relative h-full min-h-0">
        <AuthImageCarousel />
      </aside>

      <main className="relative flex h-full min-h-0 flex-col overflow-hidden bg-background">
        <Blob variant={1} className="absolute -top-16 -right-10 size-40 text-primary/15" />
        <Blob variant={2} className="absolute -bottom-16 -left-8 size-44 text-secondary/15" />
        <div className="relative z-10 flex shrink-0 items-center justify-between px-4 pt-3 lg:px-4 lg:pt-4">
          <span className="inline-flex items-center gap-2 font-display text-lg text-text">
            <PawDoodle className="size-5 text-primary" />
            {t.brand}
          </span>
          <LocaleSwitcher tone="light" variant="menu" />
        </div>

        <div
          data-lenis-prevent
          className="relative z-10 min-h-0 w-full flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 lg:px-4 lg:pb-5"
        >
          <div className="mx-auto flex min-h-full w-full max-w-sm flex-col justify-center">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
