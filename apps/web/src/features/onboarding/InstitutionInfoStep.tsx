"use client";

import { Input } from "@/components/Input";
import { useToast } from "@/components/Toast";
import { useT } from "@/i18n";
import { OnboardingLayout } from "./OnboardingLayout";
import { useOnboarding } from "./OnboardingProvider";
import { useOnboardingNavigation } from "./useOnboardingNavigation";

export function InstitutionInfoStep() {
  const t = useT();
  const { toast } = useToast();
  const { draft, dispatch } = useOnboarding();
  const nav = useOnboardingNavigation("institution-info");
  const copy = t.onboarding.institution;
  const inst = draft.institution;

  const continueNext = () => {
    if (!inst.officialName.trim() || !inst.publicName.trim()) {
      toast({ message: t.form.errors.requiredFields, tone: "warning" });
      return;
    }
    nav.goNext();
  };

  const patchInst = (patch: Partial<typeof inst>) => {
    dispatch({ type: "patchInstitution", patch });
  };

  return (
    <OnboardingLayout
      step="institution-info"
      title={copy.infoTitle}
      subtitle={copy.infoSubtitle}
      onContinue={continueNext}
      continueDisabled={!inst.officialName.trim() || !inst.publicName.trim()}
    >
      <div className="mx-auto flex max-w-lg flex-col gap-6">
        <fieldset className="space-y-3">
          <legend className="text-sm font-bold text-ink">
            {copy.sectionIdentity}
          </legend>
          <Input
            label={copy.officialName}
            value={inst.officialName}
            onChange={(e) => patchInst({ officialName: e.target.value })}
            required
          />
          <Input
            label={copy.publicName}
            value={inst.publicName}
            onChange={(e) => patchInst({ publicName: e.target.value })}
            required
          />
          <Input
            label={copy.description}
            value={inst.description}
            onChange={(e) => patchInst({ description: e.target.value })}
          />
        </fieldset>
        <fieldset className="space-y-3">
          <legend className="text-sm font-bold text-ink">
            {copy.sectionContact}
          </legend>
          <Input
            label={copy.email}
            type="email"
            value={inst.email}
            onChange={(e) => patchInst({ email: e.target.value })}
          />
          <Input
            label={copy.emailDomain}
            value={inst.emailDomain}
            onChange={(e) => patchInst({ emailDomain: e.target.value })}
            placeholder="prefeitura.sp.gov.br"
          />
          <Input
            label={copy.phone}
            value={inst.phone}
            onChange={(e) => patchInst({ phone: e.target.value })}
          />
          <Input
            label={copy.website}
            value={inst.website}
            onChange={(e) => patchInst({ website: e.target.value })}
          />
        </fieldset>
        <fieldset className="space-y-3">
          <legend className="text-sm font-bold text-ink">
            {copy.sectionOps}
          </legend>
          <Input
            label={copy.responsibleDepartment}
            value={inst.responsibleDepartment}
            onChange={(e) =>
              patchInst({ responsibleDepartment: e.target.value })
            }
          />
          <Input
            label={copy.dataResponsibleArea}
            value={inst.dataResponsibleArea}
            onChange={(e) => patchInst({ dataResponsibleArea: e.target.value })}
          />
        </fieldset>
      </div>
    </OnboardingLayout>
  );
}
