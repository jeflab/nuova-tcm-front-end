import {
  isHealthcareQuestionnaireValid,
  LipWithHealthQuestionnaire,
} from "@/app/(menu)/(authenticated)/lipsDrawers/healthQuestionnaire/healthQuestionnaireValidators";
import {Lip} from "@/models/entities/lip";
import {PreliminaryData} from "@/models/preliminaryData";

export type LipWithBeneficiaries = LipWithHealthQuestionnaire & {
  beneficiaries: NonNullable<Lip["beneficiaries"]>;
};
export function isBeneficiariesValid(
  lip: Lip | PreliminaryData | null,
): lip is LipWithBeneficiaries {
  if (!isHealthcareQuestionnaireValid(lip)) {
    return false;
  }

  if (!lip?.beneficiaries) {
    return false;
  }

  return true;
}
