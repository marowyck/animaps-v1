"use client";

import { useT } from "@/i18n";
import { AnimalPreferenceForm } from "./components/AnimalPreferenceForm";
import { OnboardingLayout } from "./OnboardingLayout";
import { useOnboarding } from "./OnboardingProvider";
import { useOnboardingNavigation } from "./useOnboardingNavigation";

export function AnimalPreferencesCompositeStep() {
  const t = useT();
  const { draft, dispatch } = useOnboarding();
  const nav = useOnboardingNavigation("animal-preferences");

  return (
    <OnboardingLayout
      step="animal-preferences"
      title={t.onboarding.preferences.title}
      subtitle={t.onboarding.preferences.subtitle}
      onContinue={() => nav.goNext()}
      showSkip
      onSkip={() => nav.goSkip()}
      compact
    >
      <AnimalPreferenceForm
        animalTypes={draft.animalTypes}
        animalSizes={draft.animalSizes}
        animalFilters={draft.animalFilters}
        onToggleType={(id) =>
          dispatch({ type: "toggleAnimalType", animalType: id })
        }
        onToggleSize={(id) =>
          dispatch({ type: "toggleAnimalSize", animalSize: id })
        }
        onChangeFilters={(animalFilters) =>
          dispatch({ type: "setAnimalFilters", animalFilters })
        }
      />
    </OnboardingLayout>
  );
}
