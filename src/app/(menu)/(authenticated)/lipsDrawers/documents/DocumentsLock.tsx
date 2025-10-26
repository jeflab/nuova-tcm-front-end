import {DocumentsLockAml} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/DocumentsLockAml";
import {DocumentsLockExternalPayment} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/DocumentsLockExternalPayment";
import {DocumentsLockMolliePayment} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/DocumentsLockMolliePayment";

export function DocumentsLock() {
  return (
    <>
      <DocumentsLockAml />
      <DocumentsLockExternalPayment />
      <DocumentsLockMolliePayment />
    </>
  );
}
