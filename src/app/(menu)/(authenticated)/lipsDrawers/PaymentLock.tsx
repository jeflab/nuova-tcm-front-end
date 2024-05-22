"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {Alert} from "react-bootstrap";

export function PaymentLock() {
  const isPaymentLocked = useDrawerStore(
    (state) => state.drawerStates.payment?.isLocked,
  );
  const lipState = useDrawerStore((state) => state.lip?.lipStates);

  if (!isPaymentLocked || !lipState) {
    return null;
  }

  if (lipState.id === 15) {
    return (
      <Alert className="mb-0" variant="danger">
        A seguito della valutazione dei questionari sanitari e/o non sanitari,
        la proposta di polizza non può essere accettata.
      </Alert>
    );
  }

  if (lipState.id === 2) {
    return (
      <Alert className="mb-0" variant="danger">
        La proposta di Polizza non può essere emessa direttamente in virtù delle
        risposte fornite nella compilazione del questionario sanitario.
        Valuteremo la situazione singolarmente e la avviseremo quando avremo
        concluso il processo di underwriting sanitario.
      </Alert>
    );
  }
}
