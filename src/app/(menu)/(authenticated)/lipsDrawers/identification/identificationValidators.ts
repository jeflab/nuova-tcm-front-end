import {
  isContractorDataValid,
  LipWithContractorPep
} from "@/app/(menu)/(authenticated)/lipsDrawers/contractorData/contractorDataValidators";
import {Lip} from "@/models/entities/lip";
import {PreliminaryData} from "@/models/preliminaryData";

export type LipWithContractorIdentification = LipWithContractorPep & {
  contractor: Lip["contractor"] & {
    identityDocument: NonNullable<Lip["contractor"]["identityDocument"]>;
  };
};

export function isContractorIdentificationValid(
  lip: Lip | PreliminaryData | null,
): lip is LipWithContractorIdentification {
  if (!isContractorDataValid(lip)) {
    return false;
  }

  if (
    !lip?.contractor?.identityDocument ||
    lip.contractor.identityDocument.length === 0
  ) {
    return false;
  }

  return true;
}

export function getValidIdentityDocument(lip: LipWithContractorIdentification) {
  const identityDocument = lip.contractor.identityDocument.at(-1);

  if (!identityDocument) {
    throw new Error("Nessun documento di identità trovato.");
  }

  return identityDocument;
}
