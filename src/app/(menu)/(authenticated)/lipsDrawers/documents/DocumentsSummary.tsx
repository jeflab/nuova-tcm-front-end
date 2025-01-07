"use client";

import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {CompanyPrivacy} from "@/app/(menu)/(authenticated)/lipsDrawers/CompanyPrivacy";
import {
  createDocuments,
  ESign,
} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/DocumentsManagement";
import {createDocumentUrl} from "@/helpers/createResourcesUrl";
import {validateDen} from "@/helpers/lip-validator";
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

const eSignsCount = (
  documentESigns: ESign[],
  lipESigns: Record<string, {esign_id: number}>,
  filter?: string,
): [ESign[], ESign[]] => {
  let filteredESigns = documentESigns.map((eSign, index) => ({
    ...eSign,
    eSignIndex: index,
    signed: !!lipESigns[eSign.key]?.esign_id,
  }));
  if (filter) {
    filteredESigns = filteredESigns.filter(
      (eSign) => eSign.whoESign === filter,
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

  const documents = createDocuments(lip.type);

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
            <strong>Firme Consulente:</strong>
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
          {lip.type !== "self-insured" && (
            <>
              <div>
                <strong>Firme Assicurato:</strong>
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
            </>
          )}
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
        const [partialInsuredESign, totalInsuredESign] = eSignsCount(
          document.eSigns,
          lip.eSigns?.[document.key] ?? {},
          "insured",
        );

        if (
          partialContractorESign < totalContractorESign ||
          partialAdvisorESign < totalAdvisorESign ||
          partialInsuredESign < totalInsuredESign
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
                  <strong>Firme Consulente:</strong>
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
              {lip.type !== "self-insured" && (
                <>
                  <div>
                    <strong>Firme Assicurato:</strong>
                    <span className="d-block d-sm-none">
                      {partialInsuredESign.length} di {totalInsuredESign.length}
                      {partialInsuredESign.length ===
                        totalInsuredESign.length && (
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          title="Completato"
                          className="text-success ms-2"
                        />
                      )}
                    </span>
                  </div>
                  <div className="doc-table-contractor-esign-content">
                    {totalInsuredESign.length > 0 ? (
                      <>
                        <span className="d-none d-sm-block">
                          {partialInsuredESign.length} di{" "}
                          {totalInsuredESign.length}
                          {partialInsuredESign.length ===
                            totalInsuredESign.length && (
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              title="Completato"
                              className="text-success ms-2"
                            />
                          )}
                        </span>
                        {totalInsuredESign.map((eSign) => (
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
              )}
            </div>
          </Card>
        );
      })}
    </Stack>
  );
}
