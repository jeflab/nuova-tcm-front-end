"use client";

import {CompanyPrivacy} from "@/app/(menu)/(authenticated)/lipsDrawers/CompanyPrivacy";
import {DocumentsManagement} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/DocumentsManagement";
import {isPrivacyCompanyValid} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/documentsValidators";
import {isPaymentValid} from "@/app/(menu)/(authenticated)/lipsDrawers/payment/paymentValidators";

import {useSuspenseLip} from "@/app/(menu)/(authenticated)/lipsDrawers/useSuspenseLip";
export function DocumentsModal() {
  const {
    data: {lip},
  } = useSuspenseLip();

  if (!isPaymentValid(lip)) {
    return null;
  }

  if (!isPrivacyCompanyValid(lip)) {
    return <CompanyPrivacy lip={lip} />;
  } else {
    return <DocumentsManagement lip={lip} />;
  }
}
