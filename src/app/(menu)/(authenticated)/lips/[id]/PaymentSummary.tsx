"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {Currency} from "@/ui/Currency";
import {faBank} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Stack} from "react-bootstrap";

export function PaymentSummary() {
  const paymentData = useDrawerStore((state) => state.lipData.payment);
  const premium = useDrawerStore((state) => state.lipData.quote?.premium);

  if (!paymentData || !premium) {
    return null;
  }

  return (
    <Stack gap={4}>
      <div>
        <h4 className="w-100 text-primary">
          <FontAwesomeIcon icon={faBank} /> Dati bancari del contraente:
        </h4>
        <p className="mb-0">
          <strong>Banca</strong>: {paymentData.bank}
          <br />
          <strong>IBAN</strong>: {paymentData.iban}
        </p>
      </div>
      <div>
        <h4 className="w-100 text-primary">Modalità di pagamento</h4>
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
    </Stack>
  );
}
