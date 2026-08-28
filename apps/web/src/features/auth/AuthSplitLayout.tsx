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

      <main className="relative flex h-full min-h-0 flex-col overflow-hidden bg-white px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
        <div className="mb-3 flex shrink-0 items-center justify-end">
          <LocaleSwitcher tone="light" variant="menu" />
        </div>

        <div className="mx-auto flex w-full max-w-lg min-h-0 flex-1 flex-col justify-center overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
