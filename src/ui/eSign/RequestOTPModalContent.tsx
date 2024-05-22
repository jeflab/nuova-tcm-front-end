import {PDFType} from "@/models/entities/esign";
import {PersonalData} from "@/models/entities/personalData";
import {Tag} from "@/services/const";
import {createFEATransaction, signFEADoc} from "@/ui/eSign/actions";
import {InsertPhoneForm} from "@/ui/eSign/InsertPhoneForm";
import {RequestOTPForm} from "@/ui/eSign/RequestOTPForm";
import {faRotate, faSpinner, faXmark} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import useMountEffect from "@restart/hooks/useMountEffect";
import {useCallback, useRef, useState} from "react";
import {Alert, Button} from "react-bootstrap";
import useInterval from "@restart/hooks/useInterval";

interface RequestOTPModalContentProps<TPayload> {
  lipId: number;
  onCancel: () => void;
  onEsignComplete?: (
    response: Extract<
      Awaited<ReturnType<typeof signFEADoc>>,
      {status: "success"}
    >,
  ) => void;
  payload: TPayload;
  personalData?: PersonalData;
  tagToRevalidate?: Tag;
  pdfType: PDFType;
}
export function RequestOTPModalContent<TPayload>({
  lipId,
  onCancel,
  onEsignComplete,
  payload,
  pdfType,
  personalData,
  tagToRevalidate,
}: RequestOTPModalContentProps<TPayload>) {
  const callingServer = useRef(false);
  const [counter, setCounter] = useState(60);
  const [updatePhoneOpen, setUpdatePhoneOpen] = useState(false);
  const [isRequestOTPLoading, setIsRequestOTPLoading] = useState(false);
  const [requestOTPError, setRequestOTPError] = useState<string>();
  const [createdFEATransaction, setCreatedFEATransaction] =
    useState<Awaited<ReturnType<typeof createFEATransaction>>>();

  useInterval(() => setCounter((counter) => counter - 1), 1000, counter <= 0);

  // TODO: Da sostituire con tanstack-query o rtk-query per ora usiamo il ref
  const requestOTP = useCallback(async () => {
    if (!callingServer.current) {
      setIsRequestOTPLoading(true);
      callingServer.current = true;
      setCounter(60);
      const response = await createFEATransaction({
        contractorId: personalData?.id,
        lipId: lipId,
      });

      if (response.featTransaction?.status !== "success") {
        setRequestOTPError(response.featTransaction.message);
        setIsRequestOTPLoading(false);
        callingServer.current = false;
        return;
      } else if (response.profile?.status !== "success") {
        setRequestOTPError(response.profile.message);
        setIsRequestOTPLoading(false);
        callingServer.current = false;
        return;
      }

      setCreatedFEATransaction(response);
      setIsRequestOTPLoading(false);
      callingServer.current = false;
    }
  }, [lipId, personalData?.id]);

  useMountEffect(() => {
    void requestOTP();
  });

  if (isRequestOTPLoading) {
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
  } else if (requestOTPError) {
    return (
      <>
        <Alert variant="danger">{requestOTPError}</Alert>
        <div className="text-center">
          <Button variant="cancel" type="button" onClick={onCancel}>
            Chiudi
          </Button>
        </div>
      </>
    );
  } else if (
    !createdFEATransaction ||
    createdFEATransaction.featTransaction.status !== "success" ||
    createdFEATransaction.profile.status !== "success"
  ) {
    // TODO: Togliere quando messo tanstack o rtk
    return (
      <>
        <Alert variant="danger">
          Si è verificato un errore durante l'invio dell'OTP. Riprova più tardi.
        </Alert>
        <div className="text-center">
          <Button variant="cancel" type="button" onClick={onCancel}>
            Chiudi
          </Button>
        </div>
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
      onEsignComplete={onEsignComplete}
      payload={payload}
      resendOTP={requestOTP}
      tagToRevalidate={tagToRevalidate}
    />
  ) : (
    <InsertPhoneForm
      closeEditNumberForm={() => {
        setUpdatePhoneOpen(false);
      }}
      defaultValues={{phone: createdFEATransaction.profile.user.phone ?? ""}}
      onCancel={onCancel}
      personalData={personalData}
      profile={createdFEATransaction.profile}
    />
  );
}
