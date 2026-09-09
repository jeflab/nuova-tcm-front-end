"use client";

import {
  ExclusionList,
  getExcludedCoverages,
} from "@/app/(menu)/(authenticated)/lipsDrawers/payment/ExclusionList";
import {MollieSubscriptionStatus} from "@/app/(menu)/(authenticated)/lipsDrawers/payment/MollieSubscriptionStatus";
import {PaymentMethod} from "@/app/(menu)/(authenticated)/lipsDrawers/payment/PaymentMethod";
import {isPaymentValid} from "@/app/(menu)/(authenticated)/lipsDrawers/payment/paymentValidators";
import {useSuspenseLip} from "@/app/(menu)/(authenticated)/lipsDrawers/useSuspenseLip";
import {Lip, Payment, Quotation} from "@/models/entities/lip";
import {DownloadDocumentButton} from "@/ui/DownloadDocumentButton";
import {IconStack} from "@/ui/IconStack";
import {
  faBank,
  faCalendar,
  faCirclePlay,
  faCreditCard,
  faShieldXmark,
} from "@fortawesome/pro-duotone-svg-icons";
import {faDollarSign} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Suspense} from "react";
import {Alert, Stack} from "react-bootstrap";

function InsuranceEffectiveDate() {
  return (
    <div>
      <h4 className="w-100 text-primary">
        <FontAwesomeIcon icon={faCirclePlay} /> Decorrenza assicurazione
      </h4>
      <p>
        Il <strong>Contratto si intende perfezionato e concluso</strong> nel
        momento in cui avvengono contestualmente tutti gli eventi qui elencati:
      </p>
      <ol type="a">
        <li>
          la{" "}
          <strong>
            sottoscrizione della proposta/polizza da parte del Contraente
          </strong>
          ;
        </li>
        <li>
          il <strong>pagamento del Premio</strong> Annuo Costante o rata di
          Premio alla data di perfezionamento;
        </li>
        <li>
          la ricezione da parte del Contraente della comunicazione scritta di{" "}
          <strong>accettazione della Proposta da parte della Compagnia</strong>.
        </li>
      </ol>
      <p className="mb-0">
        Il contratto entra in vigore (Decorrenza) alle ore 24 della data di
        perfezionamento e conclusione dello stesso.
      </p>
    </div>
  );
}

interface PremiumInstallmentsProps {
  paymentMethod: Payment["paymentMethod"];
  paymentType: Payment["paymentType"];
  premium: Quotation["premium"];
}
function PremiumInstallments({
  paymentMethod,
  paymentType,
  premium,
}: PremiumInstallmentsProps) {
  return (
    <div>
      <h4 className="w-100 text-primary">
        <IconStack>
          <FontAwesomeIcon icon={faCalendar} className="fa-stack-2x" />
          <FontAwesomeIcon
            icon={faDollarSign}
            className="fa-stack-1x"
            transform="down-5"
          />
        </IconStack>{" "}
        Frazionamento del premio
      </h4>
      <PaymentMethod
        paymentMethod={paymentMethod}
        paymentType={paymentType}
        premium={premium}
      />
    </div>
  );
}

