"use client";

import {ContractorFatca} from "@/app/(menu)/(authenticated)/lipsDrawers/facta/ContractorFatca";
import {InsuredFatca} from "@/app/(menu)/(authenticated)/lipsDrawers/facta/InsuredFatca";
import {useStore} from "../../lips/[id]/store";

export function FatcaSummary() {
  const lipType = useStore((state) => state.lip?.type);
  const preliminaryType = useStore((state) => state.preliminaryData.type);

  const type = lipType ?? preliminaryType;

  return (
    <>
      <ContractorFatca />
      {type === "third-party-insured" && <InsuredFatca />}
    </>
  );
}
