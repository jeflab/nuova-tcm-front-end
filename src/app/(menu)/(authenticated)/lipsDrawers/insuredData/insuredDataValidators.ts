import {
  isDenValid,
  LipWithDen,
} from "@/app/(menu)/(authenticated)/lipsDrawers/den/denValidators";
import {Lip} from "@/models/entities/lip";
import {PreliminaryData} from "@/models/preliminaryData";

export type LipWithInsuredData = LipWithDen & {
  insured: NonNullable<Lip["insured"]>;
};

export function isInsuredDataValid(
  lip: Lip | PreliminaryData | null,
): lip is LipWithInsuredData {
  if (!isDenValid(lip)) {
    return false;
  }

  if (!lip.insured?.fiscalCode) {
    return false;
  }

  return true;
}
