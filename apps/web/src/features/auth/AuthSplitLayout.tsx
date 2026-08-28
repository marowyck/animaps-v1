"use client";

import type { ReactNode } from "react";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { AuthImageCarousel } from "./AuthImageCarousel";

type AuthSplitLayoutProps = {
  children: ReactNode;
};

export function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  return (
    <div className="grid min-h-dvh bg-white lg:h-dvh lg:max-h-dvh lg:grid-cols-[minmax(0,2fr)_minmax(22rem,1fr)] lg:overflow-hidden">
      <aside className="relative hidden h-full min-h-0 lg:block">
        <AuthImageCarousel />
      </aside>

      <main className="relative flex min-h-dvh flex-col bg-white lg:h-full lg:min-h-0 lg:overflow-hidden">
        <div className="flex shrink-0 items-center justify-end px-4 pt-3 sm:px-6 lg:px-8 lg:pt-4">
          <LocaleSwitcher tone="light" variant="menu" />
        </div>

        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-start overflow-y-auto overscroll-contain px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2 sm:px-6 lg:min-h-0 lg:justify-center lg:px-8 lg:pb-6 lg:pt-3">
          {children}
        </div>
      </main>
    </div>
  );
}