interface UnderwritingSectionProps {
  lip: Lip;
  paymentData: Payment;
  quoteData: Quotation;
  underwritingData: NonNullable<Quotation["underwriting"]>;
}
function UnderwritingSection({
  lip,
  paymentData,
  quoteData,
  underwritingData,
}: UnderwritingSectionProps) {
  return (
    <>
      <div>
        <h4 className="w-100 text-primary">
          <IconStack>
            <FontAwesomeIcon icon={faCalendar} className="fa-stack-2x" />
            <FontAwesomeIcon
              icon={faDollarSign}
              className="fa-stack-1x"
              transform="down-5"
            />
          </IconStack>{" "}
          Frazionamento del premio in seguito a underwriting
        </h4>
        <PaymentMethod
          paymentMethod={paymentData.paymentMethod}
          paymentType={paymentData.paymentType}
          premium={underwritingData.extraPremium.value}
        />
      </div>
      {getExcludedCoverages(underwritingData.exclusions, quoteData).length >
        0 && (
        <div>
          <h4 className="w-100 text-primary">
            <FontAwesomeIcon icon={faShieldXmark} /> Coperture escluse a seguito
            di underwriting
          </h4>
          <ExclusionList exclusions={underwritingData.exclusions} />
        </div>
      )}
      <div>
        <Alert variant="info">{underwritingData.extraPremium.note}</Alert>
        <Stack direction="horizontal" gap={2}>
          {lip && (
            <DownloadDocumentButton
              uri="pdf-underwriting-sanitario"
              lipId={lip.id}
              agentId={lip.agent.id}
              contractorId={lip.contractor.id}
            >
              Scarica il documento
            </DownloadDocumentButton>
          )}
          {(lip?.healthcareQuestionnaire?.sportRisk.check === "yes" ||
            lip?.healthcareQuestionnaire?.professionalRisk.check === "yes") && (
            <DownloadDocumentButton
              uri="pdf-underwriting-sportivo"
              lipId={lip.id}
              agentId={lip.agent.id}
              contractorId={lip.contractor.id}
            >
              Scarica il questionario aggiuntivo
            </DownloadDocumentButton>
          )}
        </Stack>
      </div>
    </>
  );
}

interface BankDetailsProps {
  paymentData: Payment;
}
function BankDetails({paymentData}: BankDetailsProps) {
  return (
    <div>
      <h4 className="w-100 text-primary">
        <FontAwesomeIcon icon={faBank} /> Dati bancari del Contraente:
      </h4>
      <p className="mb-0">
        <strong>Intestatario c/c</strong>: {paymentData.contractorFullName}
        {paymentData.jointOwners ? `, ${paymentData.jointOwners}` : ""}
        <br />
        <strong>Banca</strong>: {paymentData.bank}
        <br />
        <strong>BIC/SWIFT</strong>: {paymentData.bicSwift}
        <br />
        <strong>IBAN</strong>: {paymentData.iban}
      </p>
    </div>
  );
}

interface BankTransferPaymentProps {
  lipNumber: string;
}
function BankTransferPayment({lipNumber}: BankTransferPaymentProps) {
  return (
    <dl className="mb-0">
      <dt>Primo pagamento tramite Bonifico bancario:</dt>
      <dd>
        il pagamento andrà effettuato a favore di Bright Life. sul c/c italiano
        aperto presso Banca Intesa-Sanpaolo - Via Cesare Battisti n. 11 - Milano
        20122 Filiale: 1886 IBAN IT26W0306909483100000019829, indicando nella
        causale il numero della presente Proposta: {lipNumber}
      </dd>
      <dt>
        Pagamenti successivi tramite mandato per addebito diretto SEPA - S.D.D.
      </dt>
      <dd>
        Il riferimento di Mandato coincide con il numero della presente proposta
        di polizza: ({lipNumber})
      </dd>
      <dt>Creditore:</dt>
      <dd className="mb-0">
        Bright Life Srl, Via Felice Casati, 32 - 20124 – Milano (MI) Codice
        identificativo del creditore: IT11ZZZ0000013276280966
      </dd>
    </dl>
  );
}

function CrediCardPayment() {
  return (
    <dl className="mb-0">
      <dt>Primo pagamento tramite Carta di Credito o Debito:</dt>
      <dd>
        il pagamento andrà effettuato a favore di Bright Life s.r.l. (Master
        Broker per LifeStar Insurance sul mercato italiano) tramite Carta di
        Credito o Carta di Debito collegata ad un c/c italiano, di cui il
        medesimo dichiara di essere il titolare.
      </dd>
      <ul>
        <li>
          Nella causale di pagamento deve sempre essere indicato il numero della
          presente Proposta.
        </li>
        <li>
          Non è possibile pagare il premio di polizza tramite Carte di Credito o
          Debito emesse da banche estere o Carte c.d. Ricaricabili / Prepagate.
        </li>
        <li>
          Il Contraente autorizza espressamente l’addebito automatico di tutti i
          premi di polizza successivi al primo (annuali o con frazionamento
          diverso) sulla medesima Carta di Credito o Debito di cui è titolare
          esclusivo. I premi successivi verranno addebitati automaticamente alle
          scadenze previste dal frazionamento prescelto dal Contraente.
        </li>
      </ul>
      <dt>Tipo di pagamento: ricorrente</dt>
      <dd className="mb-0">
        Con la sottoscrizione della presente autorizzazione, il Contraente si
        obbliga a pagare tutti i premi successivi al primo tramite addebito
        diretto sulla propria Carta di Credito o Debito. Specificatamente, il
        Contraente si obbliga ed impegna a fornire prontamente i dati
        dell’eventuale Carta di Credito o Debito sostitutiva (in caso di
        furto/smarrimento o sostituzione per scadenza).
      </dd>
    </dl>
  );
}

