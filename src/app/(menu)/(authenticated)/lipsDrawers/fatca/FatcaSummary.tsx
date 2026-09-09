"use client";

import {ContractorFatca} from "@/app/(menu)/(authenticated)/lipsDrawers/fatca/ContractorFatca";
import {InsuredFatca} from "@/app/(menu)/(authenticated)/lipsDrawers/fatca/InsuredFatca";

import {useSuspenseLip} from "@/app/(menu)/(authenticated)/lipsDrawers/useSuspenseLip";
export function FatcaSummary() {
  const {
    data: {lip},
  } = useSuspenseLip();

  return (
    <>
      <ContractorFatca />
      {lip.type === "third-party-insured" && <InsuredFatca />}
    </>
  );
}
