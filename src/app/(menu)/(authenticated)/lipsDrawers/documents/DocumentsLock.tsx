"use client";

import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {DocumentsLockAml} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/DocumentsLockAml";
import {DocumentsLockExternalPayment} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/DocumentsLockExternalPayment";
import {DocumentsLockMolliePayment} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/DocumentsLockMolliePayment";

export function DocumentsLock() {
  const shouldRenderCodumentsLock = useStore(
    (state) => state.drawerStates.payment?.variant === "success",
  );

  if (!shouldRenderCodumentsLock) {
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
