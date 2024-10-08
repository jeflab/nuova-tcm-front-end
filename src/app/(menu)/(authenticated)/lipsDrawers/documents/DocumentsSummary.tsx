"use client";

import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {CompanyPrivacy} from "@/app/(menu)/(authenticated)/lipsDrawers/CompanyPrivacy";
import {createDocumentUrl} from "@/helpers/createResourcesUrl";
import {validateDen} from "@/helpers/lip-validator";
import {PDFType} from "@/models/entities/esign";
import {
  faCheckCircle,
  faClipboardListCheck,
  faDownload,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  Modal,
  ModalHeader,
  Stack,
} from "react-bootstrap";
import styles from "./DocumentsManagement.module.scss";

interface Esign {
  key: string;
  whoEsign: "advisor" | "contractor";
  eSignIndex: number;
  signed: boolean;
}
interface Document {
  key: "allegato4" | "setInformativo" | "identificazione" | "polizza";
  fileName: string;
  urlPreview: string;
  urlDownload: string;
  type: PDFType;
  eSigns: Esign[];
}
const documents = [
  {
    key: "identificazione",
    fileName: "File di identificazione",
    urlPreview: "pdf-identificazione-preview",
    urlDownload: "pdf-identificazione",
    type: PDFType.Identification,
    eSigns: [
      {
        key: "esign_agente",
        whoEsign: "advisor",
      } as Esign,
    ],
  },
  {
    key: "allegato4",
    fileName: "Allegato 4",
    urlPreview: "pdf-allegato4",
    urlDownload: "pdf-allegato4",
    type: PDFType.Allegato4,
    eSigns: [],
  },
  {
    key: "setInformativo",
    fileName: "Set informativo",
    urlPreview: "set-informativo",
    urlDownload: "set-informativo",
    type: PDFType.SetInformativo,
    eSigns: [],
  },
  {
    key: "polizza",
    fileName: "File di Proposta",
    urlPreview: "pdf-proposta-preview",
    urlDownload: "pdf-proposta",
    type: PDFType.Proposal,
    eSigns: [
      {key: "esign_agente", whoEsign: "advisor"} as Esign,
      {key: "esign_contraente", whoEsign: "contractor"} as Esign,
      {key: "esign_contraente_sepa", whoEsign: "contractor"} as Esign,
    ],
  },
] as const satisfies Document[];

const eSignsCount = (
  documentESigns: Esign[],
  lipESigns: Record<string, {esign_id: number}>,
  filter?: string,
): [Esign[], Esign[]] => {
  let filteredESigns = documentESigns.map((eSign, index) => ({
    ...eSign,
    eSignIndex: index,
    signed: !!lipESigns[eSign.key]?.esign_id,
  }));
  if (filter) {
    filteredESigns = filteredESigns.filter(
      (eSign) => eSign.whoEsign === filter,
    );
  }

  const total = filteredESigns;
  const partial = filteredESigns.filter((eSign) => eSign.signed);
  return [partial, total];
};

