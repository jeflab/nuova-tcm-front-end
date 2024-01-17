"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {Debug} from "@/ui/Debug";

export function FatcaRecap() {
  const fatcaData = useDrawerStore((state) => state.lipData.fatca);

  return (
    fatcaData === false && (
      <p className="mb-0">
        Il contraente non è residente negli Stati Uniti d'America
      </p>
    )
  );
}
