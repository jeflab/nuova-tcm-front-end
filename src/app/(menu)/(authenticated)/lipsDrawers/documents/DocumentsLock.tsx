"use client";

import {getLipQuery} from "@/app/(menu)/(authenticated)/lips/[id]/queries";
import {DocumentsLockAml} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/DocumentsLockAml";
import {DocumentsLockExternalPayment} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/DocumentsLockExternalPayment";
import {DocumentsLockMolliePayment} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/DocumentsLockMolliePayment";
import {validateLipIdOrNotFound} from "@/app/(menu)/(authenticated)/lipsDrawers/validateLipIdOrNotFound";
import {useSuspenseQuery} from "@tanstack/react-query";
import {useParams} from "next/navigation";

export function DocumentsLock() {
  const lipId = validateLipIdOrNotFound(useParams<{id: string}>().id) as number;
  const {
    data: {drawerStates},
  } = useSuspenseQuery(getLipQuery(lipId));

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
