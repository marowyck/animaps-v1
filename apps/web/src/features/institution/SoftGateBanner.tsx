"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/Button";
import { useT } from "@/i18n";

type SoftGateBannerProps = {
  /** Compact single-line vs full pending workspace copy. */
  variant?: "banner" | "panel";
  className?: string;
};

export function SoftGateBanner({
  variant = "banner",
  className = "",
}: SoftGateBannerProps) {
  const t = useT();

  if (variant === "panel") {
    return (
      <div
        className={[
          "rounded-3xl border-2 border-warning-border bg-warning-soft px-5 py-6",
          className,
        ].join(" ")}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-(--honey-700)" />
          <div className="min-w-0 space-y-2">
            <h2 className="text-h4 text-text">
              {t.institution.softGate.title}
            </h2>
            <p className="text-body-sm text-text-secondary">
              {t.institution.softGate.body}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button href="/institution" variant="pink" size="sm">
                {t.institution.softGate.ctaProfile}
              </Button>
              <Button href="/settings" variant="ghost" size="sm">
                {t.institution.softGate.ctaSettings}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <p
      className={[
        "text-body-sm rounded-2xl border border-warning-border bg-warning-soft px-4 py-3 font-semibold text-text",
        className,
      ].join(" ")}
    >
      {t.institution.softGate.banner}{" "}
      <Link href="/institution" className="underline underline-offset-2">
        {t.institution.softGate.ctaProfile}
      </Link>
    </p>
  );
}
