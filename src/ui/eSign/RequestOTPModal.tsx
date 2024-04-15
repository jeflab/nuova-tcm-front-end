import {PDFType} from "@/models/entities/esign";
import {PersonalData} from "@/models/entities/personalData";
import {Tag} from "@/services/const";
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
  payload?: TPayload;
  pdfType: PDFType;
  personalData?: PersonalData;
  show: boolean;
  tagToRevalidate?: Tag;
}

export function RequestOTPModal<TPayload>({
  lipId,
  onEsignComplete,
  onHide,
  payload,
  pdfType,
  personalData,
  show,
  tagToRevalidate,
}: RequestOTPModalProps<TPayload>) {
  return (
    <Modal show={show} onHide={onHide} backdrop="static" centered>
      <ModalBody>
        <RequestOTPModalContent
          onCancel={onHide}
          personalData={personalData}
          payload={payload}
          pdfType={pdfType}
          lipId={lipId}
          onEsignComplete={onEsignComplete}
          tagToRevalidate={tagToRevalidate}
        />
      </ModalBody>
    </Modal>
  );
}

export default RequestOTPModal;
