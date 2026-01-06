import {isLip, Lip} from "@/models/entities/lip";
import {PreliminaryData} from "@/models/preliminaryData";

export function fatcaValidators(lip: Lip | PreliminaryData): boolean {
  const contractorFatca = lip?.contractor?.fatca;

  const isContractorValid = isPersonFatcaValid(contractorFatca);
  if (!isContractorValid) {
    return false;
  }

  // Se è self-insured, basta la validazione del contraente
  if (lip.type === "self-insured") {
    return true;
  }

  // Se non abbiamo l'assicurato e la lip viene da db, poiché non ancora creato, diamo il beneficio del dubbio
  if (isLip(lip)) {
    return true;
  }

  // Altrimenti controlliamo l'assicurato
  return isPersonFatcaValid(lip?.insured?.fatca);
}

function isPersonFatcaValid(
  personFatca: NonNullable<PreliminaryData["contractor"]>["fatca"] | undefined,
): boolean {
  if (!personFatca) {
    return false;
  }

  return (
    personFatca.fatcaCheck?.response === "no" &&
    personFatca.residencyCheck?.response === "yes"
  );
}
