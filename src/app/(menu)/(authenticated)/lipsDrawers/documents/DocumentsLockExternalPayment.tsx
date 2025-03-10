"use client";

import {updatePaymentData} from "@/app/(menu)/(authenticated)/lips/[id]/actions";
import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {
  faArrowUpRightFromSquare,
  faCheckCircle,
  faCircleExclamation,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Alert, Button} from "react-bootstrap";

export function DocumentsLockExternalPayment() {
  const paymentValues = useStore((state) => state.lip?.payment);
  const lipId = useStore((state) => state.lip?.id);

  if (!paymentValues || !lipId) {
    return null;
  }

  const externalPaymentBlocked =
    paymentValues?.paymentType === "credit-card" &&
    !paymentValues?.clicPayLinkClicked;

  const externalPaymentClicked =
    paymentValues?.paymentType === "credit-card" &&
    paymentValues?.clicPayLinkClicked;

  const handleLinkClick = () => {
    void updatePaymentData(
      {
        ...paymentValues,
        clicPayLinkClicked: true,
      },
      lipId,
    );
  };

  if (externalPaymentBlocked) {
    return (
      <Alert className="mb-0" variant="danger">
        <div className="d-flex justify-content-between align-items-center">
          <p className="mb-0">
            <FontAwesomeIcon
              icon={faCircleExclamation}
              className="me-2"
              size="xl"
            />
            Per proseguire con il pagamento è necessario effettuare il pagamento
            tramite il portale di ClicPay.
          </p>
          <Button
            as="a"
            href="https://clicpay.worldlineitalia.it/login"
            target="_blank"
            onClick={handleLinkClick}
          >
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="me-2" />
            Login ClicPay
          </Button>
        </div>
      </Alert>
    );
  }

  if (externalPaymentClicked) {
    return (
      <Alert className="mb-0" variant="success">
        <div className="d-flex justify-content-between align-items-center">
          <p className="mb-0">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="me-2 text-success"
              size="xl"
            />
            La procedura di pagamento è stata presa in carico da ClicPay.
          </p>
          <Button
            as="a"
            href="https://clicpay.worldlineitalia.it/login"
            target="_blank"
          >
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="me-2" />
            Login ClicPay
          </Button>
        </div>
      </Alert>
    );
  }

  return null;
}
