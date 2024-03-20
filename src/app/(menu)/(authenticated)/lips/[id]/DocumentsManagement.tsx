"use client";

import {ESignsManagementModal} from "@/app/(menu)/(authenticated)/lips/[id]/DocumentsManagement/ESignsManagementModal";
import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {FileEsign} from "@/entities/document";
import {
  faCheckCircle,
  faDownload,
  faEye,
  faFileSignature,
  faSave,
  faXmark,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";
import {
  Button,
  Card,
  CardHeader,
  ModalBody,
  ModalFooter,
} from "react-bootstrap";
import styles from "./DocumentsManagement.module.scss";

const eSignsCount = (
  eSigns: FileEsign[],
  filter?: string,
): [FileEsign[], FileEsign[]] => {
  let filteredESigns = eSigns.map((eSign, index) => ({
    ...eSign,
    esignIndex: index,
  }));
  if (filter) {
    filteredESigns = filteredESigns.filter(
      (eSign) => eSign.whoEsign === filter,
    );
  }

  const total = filteredESigns;
  const partial = filteredESigns.filter((eSign) => eSign.esignId);
  return [partial, total];
};

export function DocumentsManagement() {
  const [esignModalOpen, setEsignModalOpen] =
    useState<`${"advisor" | "contractor"}-${string}`>();
  const defaultDocuments = useDrawerStore((state) => state.defaultDocuments);
  const lipsDocuments = useDrawerStore((state) => state.lipData.documentation);
  const closeModal = useDrawerStore((state) => state.closeModal);
  const lipId = 1;

  const documents = lipsDocuments ?? defaultDocuments;

  const allAdvisorESigns = documents.files.every((file) =>
    file.esigns
      .filter((eSign) => eSign.whoEsign === "advisor")
      .every((eSign) => !!eSign.esignId),
  );

  return (
    <>
      <ModalBody className="vstack gap-3">
        {documents.files.map((document) => {
          const [partialAdvisorESign, totalAdvisorESign] = eSignsCount(
            document.esigns,
            "advisor",
          );
          const [partialContractorESign, totalContractorESign] = eSignsCount(
            document.esigns,
            "contractor",
          );

          return (
            <Card key={document.fileName}>
              <CardHeader className={styles.documentHeader}>
                <strong>{document.fileName}</strong>
                <span>{document.requiredFile && "(Obbligatorio)"}</span>
                {document.allRequiredEsigned ? (
                  <Button
                    as="a"
                    size="sm"
                    download
                    className="ms-sm-auto"
                    href={`${process.env.API_URL}proposals/${lipId}/download-file-esign?fileName=${document.fileName}`}
                  >
                    <FontAwesomeIcon icon={faDownload} /> Scarica il documento
                    firmato
                  </Button>
                ) : (
                  <Button
                    as="a"
                    size="sm"
                    download
                    className="ms-sm-auto"
                    href={`${process.env.API_URL}proposals/${lipId}/download-file?fileName=${document.fileName}`}
                  >
                    <FontAwesomeIcon icon={faEye} /> Visualizza anteprima del
                    documento
                  </Button>
                )}
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
                        <Button
                          size="sm"
                          className="text-nowrap"
                          onClick={() => {
                            setEsignModalOpen(`advisor-${document.fileName}`);
                          }}
                        >
                          {totalAdvisorESign.length >
                          partialAdvisorESign.length ? (
                            <>
                              <FontAwesomeIcon icon={faFileSignature} /> Firma
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faEye} /> Visualizza
                            </>
                          )}
                        </Button>
                        <ESignsManagementModal
                          document={document}
                          eSigns={totalAdvisorESign}
                          show={
                            esignModalOpen === `advisor-${document.fileName}`
                          }
                          onHide={() => setEsignModalOpen(undefined)}
                        />
                      </>
                    ) : (
                      <>Nessuna firma richiesta</>
                    )}
                  </div>
                </>
                <>
                  <div>
                    <strong>Firme cliente:</strong>
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
                        {allAdvisorESigns && (
                          <>
                            <Button
                              size="sm"
                              className="text-nowrap"
                              onClick={() => {
                                setEsignModalOpen(
                                  `contractor-${document.fileName}`,
                                );
                              }}
                            >
                              {totalContractorESign.length >
                              partialContractorESign.length ? (
                                <>
                                  <FontAwesomeIcon icon={faFileSignature} />{" "}
                                  Firma tu per il cliente
                                </>
                              ) : (
                                <>
                                  <FontAwesomeIcon icon={faEye} /> Visualizza
                                </>
                              )}
                            </Button>
                            <ESignsManagementModal
                              document={document}
                              eSigns={totalContractorESign}
                              show={
                                esignModalOpen ===
                                `contractor-${document.fileName}`
                              }
                              onHide={() => setEsignModalOpen(undefined)}
                            />
                          </>
                        )}
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
      </ModalBody>
      <ModalFooter>
        <Button type="button" variant="cancel" onClick={() => closeModal()}>
          <FontAwesomeIcon icon={faXmark} className="me-2" />
          Annulla
        </Button>
        <Button type="submit" variant="primary" onClick={() => closeModal()}>
          <FontAwesomeIcon icon={faSave} className="me-2" />
          Salva e prosegui
        </Button>
      </ModalFooter>
    </>
  );
}
