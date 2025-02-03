import {
  Document,
  ESign,
} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/DocumentsManagement";
import {dateTimeString} from "@/helpers/dates";
import {Lip} from "@/models/entities/lip";
import {Tags} from "@/services/const";
import {DownloadDocumentButton} from "@/ui/DownloadDocumentButton";
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
  eSigns: ESign[];
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
      size="lg"
      className="mt-4"
    >
      <ModalHeader closeButton>Firma il documento</ModalHeader>
      <ModalBody>
        <Stack gap={3}>
          <DownloadDocumentButton
            className="align-self-start"
            uri={document.urlPreview}
            lipId={lip.id}
            agentId={lip.agent.id}
            contractorId={lip.contractor.id}
            icon={faEye}
          >
            Visualizza anteprima del documento
          </DownloadDocumentButton>
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
                      setEsignModalOpen(eSign.eSignIndex);
                    }}
                  >
                    <FontAwesomeIcon icon={faFileSignature} /> Firma
                    {eSign.whoESign === "contractor"
                      ? " del Contraente"
                      : eSign.whoESign === "insured"
                        ? " dell'Assicurato"
                        : " del Consulente"}
                  </Button>
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
                      eSign.whoESign === "contractor"
                        ? lip.contractor
                        : eSign.whoESign === "insured" && lip.insured
                          ? lip.insured
                          : undefined
                    }
                    whoESign={eSign.whoESign}
                    pdfType={document.type}
                    payload={{esignIndex: eSign.eSignIndex}}
                    show={esignModalOpen === eSign.eSignIndex}
                    lipId={lip.id}
                    tagToRevalidate={Tags.getLip(lip.id)}
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
