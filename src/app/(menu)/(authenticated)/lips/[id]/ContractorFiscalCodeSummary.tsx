"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";

export function ContractorFiscalCodeSummary() {
  const contractorAlreadyRegistered = useDrawerStore(
    (state) => state.preliminaryData.contractorAlreadyRegistered,
  );

  const contractorFiscalCodeDataPreliminary = useDrawerStore(
    (state) => state.preliminaryData.contractorPersonalData,
  );
  const contractorFiscalCodeDataLip = useDrawerStore(
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
        Non è possibile continuare la consulenza poiché il contraente risulta
        già censito da un altro agente
      </p>
    );
  }

  return <p className="mb-0">Il codice fiscale del contraente è corretto</p>;
}
