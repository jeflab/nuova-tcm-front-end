import {isLip, Lip} from "@/models/entities/lip";
import {PreliminaryData} from "@/models/preliminaryData";

export type LipWithContractorPep = Lip & {
  contractor: Lip["contractor"] & {
    pep: NonNullable<Lip["contractor"]["pep"]>;
  };
};

export function isContractorDataValid(
  lip: Lip | PreliminaryData | null,
): lip is LipWithContractorPep {
  if (!isLip(lip)) {
    return false;
  }

  if (!lip.contractor.pep) {
    return false;
  }

  return true;
}
