import {PDFType} from "@/models/entities/esign";
import {PersonalData} from "@/models/entities/personalData";
import {Tag} from "@/services/const";
import {createFEATransaction, signFEADoc} from "@/ui/eSign/actions";
import {InsertPhoneForm} from "@/ui/eSign/InsertPhoneForm";
import {RequestOTPForm} from "@/ui/eSign/RequestOTPForm";
import {faRotate, faSpinner, faXmark} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import useInterval from "@restart/hooks/useInterval";
import useMountEffect from "@restart/hooks/useMountEffect";
import {useMutation} from "@tanstack/react-query";
import {useState} from "react";
import {Alert, Button} from "react-bootstrap";

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
  const [counter, setCounter] = useState(60);
  const [updatePhoneOpen, setUpdatePhoneOpen] = useState(false);

  const {
    mutate: requestOTP,
    data: createdFEATransaction,
    error: createdFEATransactionError,
    isIdle: isCreatedFEATransactionIdle,
    isPending: isCreatedFEATransactionPending,
    isError: isCreatedFEATransactionError,
  } = useMutation({
    mutationKey: ["createFEATransaction", lipId],
    mutationFn: async (data: {contractorId?: number; lipId: number}) => {
      console.log("Calling createFEATransaction from useQuery");
      setCounter(60);

      const response = await createFEATransaction(data);

      if (response.featTransaction?.status !== "success") {
        throw new Error(response.featTransaction.message);
      }
      if (response.profile?.status !== "success") {
        throw new Error(response.profile.message);
      }

      return {
        featTransaction: response.featTransaction,
        profile: response.profile,
      };
    },
  });

  useMountEffect(() => {
    // Uso un timeout per evitare che la richiesta venga fatta più volte
    const timeout = setTimeout(() => {
      requestOTP({contractorId: personalData?.id, lipId: lipId});
    }, 100);
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
              onClick={() => {
                requestOTP({contractorId: personalData?.id, lipId: lipId});
              }}
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
      resendOTP={() => {
        requestOTP({contractorId: personalData?.id, lipId: lipId});
      }}
      tagToRevalidate={tagToRevalidate}
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
      onNumberUpdated={() => {
        requestOTP({contractorId: personalData?.id, lipId: lipId});
      }}
      personalData={personalData}
      profile={createdFEATransaction.profile}
    />
  );
}
