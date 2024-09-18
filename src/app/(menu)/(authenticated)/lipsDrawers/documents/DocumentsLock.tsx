"use client";

import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {Alert} from "react-bootstrap";

export function DocumentsLock() {
  const isDocumentsLocked = useStore(
    (state) => state.drawerStates.documentation?.isLocked,
  );

  if (!isDocumentsLocked) {
    return null;
  }

  return (
    <Alert className="mb-0" variant="danger">
      I dati inseriti richiedono una revisione da parte del nostro backend.
    </Alert>
  );
}
