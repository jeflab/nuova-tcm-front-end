"use client";

import {getLipQuery} from "@/app/(menu)/(authenticated)/lips/[id]/queries";
import {ContractorFatca} from "@/app/(menu)/(authenticated)/lipsDrawers/fatca/ContractorFatca";
import {InsuredFatca} from "@/app/(menu)/(authenticated)/lipsDrawers/fatca/InsuredFatca";
import {validateLipIdOrNotFound} from "@/app/(menu)/(authenticated)/lipsDrawers/validateLipIdOrNotFound";
import {useSuspenseQuery} from "@tanstack/react-query";
import {useParams} from "next/navigation";

export function FatcaSummary() {
  const lipId = validateLipIdOrNotFound(useParams<{id: string}>().id);
  const {
    data: {lip},
  } = useSuspenseQuery(getLipQuery(lipId));

  return (
    <>
      <ContractorFatca />
      {lip.type === "third-party-insured" && <InsuredFatca />}
    </>
  );
}
