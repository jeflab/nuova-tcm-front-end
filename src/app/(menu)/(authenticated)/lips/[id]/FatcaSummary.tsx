"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";

export function FatcaSummary() {
  const fatcaData = useDrawerStore((state) => state.preliminaryData.fatca);

  if (fatcaData === "yes") {
    return (
      <p className="mb-0">
        Non è possibile continuare la consulenza poiché il contraente è
        residente negli Stati Uniti d'America.
      </p>
    );
  }

  if (fatcaData === "no") {
    return (
      <p className="mb-0">
        Il contraente non è residente negli Stati Uniti d'America
      </p>
    );
  }
}
