"use client";

import {useCreateRecurringPaymentMutation} from "@/app/(menu)/(authenticated)/lips/[id]/mutations";
import {
  getActiveFirstPaymentQuery,
  getActiveSubscriptionQuery,
  getLipQuery,
} from "@/app/(menu)/(authenticated)/lips/[id]/queries";
import {mollieLinkClicked} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/documentsValidators";
import {isPaymentValid} from "@/app/(menu)/(authenticated)/lipsDrawers/payment/paymentValidators";
import {validateLipIdOrNotFound} from "@/app/(menu)/(authenticated)/lipsDrawers/validateLipIdOrNotFound";
import {dateTimeString} from "@/helpers/dates";
import {Lip} from "@/models/entities/lip";
import {MolliePayment} from "@/models/entities/mollie/payment";
import {IconStack} from "@/ui/IconStack";
import {WithChildren} from "@/ui/types";
import {
  faArrowRotateBack,
  faCheckCircle,
  faCircleExclamation,
  faCircleInfo,
  faCopy,
  faSpinner,
  faThumbsUp,
} from "@fortawesome/pro-duotone-svg-icons";
import {faLink, faPlus} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import useTimeout from "@restart/hooks/useTimeout";
import {useQuery, useSuspenseQuery} from "@tanstack/react-query";
import {useParams} from "next/navigation";
import {useState} from "react";
import {Alert, Button} from "react-bootstrap";
import {Variant} from "react-bootstrap/esm/types";

interface PaymentAlertProps extends WithChildren {
  variant: Variant;
}

function PaymentAlert({variant, children}: PaymentAlertProps) {
  return (
    <Alert className="mb-0" variant={variant}>
      <div className="d-flex gap-2 justify-content-between align-items-center">
        {children}
      </div>
    </Alert>
  );
}

function FirstPaymentPending() {
  return (
    <PaymentAlert variant="info">
      <FontAwesomeIcon icon={faSpinner} className="fa-spin" size="xl" />
      <span className="me-auto">Caricamento link pagamento...</span>
    </PaymentAlert>
  );
}

interface FirstPaymentErrorProps {
  firstPaymentError: Error;
  onRetry: () => void;
}
function FirstPaymentError({
  firstPaymentError,
  onRetry,
}: FirstPaymentErrorProps) {
  return (
    <PaymentAlert variant="danger">
      <FontAwesomeIcon icon={faCircleExclamation} size="xl" />
      <p className="me-auto mb-0">{firstPaymentError.message}.</p>
      <Button onClick={() => onRetry()}>
        <FontAwesomeIcon icon={faArrowRotateBack} className="me-2" />
        Riprova
      </Button>
    </PaymentAlert>
  );
}

interface ButtonCopyProps {
  value: string;
}
function ButtonCopy({value}: ButtonCopyProps) {
  const [isCopied, setCopied] = useState(false);
  const {set: setClickedTimeout} = useTimeout();

  const handleCopyToClipboard = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setClickedTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Button onClick={() => handleCopyToClipboard(value)} disabled={isCopied}>
      <FontAwesomeIcon icon={isCopied ? faThumbsUp : faCopy} className="me-2" />
      {isCopied ? "Link copiato negli appunti" : "Copia link pagamento"}
    </Button>
  );
}

interface FirstPaymentLinkProps {
  firstPayment: MolliePayment;
}
function FirstPaymentLink({firstPayment}: FirstPaymentLinkProps) {
  return (
    <PaymentAlert variant="success">
      <div>
        <p>
          Link per il pagamento:
          <br />
          <a className="text-break" href={firstPayment.links.checkout.href}>
            {firstPayment.links.checkout.href}
          </a>
        </p>
        <p className="mb-0">
          <small>
            <FontAwesomeIcon icon={faCircleInfo} /> Link valido fino a{" "}
            {dateTimeString(firstPayment.expiresAt)}
          </small>
        </p>
      </div>
      <ButtonCopy value={firstPayment.links.checkout.href} />
    </PaymentAlert>
  );
}

