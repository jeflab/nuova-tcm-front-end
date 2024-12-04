"use client";

import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";

export function TypeSummary() {
  const typePreliminary = useStore((state) => state.preliminaryData.type);

  const type = useStore((state) => state.lip?.type);

  const lipType = type ?? typePreliminary;

  if (lipType === "self-insured") {
    return <p className="mb-0">Il Contraente e l'assicurato coincidono</p>;
  }

  if (lipType === "third-party-insured") {
    return <p className="mb-0">Il Contraente è diverso dall'assicurato</p>;
  }

  return null;
}
