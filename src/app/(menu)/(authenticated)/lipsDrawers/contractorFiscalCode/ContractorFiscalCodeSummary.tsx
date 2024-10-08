"use client";

import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";

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
        Non è possibile continuare la consulenza poiché il Contraente risulta
        già censito da un altro Intermediario
      </p>
    );
  }

  return <p className="mb-0">Il codice fiscale del Contraente è corretto</p>;
}
