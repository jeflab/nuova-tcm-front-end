"use client";

import {
  isContractorAlreadyRegistered,
  isContractorFiscalCodeActive,
} from "@/app/(menu)/(authenticated)/lipsDrawers/contractorFiscalCode/contractorFiscalCodeValidators";
import {useSuspenseLip} from "@/app/(menu)/(authenticated)/lipsDrawers/useSuspenseLip";
import {faCheck, faXmark} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export function ContractorFiscalCodeSummary() {
  const {
    data: {lip},
  } = useSuspenseLip();

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
