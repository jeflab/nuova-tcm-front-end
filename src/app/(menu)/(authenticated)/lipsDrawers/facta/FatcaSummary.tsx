"use client";

import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";

export function FatcaSummary() {
  const fatcaPreliminary = useStore((state) => state.preliminaryData.fatca);
  const residencyPreliminary = useStore(
    (state) => state.preliminaryData.italianResidency,
  );

  const fatcaLip = useStore(
    (state) => state.lip?.contractor?.fatca.fatcaCheck.response,
  );
  const residencyLip = useStore(
    (state) => state.lip?.contractor?.fatca.residencyCheck.response,
  );

  const fatcaData = fatcaLip ?? fatcaPreliminary;
  const residencyData = residencyLip ?? residencyPreliminary;

  if (fatcaData === "yes") {
    return (
      <p className="mb-0">
        Non è possibile continuare la consulenza poiché il Contraente è
        residente negli Stati Uniti d'America.
      </p>
    );
  }

  if (residencyData === "no") {
    return (
      <p className="mb-0">
        Non è possibile continuare la consulenza poiché il Contraente non è
        residente in Italia.
      </p>
    );
  }

  if (fatcaData === "no" && residencyData === "yes") {
    return (
      <p className="mb-0">
        Il Contraente è residente in Italia e non è residente negli Stati Uniti
        d'America
      </p>
    );
  }
}
