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
      La proposta di Polizza non può essere emessa direttamente in virtù delle
      risposte fornite nella compilazione del questionario sanitario. Valuteremo
      la situazione singolarmente e la avviseremo quando avremo concluso il
      processo di underwriting sanitario.
    </Alert>
  );
}
