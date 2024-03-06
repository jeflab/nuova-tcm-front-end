"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";

export function ContractorPersonalAreaActivationSummary() {
  const contractor = useDrawerStore((state) => state.lip?.contractor);

  if (!contractor) {
    return null;
  }

  if (contractor.lastPrivacyEsignId === null) {
    return (
      <p className="mb-0">
        In attesa che il Contraente accetti e firmi la privacy
      </p>
    );
  }

  return <p className="mb-0">Area Contraente attivata</p>;
}
