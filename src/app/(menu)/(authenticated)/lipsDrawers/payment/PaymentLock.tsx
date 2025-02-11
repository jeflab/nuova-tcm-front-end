"use client";

import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {PDFType} from "@/models/entities/esign";
import {backendUrl, Tags} from "@/services/const";
import {ButtonLink} from "@/ui/ButtonLink";
import RequestOTPModal from "@/ui/eSign/RequestOTPModal";
import {
  faArrowUpRightFromSquare,
  faDownload,
} from "@fortawesome/pro-duotone-svg-icons";
import {faSquareArrowUpRight} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";
import {Alert, Button} from "react-bootstrap";

const professionalSportQuestionnaireUrl =
  backendUrl + "questionario_professionale_sportivo.pdf";

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
  // dedicato o se è explicitato di nascondere l'azione di underwriting (per l'area cliente)
  const underwritingUnderInvestigation =
    lipState.id === 2 || hideUnderwritingAction;

  const showProfessionalSportQuestionnaire =
    lip?.healthcareQuestionnaire?.professionalRisk.check === "yes" ||
    lip?.healthcareQuestionnaire?.sportRisk.check === "yes";

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
        La proposta di Polizza non può essere emessa direttamente in virtù delle
        risposte fornite nella compilazione del questionario sanitario/non
        sanitario. Valuteremo la situazione singolarmente e la avviseremo quando
        avremo concluso il processo di underwriting.
      </Alert>
    );
  }

  if (askForUnderwriting) {
    return (
      <>
        {showProfessionalSportQuestionnaire && (
          <Alert variant="info" className="mb-0">
            <p>
              In virtù delle risposte fornite nella compilazione del
              questionario sanitario, il Contraente è tenuto alla compilazione
              del seguente questionario aggiuntivo. È obbligatorio utilizzare{" "}
              <strong>Adobe Acrobat Reader</strong> (
              <a
                href="https://get.adobe.com/it/reader/"
                target="_blank"
                className="alert-link"
              >
                Scarica <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </a>
              ) per la compilazione del modulo. Una volta compilato, deve essere
              inviato via e-mail all'indirizzo{" "}
              <a
                href="mailto:supporto.underwriting@brightlife.it"
                className="alert-link"
              >
                supporto.underwriting@brightlife.it
              </a>
              .
            </p>
            <ButtonLink
              href={professionalSportQuestionnaireUrl}
              download
              target="_blank"
            >
              <FontAwesomeIcon icon={faDownload} /> Scarica i questionari per il
              rischio professionale e sportivo
            </ButtonLink>
          </Alert>
        )}
        <Alert className="mb-0" variant="danger">
          <p>
            La proposta di Polizza non può essere emessa direttamente in virtù
            delle risposte fornite nella compilazione del questionario
            sanitario/non sanitario. Per procedere è necessario richiedere
            l'underwriting.
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
      </>
    );
  }

  return null;
}
