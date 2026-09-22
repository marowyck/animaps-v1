"use client";

import {
  AlertTriangle,
  Briefcase,
  Compass,
  HandHeart,
  HeartHandshake,
  HelpCircle,
  Home,
  LifeBuoy,
  Megaphone,
  PawPrint,
  Search,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useToast } from "@/components/Toast";
import { useT } from "@/i18n";
import { IntentionSelector } from "./components/IntentionSelector";
import { INTENTION_IDS } from "./data";
import { OnboardingLayout } from "./OnboardingLayout";
import { useOnboarding } from "./OnboardingProvider";
import { useOnboardingNavigation } from "./useOnboardingNavigation";
import type { UserIntention } from "./types";

const ICONS: Record<UserIntention, LucideIcon> = {
  adopt: PawPrint,
  pet_owner: HeartHandshake,
  help_animals: HelpCircle,
  volunteer: HandHeart,
  foster_home: Home,
  independent_protector: LifeBuoy,
  animal_professional: Briefcase,
  report: AlertTriangle,
  lost_animal: Search,
  found_animal: Megaphone,
  community: Users,
  explore: Compass,
};

export function IntentionStep() {
  const t = useT();
  const { toast } = useToast();
  const { draft, dispatch } = useOnboarding();
  const nav = useOnboardingNavigation("intentions");

  const continueNext = () => {
    if (draft.intentions.length === 0) {
      toast({ message: t.onboarding.intention.needOne, tone: "warning" });
      return;
    }
    nav.goNext();
  };

  const options = INTENTION_IDS.map((id) => ({
    id,
    title: t.onboarding.intention.items[id].title,
    description: t.onboarding.intention.items[id].description,
    icon: ICONS[id],
  }));

  return (
    <OnboardingLayout
      step="intentions"
      title={t.onboarding.intention.title}
      subtitle={t.onboarding.intention.subtitle}
      onContinue={continueNext}
      continueDisabled={draft.intentions.length === 0}
      compact
    >
      <IntentionSelector
        options={options}
        selected={draft.intentions}
        onToggle={(id) => dispatch({ type: "toggleIntention", intention: id })}
      />
    </OnboardingLayout>
  );
}
