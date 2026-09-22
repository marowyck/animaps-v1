"use client";

import type { ReactNode } from "react";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { AuthImageCarousel } from "./AuthImageCarousel";

type AuthSplitLayoutProps = {
  children: ReactNode;
};

export function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  return (
    <div className="grid h-dvh max-h-dvh overflow-hidden bg-white lg:grid-cols-[minmax(0,2fr)_minmax(22rem,1fr)]">
      <aside className="relative hidden h-full min-h-0 lg:block">
        <AuthImageCarousel />
      </aside>

      <main className="relative flex h-full min-h-0 flex-col overflow-hidden bg-white">
        <div className="flex shrink-0 items-center justify-end px-4 pt-3 sm:px-6 lg:px-8 lg:pt-4">
          <LocaleSwitcher tone="light" variant="menu" />
        </div>

        <div
          data-lenis-prevent
          className="mx-auto min-h-0 w-full max-w-lg flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2 sm:px-6 lg:px-8 lg:pb-6 lg:pt-3"
        >
          <div className="flex min-h-full flex-col justify-center">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
