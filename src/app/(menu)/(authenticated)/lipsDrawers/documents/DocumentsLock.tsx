"use client";

import {DocumentsLockAml} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/DocumentsLockAml";
import {DocumentsLockExternalPayment} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/DocumentsLockExternalPayment";
import {DocumentsLockMolliePayment} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/DocumentsLockMolliePayment";

import {useSuspenseLip} from "@/app/(menu)/(authenticated)/lipsDrawers/useSuspenseLip";
export function DocumentsLock() {
  const {
    data: {drawerStates},
  } = useSuspenseLip();

  // Non uso drawerStates.documents.isLocked perché voglio mostrare anche alcuni messaggi di lock sbloccati
  const shouldRenderDocumentsLock = drawerStates.payment?.variant === "success";

  if (!shouldRenderDocumentsLock) {
    return null;
  }

  return (
    <>
      <DocumentsLockAml />
      <DocumentsLockExternalPayment />
      <DocumentsLockMolliePayment />
    </>
  );
}
