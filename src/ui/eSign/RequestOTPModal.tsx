import {Profile} from "@/entities/account";
import {PersonalData} from "@/entities/personalData";
import {signFEADoc} from "@/ui/eSign/actions";
import {RequestOTPModalContent} from "@/ui/eSign/RequestOTPModalContent";
import {Modal, ModalBody} from "react-bootstrap";

interface RequestOTPModalProps<TPayload> {
  lipId: number;
  onEsignComplete?: (
    response: Extract<
      Awaited<ReturnType<typeof signFEADoc>>,
      {status: "success"}
    >,
  ) => void;
  onHide: () => void;
  payload: TPayload;
  personalData?: PersonalData;
  profile: Profile;
  show: boolean;
  tagToRevalidate?: string;
}

export function RequestOTPModal<TPayload>({
  lipId,
  onEsignComplete,
  onHide,
  payload,
  personalData,
  profile,
  show,
  tagToRevalidate,
}: RequestOTPModalProps<TPayload>) {
  return (
    <Modal show={show} onHide={onHide} backdrop="static" centered>
      <ModalBody>
        <RequestOTPModalContent
          onCancel={onHide}
          personalData={personalData}
          profile={profile}
          payload={payload}
          lipId={lipId}
          onEsignComplete={onEsignComplete}
          tagToRevalidate={tagToRevalidate}
        />
      </ModalBody>
    </Modal>
  );
}

export default RequestOTPModal;
