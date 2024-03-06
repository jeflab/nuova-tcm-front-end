import {Profile} from "@/entities/account";
import {PersonalData} from "@/entities/personalData";
import {RequestOTPModalContent} from "@/ui/eSign/RequestOTPModalContent";
import {Modal, ModalBody} from "react-bootstrap";

interface RequestOTPModalProps<TPayload> {
  lipId: number;
  onEsignComplete?: () => void;
  onHide: () => void;
  payload: TPayload;
  personalData?: PersonalData;
  profile: Profile;
  show: boolean;
}

export function RequestOTPModal<TPayload>({
  lipId,
  onEsignComplete,
  onHide,
  payload,
  personalData,
  profile,
  show,
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
        />
      </ModalBody>
    </Modal>
  );
}

export default RequestOTPModal;
