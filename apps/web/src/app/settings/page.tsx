"use client";

import { Globe, ShieldCheck, UserRound } from "lucide-react";
import { DashboardShell } from "@/features/dashboard";
import { InstitutionProfile } from "@/features/institution";
import { useOnboarding } from "@/features/onboarding";
import { labelUserType, useT } from "@/i18n";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ProfileAvatar } from "@/components/ProfileAvatar";
import { LoadingState } from "@/components/StateBlocks";
import { useToast } from "@/components/Toast";
import { writeCookieConsent } from "@/features/consent/storage";

export default function SettingsPage() {
  const t = useT();
  const { toast } = useToast();
  const { ready, userType, draft } = useOnboarding();

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4">
        <LoadingState title={t.common.loading} />
      </div>
    );
  }

  return (
    <DashboardShell displayName={draft.displayName}>
      {userType === "INSTITUTION" ? (
        <InstitutionProfile mode="settings" />
      ) : (
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          <header className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-h1 text-text">
                {t.institution.settings.genericTitle}
              </h1>
              <p className="mt-2 max-w-md text-body-sm text-text-secondary">
                {t.institution.settings.genericBody}
              </p>
            </div>
            <Badge tone="primary">{labelUserType(t, userType)}</Badge>
          </header>

          <Card className="flex flex-col gap-4 border border-border-subtle sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
              <ProfileAvatar name={draft.displayName ?? t.brand} size="md" />
              <div className="min-w-0">
                <p className="truncate font-display text-h4 text-text">
                  {draft.displayName ?? t.profilePage.title}
                </p>
                <p className="truncate text-body-sm text-text-secondary">
                  {draft.email ?? t.profilePage.subtitle}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button href="/profile" variant="primary" size="sm">
                <UserRound className="size-4" aria-hidden />
                {t.dashboard.nav.profile}
              </Button>
              <Button href="/onboarding/guidelines" variant="outline" size="sm">
                {t.onboarding.continue}
              </Button>
            </div>
          </Card>

          <Card className="space-y-3 border border-border-subtle">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-secondary-soft text-secondary-ink">
                <Globe className="size-4" aria-hidden />
              </span>
              <div>
                <h2 className="text-h4 text-text">{t.nav.language}</h2>
                <p className="text-caption text-text-secondary">{t.nav.languageAria}</p>
              </div>
            </div>
            <LocaleSwitcher tone="light" variant="pills" className="max-w-xs" />
          </Card>

          <Card className="space-y-3 border border-border-subtle">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-success-soft text-success-ink">
                <ShieldCheck className="size-4" aria-hidden />
              </span>
              <div>
                <h2 className="text-h4 text-text">{t.cookies.aria}</h2>
                <p className="text-body-sm text-text-secondary">{t.cookies.body}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                type="button"
                variant="soft"
                size="sm"
                onClick={() => {
                  writeCookieConsent("accepted");
                  toast({ message: t.cookies.accept, tone: "success" });
                }}
              >
                {t.cookies.accept}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  writeCookieConsent("rejected");
                  toast({ message: t.cookies.reject, tone: "info" });
                }}
              >
                {t.cookies.reject}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </DashboardShell>
  );
}
