"use client";

import {useUpdatePaymentData} from "@/app/(menu)/(authenticated)/lips/[id]/mutations";
import {
  externalPaymentBlocked,
  externalPaymentClicked,
} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/documentsValidators";
import {isPaymentValid} from "@/app/(menu)/(authenticated)/lipsDrawers/payment/paymentValidators";
import {useSuspenseLip} from "@/app/(menu)/(authenticated)/lipsDrawers/useSuspenseLip";
import {
  faArrowUpRightFromSquare,
  faCheckCircle,
  faCircleExclamation,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Alert, Button} from "react-bootstrap";

export function DocumentsLockExternalPayment() {
  const {
    data: {lip},
  } = useSuspenseLip();
  const {mutateAsync: updatePaymentData} = useUpdatePaymentData();

  if (!isPaymentValid(lip)) {
    return null;
  }

  const handleLinkClick = () => {
    void updatePaymentData({
      lipId: lip.id,
      formData: {
        ...lip.payment,
        clicPayLinkClicked: true,
      },
    });
  };

  if (externalPaymentBlocked(lip)) {
    return (
      <Alert className="mb-0" variant="danger">
        <div className="d-flex justify-content-between align-items-center">
          <FontAwesomeIcon icon={faCircleExclamation} size="xl" />
          <p className="mb-0 mx-2">
            Per proseguire con il pagamento è necessario effettuare il pagamento
            tramite il portale di ClicPay.
          </p>
          <Button
            as="a"
            href="https://clicpay.worldlineitalia.it/login"
            target="_blank"
            onClick={handleLinkClick}
            className="ms-auto"
          >
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="me-2" />
            Login ClicPay
          </Button>
        </div>
      </Alert>
    );
  }

  if (externalPaymentClicked(lip)) {
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
