"use client";

import {useCreateRecurringPaymentMutation} from "@/app/(menu)/(authenticated)/lips/[id]/mutations";
import {getActiveFirstPaymentQuery} from "@/app/(menu)/(authenticated)/lips/[id]/queries";
import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {dateTimeString} from "@/helpers/dates";
import {IconStack} from "@/ui/IconStack";
import {
  faArrowUpRightFromSquare,
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
import {useQuery} from "@tanstack/react-query";
import {useParams} from "next/navigation";
import {useState} from "react";
import {Alert, Button} from "react-bootstrap";

export function DocumentsLockMolliePayment() {
  const lipId = Number(useParams<{id: string}>().id);

  const [isCopied, setCopied] = useState(false);
  const {set: setClickedTimeout} = useTimeout();

  const paymentValues = useStore((state) => state.lip?.payment);

  const {
    data: firstPaymentData,
    error: firstPaymentError,
    isPending: firstPaymentIsPending,
    isError: firstPaymentIsError,
  } = useQuery(getActiveFirstPaymentQuery(lipId));
  const {
    isPending: createRecurringPaymentIsPending,
    isError: isCreateRecurringPaymentError,
    error: createRecurringPaymentError,
    mutate: createRecurringPayment,
  } = useCreateRecurringPaymentMutation();

  if (!paymentValues || !lipId) {
    return null;
  }

  const molliePaymentBlocked =
    paymentValues?.paymentType === "mollie" &&
    !paymentValues?.mollieLinkClicked;

  const molliePaymentClicked =
    paymentValues?.paymentType === "mollie" && paymentValues?.mollieLinkClicked;

  const handleLinkClick = () => {
    createRecurringPayment({lipId: lipId});
  };

  const handleCopyToClipboard = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setClickedTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (molliePaymentBlocked || molliePaymentClicked) {
    return (
      <>
        <Alert
          className="mb-0"
          variant={
            molliePaymentClicked && !firstPaymentIsError ? "success" : "danger"
          }
        >
          <div className="d-flex gap-2 justify-content-between align-items-center">
            {firstPaymentIsPending ? (
              <>
                <FontAwesomeIcon
                  icon={faSpinner}
                  className="fa-spin"
                  size="xl"
                />
                <span className="me-auto">Caricamento link pagamento...</span>
              </>
            ) : firstPaymentIsError ? (
              <>
                <FontAwesomeIcon icon={faCircleExclamation} size="xl" />
                <span className="me-auto">{firstPaymentError?.message}.</span>
              </>
            ) : firstPaymentData.first_payment !== null ? (
              <>
                <div>
                  <p>
                    Link per il pagamento:
                    <br />
                    <a
                      href={firstPaymentData.first_payment.links.checkout.href}
                    >
                      {firstPaymentData.first_payment.links.checkout.href}
                    </a>
                  </p>
                  <p className="mb-0">
                    <small>
                      <FontAwesomeIcon icon={faCircleInfo} /> Link valido fino a{" "}
                      {dateTimeString(firstPaymentData.first_payment.expiresAt)}
                    </small>
                  </p>
                </div>
                <Button
                  onClick={() =>
                    handleCopyToClipboard(
                      firstPaymentData.first_payment!.links.checkout.href,
                    )
                  }
                  disabled={isCopied}
                >
                  <FontAwesomeIcon
                    icon={isCopied ? faThumbsUp : faCopy}
                    className="me-2"
                  />
                  {isCopied
                    ? "Link copiato negli appunti"
                    : "Copia link pagamento"}
                </Button>
              </>
            ) : (
              <>
                <FontAwesomeIcon
                  icon={
                    molliePaymentClicked ? faCheckCircle : faCircleExclamation
                  }
                  size="xl"
                />
                <p className="mb-0 me-auto">
                  {molliePaymentClicked
                    ? "La procedura di pagamento è stata presa in carico da Mollie."
                    : "Per proseguire con la proposta è necessario effettuare il pagamento tramite il portale di Mollie."}
                </p>
                <Button
                  onClick={handleLinkClick}
                  disabled={createRecurringPaymentIsPending}
                >
                  {createRecurringPaymentIsPending ? (
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="fa-spin me-2"
                    />
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
              </>
            )}
          </div>
        </Alert>
      </>
    );
  }

  if (molliePaymentClicked) {
    return (
      <Alert className="mb-0" variant="success">
        <div className="d-flex gap-2 justify-content-between align-items-center">
          <p className="mb-0">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="me-2 text-success"
              size="xl"
            />
            La procedura di pagamento è stata presa in carico da Mollie.
          </p>
          <Button
            as="a"
            href="https://clicpay.worldlineitalia.it/login"
            target="_blank"
          >
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="me-2" />
            Login Mollie
          </Button>
        </div>
      </Alert>
    );
  }

  return null;
}
