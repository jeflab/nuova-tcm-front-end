"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {Alert, Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSquareArrowUpRight} from "@fortawesome/pro-solid-svg-icons";
import {updateUnderwriting} from "@/app/(menu)/(authenticated)/lips/[id]/actions";
import {notFound} from "next/navigation";

interface PaymentLockProps {
  hideUnderwritingAction?: boolean;
}

export function PaymentLock({
  hideUnderwritingAction = false,
}: PaymentLockProps) {
  const isPaymentLocked = useDrawerStore(
    (state) => state.drawerStates.payment?.isLocked,
  );
  const lip = useDrawerStore((state) => state.lip);
  const lipState = useDrawerStore((state) => state.lip?.lipStates);

  if (!isPaymentLocked || !lipState) {
    return null;
  }

  //TODO: questa logica è duplicata in store.ts, riusciamo a unificarla/semplificarla?
  const askForUnderwriting =
    // se le condizioni sanitarie non sono rispettate
    (lip?.mustAskUnderwriting ?? false) &&
    // e abbiamo i beneficiari, quindi siamo pre-pagamento
    lip &&
    lip?.beneficiaries &&
    // se lo stato è sconosciuto, o incompleto)
    (lipState.id === 0 || lipState.id === 1);

  // mostro il messaggio di underwriting in corso solo se lo stato è quello
  // dedicato o se è explicitato di nascondere l'azione di underwriting (per l'area cliente)
  const underwritingUnderInvestigation =
    lipState.id === 2 || hideUnderwritingAction;

  const underwritingNotApproved = lipState.id === 15;

  if (underwritingNotApproved) {
    return (
      <Alert className="mb-0" variant="danger">
        A seguito della valutazione dei questionari sanitari e/o non sanitari,
        la proposta di polizza non può essere accettata.
      </Alert>
    );
  }

  if (underwritingUnderInvestigation) {
    return (
      <Alert className="mb-0" variant="danger">
        La proposta di Polizza non può essere emessa direttamente in virtù delle
        risposte fornite nella compilazione del questionario sanitario/non
        sanitario. Valuteremo la situazione singolarmente e la avviseremo quando
        avremo concluso il processo di underwriting.
      </Alert>
    );
  }

  if (askForUnderwriting) {
    const setUnderwriting = async (lipId: number) => {
      const response = await updateUnderwriting(lipId);
      if (response.status === "failed") {
        if (response.responseStatus === 404) {
          notFound();
        }
        throw new Error(response.message);
      }
    };

    return (
      <Alert className="mb-0" variant="danger">
        La proposta di Polizza non può essere emessa direttamente in virtù delle
        risposte fornite nella compilazione del questionario sanitario/non
        sanitario. Per procedere è necessario richiedere l'underwriting.
        <br />
        <strong>
          Dopo aver richiesto l'underwriting i dati inseriti non saranno più
          modificabili.
        </strong>
        <div className="mt-2  d-flex justify-content-end">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => lip && setUnderwriting(lip?.id)}
          >
            <FontAwesomeIcon icon={faSquareArrowUpRight} className="me-2" />
            Richiedi underwriting
          </Button>
        </div>
      </Alert>
    );
  }
}
