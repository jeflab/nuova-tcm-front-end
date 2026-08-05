"use client";

import {getLipQuery} from "@/app/(menu)/(authenticated)/lips/[id]/queries";
import {isBeneficiariesValid} from "@/app/(menu)/(authenticated)/lipsDrawers/beneficiaries/beneficiariesValidators";
import {askForUnderwriting} from "@/app/(menu)/(authenticated)/lipsDrawers/payment/paymentValidators";
import {validateLipIdOrNotFound} from "@/app/(menu)/(authenticated)/lipsDrawers/validateLipIdOrNotFound";
import {PDFType} from "@/models/entities/esign";
import {Currency} from "@/ui/Currency";
import RequestOTPModal from "@/ui/eSign/RequestOTPModal";
import {faSquareArrowUpRight} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useSuspenseQuery} from "@tanstack/react-query";
import {useParams} from "next/navigation";
import {useState} from "react";
import {Alert, Button} from "react-bootstrap";

interface PaymentLockProps {
  hideUnderwritingAction?: boolean;
}

export function PaymentLock({
  hideUnderwritingAction = false,
}: PaymentLockProps) {
  const lipId = validateLipIdOrNotFound(useParams<{id: string}>().id) as number;
  const {
    data: {lip, drawerStates},
  } = useSuspenseQuery(getLipQuery(lipId));

  const [isUnderwritingOpen, setIsUnderwritingOpen] = useState(false);

  if (!isBeneficiariesValid(lip)) {
    return null;
  }

  if (!drawerStates.payment?.isLocked) {
    return null;
  }

  // mostro il messaggio di underwriting in corso solo se lo stato è quello
  // dedicato o se è esplicitato di nascondere l'azione di underwriting (per l'area cliente)
  const underwritingUnderInvestigation =
    lip.lipState.id === 2 || hideUnderwritingAction;

  const underwritingNotApproved = lip.lipState.id === 15;

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

  if (askForUnderwriting(lip)) {
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
          onESignComplete={async () => {
            setIsUnderwritingOpen(false);
          }}
          show={isUnderwritingOpen}
          personalData={lip.contractor}
          whoESign="contractor"
        />
      </Alert>
    );
  }

  return null;
}