interface CardThenSddPaymentProps {
  lipNumber: string;
}
function CardThenSddPayment({lipNumber}: CardThenSddPaymentProps) {
  return (
    <dl className="mb-0">
      <dt>Sistema di pagamento elettronico - Addebito diretto SDD:</dt>
      <dd>
        il Contraente può effettuare il pagamento del premio a favore di Bright
        Life s.r.l. (Master Broker per LifeStar Insurance sul mercato italiano)
        tramite Carta di Credito o Carta di Debito collegata ad un c/c italiano,
        di cui il medesimo dichiara di essere il titolare.
      </dd>
      <ul>
        <li>
          Nella causale di pagamento deve sempre essere indicato il numero della
          presente Proposta.
        </li>
        <li>
          Non è possibile pagare il premio di polizza tramite Carte di Credito o
          Debito emesse da banche estere o Carte c.d. Ricaricabili / Prepagate.
        </li>
      </ul>
      <dt>
        Pagamenti successivi tramite mandato per addebito diretto SEPA - S.D.D.
      </dt>
      <dd>
        Il riferimento di Mandato coincide con il numero della presente proposta
        di polizza: ({lipNumber})
      </dd>
      <dt>Creditore:</dt>
      <dd className="mb-0">
        Bright Life Srl, Via Felice Casati, 32 - 20124 – Milano (MI) Codice
        identificativo del creditore: IT11ZZZ0000013276280966
      </dd>
    </dl>
  );
}

interface PaymentModalityProps {
  paymentData: Payment;
  lip: Lip;
}
function PaymentModality({paymentData, lip}: PaymentModalityProps) {
  return (
    <div>
      <h4 className="w-100 text-primary">
        <FontAwesomeIcon icon={faCreditCard} /> Modalità di pagamento
      </h4>
      {["legacy", "transfer-sdd"].includes(paymentData.paymentType) && (
        <BankTransferPayment lipNumber={lip.lipNumber!} />
      )}
      {["credit-card", "mollie"].includes(paymentData.paymentType) && (
        <CrediCardPayment />
      )}
      {paymentData.paymentType === "mollie-then-sdd" && (
        <CardThenSddPayment lipNumber={lip.lipNumber!} />
      )}
    </div>
  );
}

export function PaymentSummary() {
  const {
    data: {lip},
  } = useSuspenseLip();

  if (!isPaymentValid(lip)) {
    return null;
  }

  return (
    <Stack gap={4}>
      <InsuranceEffectiveDate />
      <PremiumInstallments
        paymentMethod={lip.payment.paymentMethod}
        paymentType={lip.payment.paymentType}
        premium={lip.quotation.premium}
      />
      {lip.quotation.underwriting && (
        <UnderwritingSection
          lip={lip}
          paymentData={lip.payment}
          quoteData={lip.quotation}
          underwritingData={lip.quotation.underwriting}
        />
      )}
      <BankDetails paymentData={lip.payment} />
      <PaymentModality paymentData={lip.payment} lip={lip} />
      {["mollie", "mollie-then-sdd"].includes(lip?.payment?.paymentType) && (
        <Suspense>
          <MollieSubscriptionStatus lip={lip} />
        </Suspense>
      )}
    </Stack>
  );
}
