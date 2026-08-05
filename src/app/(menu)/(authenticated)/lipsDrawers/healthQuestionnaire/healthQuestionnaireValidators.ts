import {
  isQuoteValid,
  LipWithQuotation,
} from "@/app/(menu)/(authenticated)/lipsDrawers/quote/quoteValidators";
import {Lip} from "@/models/entities/lip";
import {PreliminaryData} from "@/models/preliminaryData";

export type LipWithHealthQuestionnaire = LipWithQuotation & {
  healthcareQuestionnaire: NonNullable<Lip["healthcareQuestionnaire"]>;
};
export function isHealthcareQuestionnaireValid(
  lip: Lip | PreliminaryData | null,
): lip is LipWithHealthQuestionnaire {
  if (!isQuoteValid(lip)) {
    return false;
  }

  if (!lip.healthcareQuestionnaire) {
    return false;
  }

  return true;
}
