"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {ButtonLink} from "@/ui/ButtonLink";
import {Currency} from "@/ui/Currency";
import {IconStack} from "@/ui/IconStack";
import {
  faBank,
  faCalendar,
  faCirclePlay,
  faDownload,
} from "@fortawesome/pro-duotone-svg-icons";
import {faDollarSign} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Alert, Stack} from "react-bootstrap";

export function PaymentSummary() {
  const paymentData = useDrawerStore((state) => state.lip?.payment);
  const premium = useDrawerStore((state) => state.lip?.quotation?.premium);
  const underwriting = useDrawerStore(
    (state) => state.lip?.quotation?.underwriting,
  );
  const lip = useDrawerStore((state) => state.lip);

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
        {paymentData.paymentMethod === "monthly" ? (
          <p className="mb-0">
            Pagamento mensile di <Currency>{premium / 12}</Currency> con
            anticipo di 3 mesi (<Currency>{(premium / 12) * 3}</Currency>)
          </p>
        ) : paymentData.paymentMethod === "annual" ? (
          <p className="mb-0">
            Pagamento annuale di <Currency>{premium}</Currency>
          </p>
        ) : paymentData.paymentMethod === "3yearsAdvance" ? (
          <p className="mb-0">
            Pagamento anticipato di 3 anni (<Currency>{premium * 3}</Currency>)
            e a seguire pagamento mensile di <Currency>{premium / 12}</Currency>
          </p>
        ) : paymentData.paymentMethod === "5yearsAdvance" ? (
          <p className="mb-0">
            Pagamento anticipato di 5 anni (<Currency>{premium * 5}</Currency>)
            e a seguire pagamento mensile di <Currency>{premium / 12}</Currency>
          </p>
        ) : null}
      </div>
      {underwriting && (
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
          {paymentData.paymentMethod === "monthly" ? (
            <p>
              Pagamento mensile di{" "}
              <Currency>{underwriting.extraPremium.value / 12}</Currency> con
              anticipo di 3 mesi (
              <Currency>{(underwriting.extraPremium.value / 12) * 3}</Currency>)
            </p>
          ) : paymentData.paymentMethod === "annual" ? (
            <p>
              Pagamento annuale di{" "}
              <Currency>{underwriting.extraPremium.value}</Currency>
            </p>
          ) : paymentData.paymentMethod === "3yearsAdvance" ? (
            <p>
              Pagamento anticipato di 3 anni (
              <Currency>{underwriting.extraPremium.value * 3}</Currency>) e a
              seguire pagamento mensile di{" "}
              <Currency>{underwriting.extraPremium.value / 12}</Currency>
            </p>
          ) : paymentData.paymentMethod === "5yearsAdvance" ? (
            <p>
              Pagamento anticipato di 5 anni (
              <Currency>{underwriting.extraPremium.value * 5}</Currency>) e a
              seguire pagamento mensile di{" "}
              <Currency>{underwriting.extraPremium.value / 12}</Currency>
            </p>
          ) : null}
          <Alert variant="info">{underwriting.extraPremium.note}</Alert>
          <ButtonLink
            href={`${process.env.NEXT_PUBLIC_API_URL}/pdf-underwriting-sanitario/?lipId=${lip?.id}&agentId=${lip?.agent?.id}&contractorId=${lip?.contractor?.id}`}
            download
          >
            <FontAwesomeIcon icon={faDownload} /> Scarica il documento
          </ButtonLink>
        </div>
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
    </Stack>
  );
}
