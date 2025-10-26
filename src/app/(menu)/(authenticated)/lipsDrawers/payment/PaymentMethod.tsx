import {
  paymentMethodsOptions,
  PaymentMethods,
  PaymentType,
  DeprecatedPaymentType,
} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";

interface PaymentMethodProps {
  paymentMethod: PaymentMethods;
  paymentType: PaymentType | DeprecatedPaymentType;
  premium: number;
}

export function PaymentMethod({
  paymentMethod,
  paymentType,
  premium,
}: PaymentMethodProps) {
  return (
    <>
      {["legacy", "transfer-sdd"].includes(paymentType) ? (
        <p className="mb-0">
          <strong>Pagamento tramite Bonifico - Addebito diretto SDD</strong>
        </p>
      ) : paymentType === "credit-card" ? (
        <p className="mb-0">
          <strong>
            Pagamento elettronico tramite Carta di Credito o Debito
          </strong>
        </p>
      ) : paymentType === "mollie" ? (
        <p className="mb-0">
          <strong>Pagamento elettronico tramite Mollie</strong>
        </p>
      ) : null}
      <p className="mb-0">
        {
          paymentMethodsOptions(premium).find(
            (method) => method.value === paymentMethod,
          )?.label
        }
      </p>
    </>
  );
}
