"use client";

import {
  Briefcase,
  Building2,
  HandHeart,
  HeartHandshake,
  HelpCircle,
  Home,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useToast } from "@/components/Toast";
import { useT } from "@/i18n";
import { IntentionSelector } from "./components/IntentionSelector";
import { OTHER_ROLE_IDS } from "./data";
import { OnboardingLayout } from "./OnboardingLayout";
import { useOnboarding } from "./OnboardingProvider";
import { useOnboardingNavigation } from "./useOnboardingNavigation";
import type { OtherRole } from "./types";

const ICONS: Record<OtherRole, LucideIcon> = {
  independent_protector: HeartHandshake,
  foster_home: Home,
  volunteer: HandHeart,
  animal_professional: Briefcase,
  animal_business: Building2,
  community_member: Users,
  other: HelpCircle,
};

export function RoleSelectionStep() {
  const t = useT();
  const { toast } = useToast();
  const { draft, dispatch } = useOnboarding();
  const nav = useOnboardingNavigation("role-selection");

  const continueNext = () => {
    if (!draft.otherRole) {
      toast({ message: t.onboarding.otherRoles.needOne, tone: "warning" });
      return;
    }
    nav.goNext();
  };

  const options = OTHER_ROLE_IDS.map((id) => ({
    id,
    title: t.onboarding.otherRoles.items[id].title,
    description: t.onboarding.otherRoles.items[id].description,
    icon: ICONS[id],
  }));

  return (
    <OnboardingLayout
      step="role-selection"
      title={t.onboarding.otherRoles.title}
      subtitle={t.onboarding.otherRoles.subtitle}
      onContinue={continueNext}
      continueDisabled={!draft.otherRole}
      compact
    >
      <IntentionSelector
        multi={false}
        options={options}
        selected={draft.otherRole ? [draft.otherRole] : []}
        onToggle={(id) => dispatch({ type: "setOtherRole", otherRole: id })}
      />
    </OnboardingLayout>
  );
}
