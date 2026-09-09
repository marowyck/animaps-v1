"use client";

import { useT } from "@/i18n";
import { OrganizationForm } from "./components/OrganizationForm";
import { VeterinaryForm } from "./components/VeterinaryForm";
import { OnboardingLayout } from "./OnboardingLayout";
import { useOnboarding } from "./OnboardingProvider";
import { useOnboardingNavigation } from "./useOnboardingNavigation";

/** Shared services step for ONG toggles vs clinic service cards. */
export function ServicesStep() {
  const t = useT();
  const { draft, dispatch, userType } = useOnboarding();
  const nav = useOnboardingNavigation("services");
  const isClinic = userType === "VETERINARY_CLINIC";

  return (
    <OnboardingLayout
      step="services"
      title={
        isClinic
          ? t.onboarding.clinic.titles.servicesTitle
          : t.onboarding.organization.titles.servicesTitle
      }
      subtitle={
        isClinic
          ? t.onboarding.clinic.titles.servicesSubtitle
          : t.onboarding.organization.titles.servicesSubtitle
      }
      onContinue={() => nav.goNext()}
      showSkip
      onSkip={() => nav.goSkip()}
    >
      {isClinic ? (
        <VeterinaryForm
          mode="services"
          value={draft.veterinary}
          onChange={(patch) => dispatch({ type: "patchVeterinary", patch })}
        />
      ) : (
        <OrganizationForm
          mode="services"
          value={draft.organization}
          onChange={(patch) => dispatch({ type: "patchOrganization", patch })}
        />
      )}
    </OnboardingLayout>
  );
}
