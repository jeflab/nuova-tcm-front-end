"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {Alert} from "react-bootstrap";

export function DocumentsLock() {
  const isDocumentsLocked = useDrawerStore(
    (state) => state.drawerStates.documentation?.isLocked,
  );

  if (!isDocumentsLocked) {
    return null;
  }

  return (
    // TODO: nuova dicitura
    <Alert className="mb-0" variant="danger">
      I dati inseriti richiedono una revisione da parte del nostro backend.
    </Alert>
  );
}
