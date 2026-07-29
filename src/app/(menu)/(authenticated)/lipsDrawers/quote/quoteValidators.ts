import {
  isInsuredIdentificationValid,
  LipWithInsuredIdentification,
} from "@/app/(menu)/(authenticated)/lipsDrawers/insuredIdentification/insuredIdentificationValidators";
import {Lip} from "@/models/entities/lip";
import {PreliminaryData} from "@/models/preliminaryData";

export type LipWithQuotation = LipWithInsuredIdentification & {
  quotation: NonNullable<Lip["quotation"]>;
};
export function isQuoteValid(
  lip: Lip | PreliminaryData | null,
): lip is LipWithQuotation {
  if (!isInsuredIdentificationValid(lip)) {
    return false;
  }

  if (!lip.quotation?.premium) {
    return false;
  }

  return true;
}
