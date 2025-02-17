"use client";

import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {
  ExclusionList,
  getExcludedCoverages,
} from "@/app/(menu)/(authenticated)/lipsDrawers/payment/ExclusionList";
import {PaymentMethod} from "@/app/(menu)/(authenticated)/lipsDrawers/payment/PaymentMethod";
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
import {Alert, Stack} from "react-bootstrap";

export function PaymentSummary() {
  const lip = useStore((state) => state.lip);
  const paymentData = useStore((state) => state.lip?.payment);
  const premium = useStore((state) => state.lip?.quotation?.premium);
  const quoteData = useStore((state) => state.lip?.quotation);
  const underwritingData = useStore(
    (state) => state.lip?.quotation?.underwriting,
  );

  if (!paymentData || !premium) {
    return null;
  }

  return (
    <Stack gap={4}>
      <div>
        <h4 className="w-100 text-primary">
          <FontAwesomeIcon icon={faCirclePlay} /> Decorrenza assicurazione
        </h4>
        <p>
          Il <strong>Contratto si intende perfezionato e concluso</strong> nel
          momento in cui avvengono contestualmente tutti gli eventi qui
          elencati:
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
            <strong>
              accettazione della Proposta da parte della Compagnia
            </strong>
            .
          </li>
        </ol>
        <p className="mb-0">
          Il contratto entra in vigore (Decorrenza) alle ore 24 della data di
          perfezionamento e conclusione dello stesso.
        </p>
      </div>
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
          paymentMethod={paymentData.paymentMethod}
          paymentType={paymentData.paymentType}
          premium={premium}
        />
      </div>
      {underwritingData && (
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
                <FontAwesomeIcon icon={faShieldXmark} /> Coperture escluse a
                seguito di underwriting
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
                lip?.healthcareQuestionnaire?.professionalRisk.check ===
                  "yes") && (
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
      )}
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
      <div>
        <h4 className="w-100 text-primary">
          <FontAwesomeIcon icon={faCreditCard} /> Modalità di pagamento
        </h4>
        {["legacy", "transfer-sdd"].includes(paymentData.paymentType) && (
          <dl>
            <dt>Primo pagamento tramite Bonifico bancario:</dt>
            <dd>
              il pagamento andrà effettuato a favore di Bright Life. sul c/c
              italiano aperto presso Banca Intesa-Sanpaolo - Via Cesare Battisti
              n. 11 - Milano 20122 Filiale: 1886 IBAN
              IT26W0306909483100000019829, indicando nella causale il numero
              della presente Proposta: {lip?.lipNumber}
            </dd>
            <dt>
              Pagamenti successivi tramite mandato per addebito diretto SEPA -
              S.D.D.
            </dt>
            <dd>
              Il riferimento di Mandato coincide con il numero della presente
              proposta di polizza: ({lip?.lipNumber})
            </dd>
            <dt>Creditore:</dt>
            <dd>
              Bright Life, Piazza della Repubblica, 32 – 20122 – Milano (MI)
              Codice identificativo del creditore: IT11ZZZ0000013276280966
            </dd>
          </dl>
        )}
        {paymentData.paymentType === "credit-card" && (
          <dl>
            <dt>Primo pagamento tramite Carta di Credito o Debito:</dt>
            <dd>
              il pagamento andrà effettuato a favore di Bright Life s.r.l.
              (Master Broker per LifeStar Insurance sul mercato italiano)
              tramite Carta di Credito o Carta di Debito collegata ad un c/c
              italiano, di cui il medesimo dichiara di essere il titolare.
            </dd>
            <ul>
              <li>
                Nella causale di pagamento deve sempre essere indicato il numero
                della presente Proposta.
              </li>
              <li>
                Non è possibile pagare il premio di polizza tramite Carte di
                Credito o Debito emesse da banche estere o Carte c.d.
                Ricaricabili / Prepagate.
              </li>
              <li>
                Il Contraente autorizza espressamente l’addebito automatico di
                tutti i premi di polizza successivi al primo (annuali o con
                frazionamento diverso) sulla medesima Carta di Credito o Debito
                di cui è titolare esclusivo. I premi successivi verranno
                addebitati automaticamente alle scadenze previste dal
                frazionamento prescelto dal Contraente.
              </li>
            </ul>
            <dt>Tipo di pagamento: ricorrente</dt>
            <dd>
              Con la sottoscrizione della presente autorizzazione, il Contraente
              si obbliga a pagare tutti i premi successivi al primo tramite
              addebito diretto sulla propria Carta di Credito o Debito.
              Specificatamente, il Contraente si obbliga ed impegna a fornire
              prontamente i dati dell’eventuale Carta di Credito o Debito
              sostitutiva (in caso di furto/smarrimento o sostituzione per
              scadenza).
            </dd>
          </dl>
        )}
      </div>
    </Stack>
  );
}
