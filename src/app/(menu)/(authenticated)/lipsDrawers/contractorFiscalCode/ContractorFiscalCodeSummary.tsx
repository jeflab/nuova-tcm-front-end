"use client";

import {getLipQuery} from "@/app/(menu)/(authenticated)/lips/[id]/queries";
import {
  isContractorAlreadyRegistered,
  isContractorFiscalCodeActive,
} from "@/app/(menu)/(authenticated)/lipsDrawers/contractorFiscalCode/contractorFiscalCodeValidators";
import {validateLipIdOrNotFound} from "@/app/(menu)/(authenticated)/lipsDrawers/validateLipIdOrNotFound";
import {faCheck, faXmark} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useSuspenseQuery} from "@tanstack/react-query";
import {useParams} from "next/navigation";

export function ContractorFiscalCodeSummary() {
  const lipId = validateLipIdOrNotFound(useParams<{id: string}>().id);
  const {
    data: {lip},
  } = useSuspenseQuery(getLipQuery(lipId));

  const contractorAlreadyRegistered = isContractorAlreadyRegistered(lip);

  if (isContractorFiscalCodeActive(lip)) {
    return null;
  }

  if (contractorAlreadyRegistered) {
    return (
      <p className="mb-0">
        <FontAwesomeIcon icon={faXmark} className="text-danger" fixedWidth />{" "}
        Non è possibile continuare la consulenza poiché il Contraente risulta
        già censito da un altro Intermediario
      </p>
    );
  }

  return (
    <p className="mb-0">
      <FontAwesomeIcon icon={faCheck} className="text-success" fixedWidth /> Il
      codice fiscale del Contraente è corretto
    </p>
  );
}
