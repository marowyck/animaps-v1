"use client";

import { MapPin } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { useT } from "@/i18n";
import { OrganizationForm } from "./components/OrganizationForm";
import { VeterinaryForm } from "./components/VeterinaryForm";
import { OnboardingLayout } from "./OnboardingLayout";
import { useOnboarding } from "./OnboardingProvider";
import { useOnboardingNavigation } from "./useOnboardingNavigation";

/** Shared location step — org vs clinic form based on userType. */
export function LocationStep() {
  const t = useT();
  const { draft, dispatch, userType } = useOnboarding();
  const nav = useOnboardingNavigation("location");

  const isClinic = userType === "VETERINARY_CLINIC";
  const title = isClinic
    ? t.onboarding.clinic.titles.locationTitle
    : t.onboarding.organization.titles.locationTitle;
  const subtitle = isClinic
    ? t.onboarding.clinic.titles.locationSubtitle
    : t.onboarding.organization.titles.locationSubtitle;

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      dispatch({ type: "setLocationPermission", permission: "denied" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        dispatch({ type: "setLocationPermission", permission: "granted" });
      },
      () => {
        dispatch({ type: "setLocationPermission", permission: "denied" });
      },
      { enableHighAccuracy: false, timeout: 8000 },
    );
  };

  return (
    <OnboardingLayout
      step="location"
      title={title}
      subtitle={subtitle}
      onContinue={() => nav.goNext()}
      showSkip
      onSkip={() => nav.goSkip()}
    >
      <div className="space-y-4">
        <Card className="flex flex-col items-start gap-3 p-4 sm:flex-row sm:items-center">
          <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-pastel-green text-brand-green">
            <MapPin className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-ink">{t.onboarding.location.title}</p>
            <p className="text-xs text-ink-muted">{t.onboarding.location.body}</p>
          </div>
          <Button variant="soft" size="sm" onClick={requestLocation}>
            {t.onboarding.location.allow}
          </Button>
        </Card>

        {isClinic ? (
          <VeterinaryForm
            mode="location"
            value={draft.veterinary}
            onChange={(patch) => dispatch({ type: "patchVeterinary", patch })}
          />
        ) : (
          <OrganizationForm
            mode="location"
            value={draft.organization}
            onChange={(patch) => dispatch({ type: "patchOrganization", patch })}
          />
        )}
      </div>
    </OnboardingLayout>
  );
}
