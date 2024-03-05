import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {dateTimeString} from "@/helpers/dates";
import {
  faCheckCircle,
  faEye,
  faFileSignature,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  Alert,
  Button,
  Card,
  Modal,
  ModalBody,
  ModalHeader,
  Stack,
} from "react-bootstrap";
import {Document, FileEsign} from "@/entities/document";

interface ESignsManagementModalProps {
  document: Document;
  eSigns: FileEsign[];
  show: boolean;
  onHide: () => void;
}

export function ESignsManagementModal({
  document,
  eSigns,
  show,
  onHide,
}: ESignsManagementModalProps) {
  const esignDocument = useDrawerStore((state) => state.esignDocument);

  const allEsigned = eSigns.every((eSign) => !!eSign.esignId);

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
      size="xl"
      className="mt-4 pe-3"
    >
      <ModalHeader closeButton>Firma il documento</ModalHeader>
      <ModalBody>
        <Stack gap={3}>
          <Button
            as="a"
            download
            href={`${process.env.REACT_APP_API_BASE_URL}proposals/TODO/download-file?fileName=${document.fileName}`}
            className="align-self-start"
          >
            <FontAwesomeIcon icon={faEye} /> Visualizza anteprima documento
          </Button>
          <h3>Firme richieste</h3>
          {eSigns.map((eSign, index) => (
            <Card body key={index} className="auto-margin-3">
              <div dangerouslySetInnerHTML={{__html: eSign.description}} />
              {eSign.esignId ? (
                <Alert variant="success" className="mb-0">
                  <FontAwesomeIcon icon={faCheckCircle} /> Firmato da{" "}
                  {eSign.esignUser?.name} {eSign.esignUser?.surname} in data{" "}
                  {dateTimeString(eSign.esignDate)}
                </Alert>
              ) : (
                <Button
                  onClick={() => {
                    esignDocument(document.fileName, eSign.esignIndex!);
                    if (allEsigned) {
                      onHide();
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faFileSignature} /> Firma tu per il
                  cliente document.fileName {document.fileName} eSign.esignIndex{" "}
                  {eSign.esignIndex}
                </Button>
              )}
            </Card>
          ))}
        </Stack>
      </ModalBody>
    </Modal>
  );
}
