"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Blob } from "@/components/bits";
import { PawDoodle } from "@/components/illustrations/Doodles";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { usePageEnter } from "@/hooks/usePageEnter";
import { useT } from "@/i18n";
import { AuthImageCarousel } from "./AuthImageCarousel";

type AuthSplitLayoutProps = {
  children: ReactNode;
};

export function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  const t = useT();
  const pathname = usePathname();
  const contentRef = usePageEnter(pathname);

  return (
    <div className="grid h-dvh max-h-dvh grid-rows-[26vh_minmax(0,1fr)] overflow-hidden bg-background sm:grid-rows-[30vh_minmax(0,1fr)] lg:grid-cols-[minmax(0,1.45fr)_minmax(24rem,1fr)] lg:grid-rows-1">
      <aside className="relative h-full min-h-0">
        <AuthImageCarousel />
      </aside>

      <main className="relative flex h-full min-h-0 flex-col overflow-hidden bg-background">
        <Blob variant={1} className="absolute -top-16 -right-10 size-40 text-primary/15" />
        <Blob variant={2} className="absolute -bottom-16 -left-8 size-44 text-secondary/15" />
        <div className="relative z-10 flex shrink-0 items-center justify-between px-5 pt-3.5 sm:px-6 lg:px-8 lg:pt-5">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-full font-display text-lg text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <PawDoodle className="size-5 text-primary" />
            {t.brand}
          </Link>
          <LocaleSwitcher tone="light" variant="menu" />
        </div>

        <div
          data-lenis-prevent
          className="relative z-10 min-h-0 w-full flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 sm:px-6 lg:px-8 lg:pb-6"
        >
          <div ref={contentRef} className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
