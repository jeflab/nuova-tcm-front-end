"use client";

import {getLipQuery} from "@/app/(menu)/(authenticated)/lips/[id]/queries";
import {CompanyPrivacy} from "@/app/(menu)/(authenticated)/lipsDrawers/CompanyPrivacy";
import {DocumentsManagement} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/DocumentsManagement";
import {isPrivacyCompanyValid} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/documentsValidators";
import {isPaymentValid} from "@/app/(menu)/(authenticated)/lipsDrawers/payment/paymentValidators";
import {validateLipIdOrNotFound} from "@/app/(menu)/(authenticated)/lipsDrawers/validateLipIdOrNotFound";
import {useSuspenseQuery} from "@tanstack/react-query";
import {useParams} from "next/navigation";

export function DocumentsModal() {
  const lipId = validateLipIdOrNotFound(useParams<{id: string}>().id) as number;
  const {
    data: {lip},
  } = useSuspenseQuery(getLipQuery(lipId));

  if (!isPaymentValid(lip)) {
    return null;
  }

  if (!isPrivacyCompanyValid(lip)) {
    return <CompanyPrivacy lip={lip} />;
  } else {
    return <DocumentsManagement lip={lip} />;
  }
}
