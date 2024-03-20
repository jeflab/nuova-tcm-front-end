"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {Currency} from "@/ui/Currency";
import {IconStack} from "@/ui/IconStack";
import {
  faBank,
  faCalendar,
  faCirclePlay,
} from "@fortawesome/pro-duotone-svg-icons";
import {
  faDollarSign,
  faMessage,
  faUser,
} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Stack} from "react-bootstrap";

export function PaymentSummary() {
  const paymentData = useDrawerStore((state) => state.lip?.payment);
  const premium = useDrawerStore((state) => state.lip?.quotation?.premium);

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
          Data di decorrenza sel contratto: {paymentData.effectiveDate}, durata{" "}
          {paymentData.duration} anni, anno di scadenza:{" "}
          {paymentData.expirationDate}
        </p>
        <p className="mb-0">
          Visita medica{" "}
          {paymentData.medicalExam ? "effettuata" : "non effettuata"}
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
            Sconto del 10%
            <br />
            Pagamento anticipato di 3 anni con sconto del 10% (
            <Currency>{premium * 3 * 0.9}</Currency>) e a seguire pagamento
            mensile di <Currency>{premium / 12}</Currency>
          </p>
        ) : paymentData.paymentMethod === "5yearsAdvance" ? (
          <p className="mb-0">
            Sconto del 15%
            <br />
            Pagamento anticipato di 5 anni con sconto del 15% (
            <Currency>{premium * 5 * 0.85}</Currency>) e a seguire pagamento
            mensile di <Currency>{premium / 12}</Currency>
          </p>
        ) : null}
      </div>
      <div>
        <h4 className="w-100 text-primary">
          <FontAwesomeIcon icon={faBank} /> Dati bancari del contraente:
        </h4>
        <p className="mb-0">
          <strong>Intestatario c/c</strong>: {paymentData.contractorFullName}
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
