"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";

export function ContractorFiscalCodeSummary() {
  const contractorFiscalCodeData = useDrawerStore(
    (state) => state.lipData.contractorFiscalCode,
  );
  const agentId = useDrawerStore((state) => state.lipData.agentId);

  if (!contractorFiscalCodeData) {
    return null;
  }

  if (!!agentId && agentId !== 2) {
    return (
      <p className="mb-0">
        Non è possibile continuare la consulenza poiché il contraente risulta
        già censito da un altro agente
      </p>
    );
  }

  return <p className="mb-0">Il codice fiscale del contraente è corretto</p>;
}
