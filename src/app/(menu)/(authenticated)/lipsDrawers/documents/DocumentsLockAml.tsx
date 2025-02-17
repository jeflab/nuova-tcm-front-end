"use client";

import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {Alert} from "react-bootstrap";

export function DocumentsLockAml() {
  const amlBlocked = useStore((state) => state.lip?.aml?.blocked ?? false);

  if (!amlBlocked) {
    return null;
  }

  return (
    <Alert className="mb-0" variant="danger">
      I dati inseriti richiedono una revisione da parte del nostro backend.
    </Alert>
  );
}
