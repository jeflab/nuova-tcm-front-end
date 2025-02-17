import {DocumentsLockAml} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/DocumentsLockAml";
import {DocumentsLockExternalPayment} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/DocumentsLockExternalPayment";

export function DocumentsLock() {
  return (
    <>
      <DocumentsLockAml />
      <DocumentsLockExternalPayment />
    </>
  );
}
