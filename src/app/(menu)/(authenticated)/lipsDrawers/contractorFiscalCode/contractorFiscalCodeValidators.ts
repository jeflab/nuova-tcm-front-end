import type {Lip} from "@/models/entities/lip";
import type {PreliminaryData} from "@/models/preliminaryData";

export function isContractorAlreadyRegistered(lip: Lip | PreliminaryData) {
  return (
    "contractorAlreadyRegistered" in lip && !!lip.contractorAlreadyRegistered
  );
}

export function isContractorFiscalCodeActive(
  lip: Lip | PreliminaryData,
): boolean {
  return !isContractorAlreadyRegistered(lip) && !lip.contractor?.fiscalCode;
}

export function isContractorFiscalCodeValid(
  lip: Lip | PreliminaryData,
): boolean {
  return !isContractorAlreadyRegistered(lip) && !!lip.contractor?.fiscalCode;
}
