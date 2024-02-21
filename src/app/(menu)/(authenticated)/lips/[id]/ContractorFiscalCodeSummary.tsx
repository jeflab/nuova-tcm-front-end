"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";

export function ContractorFiscalCodeSummary() {
  const contractorFiscalCodeData = useDrawerStore(
    (state) => state.preliminaryData.contractorPersonalData,
  );
  const contractorAlreadyRegistered = useDrawerStore(
    (state) => state.preliminaryData.contractorAlreadyRegistered,
  );

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
