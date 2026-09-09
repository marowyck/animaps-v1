"use client";

import type { ReactNode } from "react";
import { ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { useT } from "@/i18n";
import { useOnboardingNavigation } from "./useOnboardingNavigation";
import type { OnboardingStepId } from "./types";

type OnboardingLayoutProps = {
  step: OnboardingStepId;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onContinue?: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  continueLoading?: boolean;
  onSkip?: () => void;
  showSkip?: boolean;
  backHref?: string;
  closeHref?: string;
  /** Center primary CTA under content (e.g. guidelines). */
  footerAlign?: "end" | "center";
  /** Tighter spacing so dense grids fit without scroll. */
  compact?: boolean;
  /** Override progress (defaults to dynamic flow progress). */
  progressCurrent?: number;
  progressTotal?: number;
};

export function OnboardingLayout({
  step,
  title,
  subtitle,
  children,
  onContinue,
  continueLabel,
  continueDisabled = false,
  continueLoading = false,
  onSkip,
  showSkip = false,
  backHref,
  closeHref = "/",
  footerAlign = "end",
  compact = false,
  progressCurrent,
  progressTotal,
}: OnboardingLayoutProps) {
  const t = useT();
  const router = useRouter();
  const nav = useOnboardingNavigation(step);
  const current = progressCurrent ?? nav.current;
  const total = progressTotal ?? nav.total;

  return (
    <div
      className={[
        "mx-auto flex min-h-dvh w-full flex-col px-4 sm:px-6",
        compact ? "max-w-4xl pb-4 pt-3" : "max-w-2xl pb-8 pt-4",
      ].join(" ")}
    >
      <header
        className={["flex items-center justify-between gap-2", compact ? "mb-2" : "mb-4"].join(
          " ",
        )}
      >
        <IconButton
          label={t.onboarding.back}
          onClick={() =>
            backHref
              ? router.push(backHref)
              : nav.previousHref
                ? router.push(nav.previousHref)
                : router.back()
          }
        >
          <ArrowLeft className="size-5" aria-hidden />
        </IconButton>
        <span className="font-display text-lg tracking-tight text-ink">ANIMAPS</span>
        <IconButton label={t.onboarding.close} onClick={() => router.push(closeHref)}>
          <X className="size-5" aria-hidden />
        </IconButton>
      </header>

      <ProgressIndicator
        current={current}
        total={total}
        label={t.onboarding.stepOf
          .replace("{current}", String(current))
          .replace("{total}", String(total))}
        className={compact ? "mb-3" : "mb-6"}
      />

      <div key={step} className="flex min-h-0 flex-1 flex-col animate-fade-in-up">
        <div className={["space-y-1", compact ? "mb-3" : "mb-6 space-y-2"].join(" ")}>
          <h1
            className={[
              "font-display leading-tight text-ink",
              compact ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl",
            ].join(" ")}
          >
            {title}
          </h1>
          {subtitle ? (
            <p className={["text-ink-muted", compact ? "text-sm" : "text-base"].join(" ")}>
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="min-h-0 flex-1">{children}</div>

        <div
          className={[
            "mt-4 flex flex-col gap-3 sm:flex-row sm:items-center",
            footerAlign === "center" ? "sm:justify-center" : "",
            compact ? "mt-3" : "mt-8",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {showSkip && onSkip ? (
            <Button
              variant="ghost"
              size="sm"
              className={[
                "order-2",
                footerAlign === "center" ? "sm:order-1" : "sm:order-1",
              ].join(" ")}
              onClick={onSkip}
            >
              {t.onboarding.skip}
            </Button>
          ) : footerAlign === "end" ? (
            <span className="hidden sm:block sm:flex-1" />
          ) : null}
          {onContinue ? (
            <Button
              variant="pink"
              size="md"
              className={[
                "order-1 w-full sm:order-2 sm:w-auto",
                footerAlign === "center" ? "sm:min-w-[14rem]" : "sm:ml-auto",
              ].join(" ")}
              disabled={continueDisabled || continueLoading}
              onClick={onContinue}
            >
              {continueLoading
                ? t.onboarding.loading
                : (continueLabel ?? t.onboarding.continue)}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
