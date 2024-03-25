import {
  Document,
  Esign,
} from "@/app/(menu)/(authenticated)/lipsDrawers/DocumentsManagement";
import {dateTimeString} from "@/helpers/dates";
import {Lip} from "@/models/entities/lip";
import RequestOTPModal from "@/ui/eSign/RequestOTPModal";
import {
  faCheckCircle,
  faEye,
  faFileSignature,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {startTransition, useState} from "react";
import {
  Alert,
  Button,
  Card,
  Modal,
  ModalBody,
  ModalHeader,
  Stack,
} from "react-bootstrap";

interface ESignsManagementModalProps {
  document: Document;
  eSigns: Esign[];
  show: boolean;
  onHide: () => void;
  lip: Lip;
}

export function DocumentsChapterDetails({
  document,
  eSigns,
  show,
  onHide,
  lip,
}: ESignsManagementModalProps) {
  const [esignModalOpen, setEsignModalOpen] = useState<number>();

  const signed = eSigns.filter((eSign) => eSign.signed).length;
  const lastESign = signed === eSigns.length - 1;

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
            className="align-self-start"
            href={`${process.env.NEXT_PUBLIC_API_URL}/${document.urlPreview}/?lipId=${lip.id}&agentId=${lip.agent.id}&contractorId=${lip.contractor.id}`}
          >
            <FontAwesomeIcon icon={faEye} /> Visualizza anteprima del documento
          </Button>
          <h3>Firme richieste</h3>
          {eSigns.map((eSign, index) => (
            <Card body key={index} className="auto-margin-3">
              <div>
                <ul>
                  {eSign.chapters.map((chapter) => (
                    <li key={chapter}>{chapter}</li>
                  ))}
                </ul>
              </div>
              {eSign.signed ? (
                <Alert variant="success" className="mb-0">
                  <FontAwesomeIcon icon={faCheckCircle} /> Firmato in data{" "}
                  {dateTimeString(eSign.date)}
                </Alert>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      setEsignModalOpen(eSign.esignIndex);
                    }}
                  >
                    <FontAwesomeIcon icon={faFileSignature} /> Firma
                    {eSign.whoEsign === "contractor" ? " del contraente" : ""}
                  </Button>{" "}
                  <RequestOTPModal
                    onHide={() => {
                      startTransition(() => {
                        setEsignModalOpen(undefined);
                      });
                    }}
                    onEsignComplete={async () => {
                      setEsignModalOpen(undefined);
                      if (lastESign) {
                        onHide();
                      }
                    }}
                    personalData={
                      eSign.whoEsign === "contractor"
                        ? lip.contractor
                        : undefined
                    }
                    pdfType={document.type}
                    payload={{esignIndex: eSign.esignIndex}}
                    show={esignModalOpen === eSign.esignIndex}
                    lipId={lip.id}
                    tagToRevalidate={`getLip-${lip.id}`}
                  />
                </>
              )}
            </Card>
          ))}
        </Stack>
      </ModalBody>
    </Modal>
  );
}
