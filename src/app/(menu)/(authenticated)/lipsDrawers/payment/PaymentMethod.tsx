import {PaymentMethodsSimple} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {Currency} from "@/ui/Currency";

interface PaymentMethodProps {
  paymentMethod: PaymentMethodsSimple;
  premium: number;
}

export function PaymentMethod({paymentMethod, premium}: PaymentMethodProps) {
  return (
    <p className="mb-0">
      {paymentMethod === "monthly" ? (
        <>
          Pagamento mensile di <Currency>{premium / 12}</Currency> con anticipo
          di 3 mesi (<Currency>{(premium / 12) * 3}</Currency>)
        </>
      ) : paymentMethod === "annual" ? (
        <>
          Pagamento annuale di <Currency>{premium}</Currency>
        </>
      ) : paymentMethod === "3yearsAdvance" ? (
        <>
          Pagamento anticipato di 3 anni (<Currency>{premium * 3}</Currency>) e
          a seguire pagamento mensile di <Currency>{premium / 12}</Currency>
        </>
      ) : paymentMethod === "5yearsAdvance" ? (
        <>
          Pagamento anticipato di 5 anni (<Currency>{premium * 5}</Currency>) e
          a seguire pagamento mensile di <Currency>{premium / 12}</Currency>
        </>
      ) : null}
    </p>
  );
}
