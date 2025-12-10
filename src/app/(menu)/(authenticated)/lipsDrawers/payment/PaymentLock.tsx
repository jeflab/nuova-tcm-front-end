"use client";

import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {PDFType} from "@/models/entities/esign";
import {Tags} from "@/services/const";
import {Currency} from "@/ui/Currency";
import RequestOTPModal from "@/ui/eSign/RequestOTPModal";
import {faSquareArrowUpRight} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";
import {Alert, Button} from "react-bootstrap";

interface PaymentLockProps {
  hideUnderwritingAction?: boolean;
}

export function PaymentLock({
  hideUnderwritingAction = false,
}: PaymentLockProps) {
  const [isUnderwritingOpen, setIsUnderwritingOpen] = useState(false);

  const isPaymentLocked = useStore(
    (state) => state.drawerStates.payment?.isLocked,
  );
  const lip = useStore((state) => state.lip);
  const lipState = useStore((state) => state.lip?.lipStates);

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
  // dedicato o se è esplicitato di nascondere l'azione di underwriting (per l'area cliente)
  const underwritingUnderInvestigation =
    lipState.id === 2 || hideUnderwritingAction;

  const underwritingNotApproved = lipState.id === 15;

  const setUnderwriting = async () => {
    setIsUnderwritingOpen(true);
  };

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
        <p>
          La proposta di Polizza non può essere emessa direttamente a causa di
          una o più delle seguenti condizioni:
        </p>
        <ul>
          <li>
            risposte fornite nella compilazione del questionario sanitario/non
            sanitario;
          </li>
          <li>età dell'assicurato maggiore di 65 anni;</li>
          <li>
            coperture richieste per <em>Caso morte</em> superiori a{" "}
            <Currency>{300_000}</Currency>.
          </li>
        </ul>
        <p className="mb-0">
          Valuteremo la situazione singolarmente e la avviseremo quando avremo
          concluso il processo di underwriting.
        </p>
      </Alert>
    );
  }

  if (askForUnderwriting) {
    return (
      <Alert className="mb-0" variant="danger">
        <p>
          La proposta di Polizza non può essere emessa direttamente a causa di
          una o più delle seguenti condizioni:
        </p>
        <ul>
          <li>
            risposte fornite nella compilazione del questionario sanitario/non
            sanitario;
          </li>
          <li>età dell'assicurato maggiore di 65 anni;</li>
          <li>
            coperture richieste per <em>Caso morte</em> superiori a{" "}
            <Currency>{300_000}</Currency>.
          </li>
        </ul>
        <p>
          Per procedere è necessario richiedere l'underwriting.
          <br />
          <strong>
            Dopo aver richiesto l'underwriting i dati inseriti non saranno più
            modificabili.
          </strong>
        </p>
        <Button type="button" variant="primary" onClick={setUnderwriting}>
          <FontAwesomeIcon icon={faSquareArrowUpRight} className="me-2" />
          Richiedi underwriting
        </Button>
        <RequestOTPModal
          lipId={lip.id}
          onHide={() => setIsUnderwritingOpen(false)}
          pdfType={PDFType.Underwriting}
          onEsignComplete={async () => {
            setIsUnderwritingOpen(false);
          }}
          show={isUnderwritingOpen}
          personalData={lip.contractor}
          whoESign="contractor"
          tagToRevalidate={Tags.getLip(lip.id)}
        />
      </Alert>
    );
  }

  return null;
}
