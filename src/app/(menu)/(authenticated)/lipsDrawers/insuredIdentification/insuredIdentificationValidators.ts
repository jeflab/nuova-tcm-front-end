import {
  isInsuredDataValid,
  LipWithInsuredData,
} from "@/app/(menu)/(authenticated)/lipsDrawers/insuredData/insuredDataValidators";
import {Lip} from "@/models/entities/lip";
import {PreliminaryData} from "@/models/preliminaryData";

export type LipWithInsuredIdentification = LipWithInsuredData & {
  insured: Lip["insured"] & {
    identityDocument: NonNullable<
      NonNullable<Lip["insured"]>["identityDocument"]
    >;
  };
};
export function isInsuredIdentificationValid(
  lip: Lip | PreliminaryData | null,
): lip is LipWithInsuredIdentification {
  if (!isInsuredDataValid(lip)) {
    return false;
  }

  if (
    !lip.insured.identityDocument ||
    lip.insured.identityDocument.length === 0
  ) {
    return false;
  }

  return true;
}
