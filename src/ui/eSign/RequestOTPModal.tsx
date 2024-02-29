import {Profile} from "@/entities/account";
import {PersonalData} from "@/entities/personalData";
import {RequestOTPModalContent} from "@/ui/eSign/RequestOTPModalContent";
import {Modal, ModalBody} from "react-bootstrap";

interface RequestOTPModalProps<TPayload> {
  onHide: () => void;
  personalData?: PersonalData;
  profile: Profile;
  show: boolean;
  payload: TPayload;
  lipId: number;
}

export function RequestOTPModal<TPayload>({
  onHide,
  personalData,
  profile,
  show,
  payload,
  lipId,
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
        />
      </ModalBody>
    </Modal>
  );
}

export default RequestOTPModal;
