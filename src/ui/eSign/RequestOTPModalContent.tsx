import {Profile} from "@/entities/account";
import {PDFType} from "@/entities/esign";
import {PersonalData} from "@/entities/personalData";
import {createFEATransaction} from "@/ui/eSign/actions";
import {InsertPhoneForm} from "@/ui/eSign/InsertPhoneForm";
import {RequestOTPForm} from "@/ui/eSign/RequestOTPForm";
import {faSpinner} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import useMountEffect from "@restart/hooks/useMountEffect";
import {useRef, useState} from "react";
import {Alert, Button} from "react-bootstrap";

interface RequestOTPModalContentProps<TPayload> {
  lipId: number;
  onCancel: () => void;
  onEsignComplete?: () => void;
  payload: TPayload;
  personalData?: PersonalData;
  profile: Profile;
}
export function RequestOTPModalContent<TPayload>({
  lipId,
  onCancel,
  onEsignComplete,
  payload,
  personalData,
  profile,
}: RequestOTPModalContentProps<TPayload>) {
  const callingServer = useRef(false);
  const [updatePhoneOpen, setUpdatePhoneOpen] = useState(false);
  const [isRequestOTPLoading, setIsRequestOTPLoading] = useState(false);
  const [requestOTPError, setRequestOTPError] = useState<string>();
  const [createdFEATransaction, setCreatedFEATransaction] =
    useState<Awaited<ReturnType<typeof createFEATransaction>>>();

  // TODO: Da sostituire con tanstack-query o rtk-query per ora usiamo il ref
  useMountEffect(() => {
    (async () => {
      if (!callingServer.current) {
        setIsRequestOTPLoading(true);
        callingServer.current = true;
        const response = await createFEATransaction({
          pdfType: PDFType.Privacy,
          contractorId: personalData?.id,
          lipId: lipId,
          payload,
        });

        if (response.status === "failed") {
          setRequestOTPError(response.message);
          setIsRequestOTPLoading(false);
          callingServer.current = false;
          return;
        }

        setCreatedFEATransaction(response);
        setIsRequestOTPLoading(false);
        callingServer.current = false;
      }
    })();
  });

  if (isRequestOTPLoading) {
    return (
      <Alert variant="info" className="mb-0">
        <FontAwesomeIcon icon={faSpinner} className="fa-spin" /> Invio OTP in
        corso...
      </Alert>
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
    createdFEATransaction.status === "failed"
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
      profile={profile}
      lipId={lipId}
      pdfType={PDFType.Privacy}
      transactionId={createdFEATransaction.esign.transactionId}
      onEsignComplete={onEsignComplete}
    />
  ) : (
    <InsertPhoneForm
      closeEditNumberForm={() => {
        setUpdatePhoneOpen(false);
      }}
      defaultValues={{phone: profile.user.phone ?? ""}}
      onCancel={onCancel}
      personalData={personalData}
      profile={profile}
    />
  );
}
