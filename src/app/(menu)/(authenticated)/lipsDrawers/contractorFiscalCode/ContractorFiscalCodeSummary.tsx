"use client";

import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {faCheck, faXmark} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export function ContractorFiscalCodeSummary() {
  const contractorAlreadyRegistered = useStore(
    (state) => state.preliminaryData.contractorAlreadyRegistered,
  );

  const contractorFiscalCodeDataPreliminary = useStore(
    (state) => state.preliminaryData.contractorPersonalData,
  );
  const contractorFiscalCodeDataLip = useStore(
    (state) => state.lip?.contractor?.fiscalCode,
  );

  const contractorFiscalCodeData =
    contractorFiscalCodeDataLip ?? contractorFiscalCodeDataPreliminary;

  if (!contractorFiscalCodeData && !contractorAlreadyRegistered) {
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