function CreateRecurringPaymentButton() {
  const lipId = validateLipIdOrNotFound(useParams<{id: string}>().id) as number;

  const {
    isPending: createRecurringPaymentIsPending,
    isError: isCreateRecurringPaymentError,
    error: createRecurringPaymentError,
    mutate: createRecurringPayment,
  } = useCreateRecurringPaymentMutation();

  return (
    <Button
      onClick={() => {
        createRecurringPayment({lipId});
      }}
      disabled={createRecurringPaymentIsPending}
    >
      {createRecurringPaymentIsPending ? (
        <FontAwesomeIcon icon={faSpinner} className="fa-spin me-2" />
      ) : isCreateRecurringPaymentError ? (
        <FontAwesomeIcon
          icon={faCircleExclamation}
          className="text-danger me-2"
          swapOpacity
          title={createRecurringPaymentError.message}
        />
      ) : (
        <IconStack className="me-2">
          <FontAwesomeIcon
            icon={faLink}
            className="fa-stack-2x"
            opacity={0.4}
          />
          <FontAwesomeIcon
            icon={faPlus}
            className="fa-stack-1x"
            transform="down-11 right-13 grow-6"
          />
        </IconStack>
      )}
      Crea link di pagamento
    </Button>
  );
}

function MolliePaymentPendingState() {
  return (
    <PaymentAlert variant="danger">
      <FontAwesomeIcon
        icon={faCircleExclamation}
        className="text-danger"
        size="xl"
      />
      <p className="mb-0 me-auto">
        Per proseguire con la proposta è necessario effettuare il pagamento
        tramite il portale di Mollie.
      </p>
      <CreateRecurringPaymentButton />
    </PaymentAlert>
  );
}

function MolliePaymentClickedState() {
  const lipId = validateLipIdOrNotFound(useParams<{id: string}>().id) as number;
  const {data, isSuccess} = useQuery(getActiveSubscriptionQuery(lipId));

  if (!isSuccess) {
    return null;
  }

  return (
    <PaymentAlert variant="success">
      <FontAwesomeIcon
        icon={faCheckCircle}
        className="text-success"
        size="xl"
      />
      <p className="mb-0 me-auto">
        La procedura di pagamento è stata presa in carico da Mollie.
        <br />{" "}
        {data.subscription
          ? "È attivo il pagamento automatico"
          : "Non è attivo un pagamento automatico"}
      </p>
      <CreateRecurringPaymentButton />
    </PaymentAlert>
  );
}

interface PaymentStatusProps {
  lip: Lip;
}
function PaymentStatus({lip}: PaymentStatusProps) {
  const {
    data: firstPaymentData,
    error: firstPaymentError,
    isFetching: firstPaymentIsFetching,
    isError: firstPaymentIsError,
    refetch: firstPaymentRefetch,
  } = useQuery(getActiveFirstPaymentQuery(lip.id));

  if (firstPaymentIsFetching && (!firstPaymentData || !!firstPaymentError)) {
    return <FirstPaymentPending />;
  }

  if (firstPaymentIsError) {
    return (
      <FirstPaymentError
        firstPaymentError={firstPaymentError}
        onRetry={firstPaymentRefetch}
      />
    );
  }

  if (!!firstPaymentData?.first_payment) {
    return <FirstPaymentLink firstPayment={firstPaymentData.first_payment} />;
  }

  if (mollieLinkClicked(lip)) {
    return <MolliePaymentClickedState />;
  }

  return <MolliePaymentPendingState />;
}

export function DocumentsLockMolliePayment() {
  const lipId = validateLipIdOrNotFound(useParams<{id: string}>().id) as number;
  const {
    data: {lip},
  } = useSuspenseQuery(getLipQuery(lipId));

  if (!isPaymentValid(lip)) {
    return null;
  }

  if (lip.payment.paymentType !== "mollie") {
    return null;
  }

  return <PaymentStatus lip={lip} />;
}
