import {ESign} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/DocumentsManagement";
import {PDFType} from "@/models/entities/esign";
import {PersonalData} from "@/models/entities/personalData";
import {Tag} from "@/services/const";
import {signFEADoc} from "@/ui/eSign/actions";
import {InsertPhoneForm} from "@/ui/eSign/InsertPhoneForm";
import {useRequestOTPMutation} from "@/ui/eSign/mutations";
import {RequestOTPForm} from "@/ui/eSign/RequestOTPForm";
import {faRotate, faSpinner, faXmark} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import useInterval from "@restart/hooks/useInterval";
import useMountEffect from "@restart/hooks/useMountEffect";
import {useState} from "react";
import {Alert, Button, Stack} from "react-bootstrap";

interface RequestOTPModalContentProps<TPayload> {
  lipId: number;
  onCancel: () => void;
  onESignComplete?: (
    response: Extract<
      Awaited<ReturnType<typeof signFEADoc>>,
      {status: "success"}
    >,
  ) => void;
  payload: TPayload;
  personalData?: PersonalData;
  tagToRevalidate?: Tag;
  pdfType: PDFType;
  whoESign: ESign["whoESign"];
}
export function RequestOTPModalContent<TPayload>({
  lipId,
  onCancel,
  onESignComplete,
  payload,
  pdfType,
  personalData,
  tagToRevalidate,
  whoESign,
}: RequestOTPModalContentProps<TPayload>) {
  const [counter, setCounter] = useState(60);
  const [updatePhoneOpen, setUpdatePhoneOpen] = useState(false);

  const {
    mutate: createFEATransaction,
    data: createdFEATransaction,
    error: createdFEATransactionError,
    isIdle: isCreatedFEATransactionIdle,
    isPending: isCreatedFEATransactionPending,
    isError: isCreatedFEATransactionError,
  } = useRequestOTPMutation({lipId: lipId, contractorId: personalData?.id});

  const requestOTP = () => {
    createFEATransaction();
    setCounter(60);
  };

  useMountEffect(() => {
    // Uso un timeout per evitare che la richiesta venga fatta più volte
    const timeout = setTimeout(requestOTP, 100);
    return () => clearTimeout(timeout);
  });

  useInterval(
    () => setCounter((counter) => counter - 1),
    1000,
    !isCreatedFEATransactionPending || counter <= 0,
  );

  if (isCreatedFEATransactionPending || isCreatedFEATransactionIdle) {
    return (
      <>
        <Alert variant="info">
          <FontAwesomeIcon icon={faSpinner} className="fa-spin" /> Invio OTP in
          corso...
        </Alert>
        <div className="d-flex justify-content-between">
          <span>
            <Button
              variant="secondary"
              type="button"
              disabled={counter > 0}
              onClick={requestOTP}
            >
              <FontAwesomeIcon icon={faRotate} className="me-2" />
              Invia di nuovo
            </Button>{" "}
            tra {counter} secondi
          </span>
          <Button variant="cancel" type="button" onClick={onCancel}>
            <FontAwesomeIcon icon={faXmark} className="me-2" />
            Annulla
          </Button>
        </div>
      </>
    );
  }
  if (isCreatedFEATransactionError) {
    return (
      <>
        <Alert variant="danger">{createdFEATransactionError.message}</Alert>
        <Stack direction="horizontal" gap={2}>
          <Button variant="secondary" type="button" onClick={requestOTP}>
            <FontAwesomeIcon icon={faRotate} className="me-2" />
            Riprova
          </Button>
          <Button variant="cancel" type="button" onClick={onCancel}>
            Chiudi
          </Button>
        </Stack>
      </>
    );
  }

  return !updatePhoneOpen ? (
    <RequestOTPForm
      onCancel={onCancel}
      openEditNumberForm={() => {
        setUpdatePhoneOpen(true);
      }}
      personalData={personalData}
      profile={createdFEATransaction.profile}
      lipId={lipId}
      pdfType={pdfType}
      transactionId={createdFEATransaction.featTransaction.esign.transactionId}
      onESignComplete={onESignComplete}
      payload={payload}
      resendOTP={requestOTP}
      tagToRevalidate={tagToRevalidate}
      whoESign={whoESign}
    />
  ) : (
    <InsertPhoneForm
      closeEditNumberForm={() => {
        setUpdatePhoneOpen(false);
      }}
      defaultValues={{
        phone:
          personalData?.phone ?? createdFEATransaction.profile.user.phone ?? "",
      }}
      lipId={lipId}
      onCancel={onCancel}
      onNumberUpdated={requestOTP}
      personalData={personalData}
      profile={createdFEATransaction.profile}
    />
  );
}