export function DocumentsSummary() {
  const [isConsentCheckOpen, setIsConsentCheckOpen] = useState(false);
  const lip = useStore((state) => state.lip);
  const denValid = useStore((state) => validateDen(state.lip?.den));

  if (!lip || !denValid) {
    return null;
  }

  return (
    <Stack gap={3}>
      <Card>
        <CardHeader className={styles.documentHeader}>
          <strong>Privacy di compagnia</strong>
          {lip.privacyCompany && (
            <Button
              size="sm"
              className="ms-sm-auto"
              onClick={() => {
                setIsConsentCheckOpen(true);
              }}
            >
              <FontAwesomeIcon icon={faClipboardListCheck} /> Controlla i
              consensi
            </Button>
          )}
        </CardHeader>
        <div className={styles.docTableActions}>
          <div>
            <strong>Firme consulente:</strong>
            <span className="d-block d-sm-none">
              <FontAwesomeIcon
                icon={faCheckCircle}
                title="Completato"
                className="text-success ms-2"
              />
            </span>
          </div>
          <div>Nessuna firma richiesta</div>
          <div>
            <strong>Firme Contraente:</strong>
            <span className="d-block d-sm-none">
              <FontAwesomeIcon
                icon={faCheckCircle}
                title="Completato"
                className="text-success ms-2"
              />
            </span>
          </div>
          <div className="doc-table-contractor-esign-content">
            Nessuna firma richiesta
          </div>
        </div>
      </Card>
      <Modal
        backdrop="static"
        className={styles.modal}
        fullscreen="xl-down"
        keyboard={false}
        onHide={() => setIsConsentCheckOpen(false)}
        show={isConsentCheckOpen}
        size="xl"
      >
        <ModalHeader closeButton>
          <Modal.Title>Privacy di compagnia</Modal.Title>
        </ModalHeader>
        <CompanyPrivacy
          onHide={() => setIsConsentCheckOpen(false)}
          lipId={lip.id}
          agentId={lip.agent.id}
          contractorId={lip.contractor.id}
        />
      </Modal>

      {documents.map((document) => {
        const [partialAdvisorESign, totalAdvisorESign] = eSignsCount(
          document.eSigns,
          lip.eSigns?.[document.key] ?? {},
          "advisor",
        );
        const [partialContractorESign, totalContractorESign] = eSignsCount(
          document.eSigns,
          lip.eSigns?.[document.key] ?? {},
          "contractor",
        );

        if (
          partialContractorESign < totalContractorESign ||
          partialAdvisorESign < totalAdvisorESign
        ) {
          return null;
        }

        return (
          <Card key={document.fileName}>
            <CardHeader className={styles.documentHeader}>
              <strong>{document.fileName}</strong>
              <Button
                as="a"
                size="sm"
                download
                className="ms-sm-auto"
                href={createDocumentUrl({
                  uri: document.urlDownload,
                  lipId: lip.id,
                  agentId: lip.agent.id,
                  contractorId: lip.contractor.id,
                })}
              >
                <FontAwesomeIcon icon={faDownload} /> Scarica il documento
                {document.eSigns.length > 0 ? " firmato" : ""}
              </Button>
            </CardHeader>
            <div className={styles.docTableActions}>
              <>
                <div>
                  <strong>Firme consulente:</strong>
                  <span className="d-block d-sm-none">
                    {partialAdvisorESign.length} di {totalAdvisorESign.length}
                    {partialAdvisorESign.length ===
                      totalAdvisorESign.length && (
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        title="Completato"
                        className="text-success ms-2"
                      />
                    )}
                  </span>
                </div>
                <div>
                  {totalAdvisorESign.length > 0 ? (
                    <>
                      <span className="d-none d-sm-block">
                        {partialAdvisorESign.length} di{" "}
                        {totalAdvisorESign.length}
                        {partialAdvisorESign.length ===
                          totalAdvisorESign.length && (
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            title="Completato"
                            className="text-success ms-2"
                          />
                        )}
                      </span>
                      {totalAdvisorESign.map((eSign) => (
                        <Badge
                          key={eSign.key}
                          bg="success"
                          className="text-nowrap"
                        >
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="me-2"
                          />
                          Firmato
                        </Badge>
                      ))}
                    </>
                  ) : (
                    <>Nessuna firma richiesta</>
                  )}
                </div>
              </>
              <>
                <div>
                  <strong>Firme Contraente:</strong>
                  <span className="d-block d-sm-none">
                    {partialContractorESign.length} di{" "}
                    {totalContractorESign.length}
                    {partialContractorESign.length ===
                      totalContractorESign.length && (
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        title="Completato"
                        className="text-success ms-2"
                      />
                    )}
                  </span>
                </div>
                <div className="doc-table-contractor-esign-content">
                  {totalContractorESign.length > 0 ? (
                    <>
                      <span className="d-none d-sm-block">
                        {partialContractorESign.length} di{" "}
                        {totalContractorESign.length}
                        {partialContractorESign.length ===
                          totalContractorESign.length && (
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            title="Completato"
                            className="text-success ms-2"
                          />
                        )}
                      </span>
                      {totalContractorESign.map((eSign) => (
                        <Badge
                          key={eSign.key}
                          bg="success"
                          className="text-nowrap"
                        >
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="me-2"
                          />
                          Firmato
                        </Badge>
                      ))}
                    </>
                  ) : (
                    <>Nessuna firma richiesta</>
                  )}
                </div>
              </>
            </div>
          </Card>
        );
      })}
    </Stack>
  );
}
