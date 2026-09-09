"use client";

import {amlBlocked} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/documentsValidators";
import {useSuspenseLip} from "@/app/(menu)/(authenticated)/lipsDrawers/useSuspenseLip";
import {Alert} from "react-bootstrap";

export function DocumentsLockAml() {
  const {
    data: {lip},
  } = useSuspenseLip();

  if (!amlBlocked(lip)) {
    return null;
  }

  return (
    <Alert className="mb-0" variant="danger">
      I dati inseriti richiedono una revisione da parte del nostro backend.
    </Alert>
  );
}
