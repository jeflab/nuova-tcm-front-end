"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {PDFType} from "@/entities/esign";
import RequestOTPModal from "@/ui/eSign/RequestOTPModal";
import {
  faCheckCircle,
  faDownload,
  faEye,
  faFileSignature,
  faSave,
  faXmark,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Fragment, startTransition, useState} from "react";
import {
  Button,
  Card,
  CardHeader,
  ModalBody,
  ModalFooter,
} from "react-bootstrap";
import styles from "./DocumentsManagement.module.scss";

interface Esign {
  key: string;
  whoEsign: "advisor" | "contractor";
  esignIndex: number;
  signed: boolean;
}
interface Document {
  key: string;
  fileName: string;
  urlPreview: string;
  urlDownload: string;
  type: PDFType;
  eSigns: Esign[];
}
const documents: Document[] = [
  {
    key: "identificazione",
    fileName: "File di identificazione",
    urlPreview: "pdf-identificazione-preview",
    urlDownload: "pdf-identificazione",
    type: PDFType.Identification,
    eSigns: [
      {
        key: "onlyOne",
        whoEsign: "advisor",
      } as Esign,
    ],
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
];

const eSignsCount = (
  documentESigns: Esign[],
  lipESigns: Record<string, {esign_id: number}>,
  filter?: string,
): [Esign[], Esign[]] => {
  let filteredESigns = documentESigns.map((eSign, index) => ({
    ...eSign,
    esignIndex: index,
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

export function DocumentsManagement() {
  const [esignModalOpen, setEsignModalOpen] =
    useState<`${"advisor" | "contractor"}-${string}`>();

  const lip = useDrawerStore((state) => state.lip);
  const closeModal = useDrawerStore((state) => state.closeModal);

  if (!lip) {
    return null;
  }

  const allAdvisorESigns = documents.every((document) => {
    const [partialAdvisorESign, totalAdvisorESign] = eSignsCount(
      document.eSigns,
      document.key === "identificazione"
        ? lip.eSigns?.identificazione
          ? {onlyOne: lip.eSigns.identificazione}
          : {}
        : lip.eSigns?.polizza ?? {},
      "advisor",
    );

    return partialAdvisorESign.length === totalAdvisorESign.length;
  });

  const [partialESign, totalESign] = documents.reduce(
    ([prevPartial, prevTotal], document) => {
      const [partialESign, totalESign] = eSignsCount(
        document.eSigns,
        document.key === "identificazione"
          ? lip.eSigns?.identificazione
            ? {onlyOne: lip.eSigns.identificazione}
            : {}
          : lip.eSigns?.polizza ?? {},
      );

      return [prevPartial.concat(partialESign), prevTotal.concat(totalESign)];
    },
    [[], []] as [Esign[], Esign[]],
  );

  const lastESign = partialESign.length === totalESign.length - 1;

  return (
    <>
      <ModalBody className="vstack gap-3">
        last? {lastESign ? "sì" : "no"}
        {documents.map((document) => {
          const [partialAdvisorESign, totalAdvisorESign] = eSignsCount(
            document.eSigns,
            document.key === "identificazione"
              ? lip.eSigns?.identificazione
                ? {onlyOne: lip.eSigns.identificazione}
                : {}
              : lip.eSigns?.polizza ?? {},
            "advisor",
          );
          const [partialContractorESign, totalContractorESign] = eSignsCount(
            document.eSigns,
            document.key === "identificazione"
              ? lip.eSigns?.identificazione
                ? {onlyOne: lip.eSigns.identificazione}
                : {}
              : lip.eSigns?.polizza ?? {},
            "contractor",
          );

          return (
            <Card key={document.fileName}>
              <CardHeader className={styles.documentHeader}>
                <strong>{document.fileName}</strong>
                {partialAdvisorESign.length === totalAdvisorESign.length &&
                partialContractorESign.length ===
                  totalContractorESign.length ? (
                  <Button
                    as="a"
                    size="sm"
                    download
                    className="ms-sm-auto"
                    href={`${process.env.NEXT_PUBLIC_API_URL}/${document.urlDownload}/?lipId=${lip.id}&agentId=${lip.agent.id}&contractorId=${lip.contractor.id}`}
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
                    href={`${process.env.NEXT_PUBLIC_API_URL}/${document.urlPreview}/?lipId=${lip.id}&agentId=${lip.agent.id}&contractorId=${lip.contractor.id}`}
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
                        {totalAdvisorESign.map((eSign) => (
                          <Fragment key={eSign.key}>
                            <Button
                              size="sm"
                              className="text-nowrap"
                              onClick={() => {
                                setEsignModalOpen(
                                  `advisor-${document.fileName}-${eSign.esignIndex}`,
                                );
                              }}
                              disabled={eSign.signed}
                            >
                              <FontAwesomeIcon
                                icon={faFileSignature}
                                className="me-2"
                              />
                              Firma
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
                                  closeModal();
                                }
                              }}
                              personalData={lip.contractor}
                              pdfType={document.type}
                              payload={{esignIndex: eSign.esignIndex}}
                              show={
                                esignModalOpen ===
                                `advisor-${document.fileName}-${eSign.esignIndex}`
                              }
                              lipId={lip.id}
                              tagToRevalidate={`getLip-${lip.id}`}
                            />
                          </Fragment>
                        ))}
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
                        {allAdvisorESigns ? (
                          totalContractorESign.map((eSign) => (
                            <Fragment key={eSign.key}>
                              <Button
                                size="sm"
                                className="text-nowrap"
                                onClick={() => {
                                  setEsignModalOpen(
                                    `contractor-${document.fileName}-${eSign.esignIndex}`,
                                  );
                                }}
                                disabled={eSign.signed}
                              >
                                <FontAwesomeIcon
                                  icon={faFileSignature}
                                  className="me-2"
                                />
                                Firma del cliente
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
                                    closeModal();
                                  }
                                }}
                                personalData={lip.contractor}
                                pdfType={document.type}
                                payload={{esignIndex: eSign.esignIndex}}
                                show={
                                  esignModalOpen ===
                                  `contractor-${document.fileName}-${eSign.esignIndex}`
                                }
                                lipId={lip.id}
                                tagToRevalidate={`getLip-${lip.id}`}
                              />
                            </Fragment>
                          ))
                        ) : (
                          <>In attesa delle firme del Consulente</>
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
