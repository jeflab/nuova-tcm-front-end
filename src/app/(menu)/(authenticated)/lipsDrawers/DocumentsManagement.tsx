"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {DocumentsChapterDetails} from "@/app/(menu)/(authenticated)/lipsDrawers/DocumentsChapterDetails";
import {PDFType} from "@/models/entities/esign";
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

export interface Esign {
  key: string;
  whoEsign: "advisor" | "contractor";
  esignIndex: number;
  signed: boolean;
  date?: string;
  chapters: string[];
}
export interface Document {
  key: "allegato4" | "setInformativo" | "identificazione" | "polizza";
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
        key: "esign_agente",
        whoEsign: "advisor",
        chapters: [
          "L'intermediario dichiara di avere incontrato di persona e di avere identificato attraverso il suo documento d'identità il contraente.",
        ],
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
      {
        key: "esign_agente",
        whoEsign: "advisor",
        chapters: [
          "PG 9/9 - Dichiarazione dell'intermediario.",
          "PG 9/9 - Firma del soggetto incaricato dell'adeguata verifica.",
        ],
      } as Esign,
      {
        key: "esign_contraente",
        whoEsign: "contractor",
        chapters: [
          "PG 5/9 - Dichiarazioni rese dall'assicurato in relazione al proprio stato di salute e abitudini di vita.",
          "PG 6/9 - Autorizzazione alla comunicazione elettronica.",
          "PG 6/9 - Dichiarazioni del contraente e dell'assicurato.",
          "PG 9/9 - Firma della proposta.",
        ],
      } as Esign,
      {
        key: "esign_contraente_sepa",
        whoEsign: "contractor",
        chapters: [
          "PG 5/9 - Firma del contraente per l'addebito diretto SEPA - S.D.D.",
        ],
      } as Esign,
    ],
  },
];

const eSignsCount = (
  documentESigns: Esign[],
  lipESigns: Record<string, {esign_id: number; data: string}>,
  filter?: string,
): [Esign[], Esign[]] => {
  let filteredESigns = documentESigns.map((eSign, index) => ({
    ...eSign,
    esignIndex: index,
    signed: !!lipESigns[eSign.key]?.esign_id,
    date: lipESigns[eSign.key]?.data,
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
  const [chapterModalOpen, setChapterModalOpen] =
    useState<`${"advisor" | "contractor"}-${string}`>();

  const lip = useDrawerStore((state) => state.lip);
  const closeModal = useDrawerStore((state) => state.closeModal);

  if (!lip) {
    return null;
  }

  const allAdvisorESigns = documents.every((document) => {
    const [partialAdvisorESign, totalAdvisorESign] = eSignsCount(
      document.eSigns,
      lip.eSigns?.[document.key] ?? {},
      "advisor",
    );

    return partialAdvisorESign.length === totalAdvisorESign.length;
  });

  const [partialESign, totalESign] = documents.reduce(
    ([prevPartial, prevTotal], document) => {
      const [partialESign, totalESign] = eSignsCount(
        document.eSigns,
        lip.eSigns?.[document.key] ?? {},
      );

      return [prevPartial.concat(partialESign), prevTotal.concat(totalESign)];
    },
    [[], []] as [Esign[], Esign[]],
  );

  // Ripensare all'auto-chiusura
  const lastESign = partialESign.length === totalESign.length - 1;

  return (
    <>
      <ModalBody className="vstack gap-3">
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
                        <Button
                          size="sm"
                          onClick={() => {
                            setChapterModalOpen(`advisor-${document.fileName}`);
                          }}
                          disabled={totalAdvisorESign.every(
                            (eSign) => eSign.signed,
                          )}
                        >
                          <FontAwesomeIcon
                            icon={faFileSignature}
                            className="me-2"
                          />
                          Firma
                        </Button>
                        <DocumentsChapterDetails
                          eSigns={totalAdvisorESign}
                          show={
                            chapterModalOpen === `advisor-${document.fileName}`
                          }
                          document={document}
                          lip={lip}
                          onHide={() => {
                            startTransition(() => {
                              setChapterModalOpen(undefined);
                            });
                          }}
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
                        {allAdvisorESigns ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => {
                                setChapterModalOpen(
                                  `contractor-${document.fileName}`,
                                );
                              }}
                              disabled={totalContractorESign.every(
                                (eSign) => eSign.signed,
                              )}
                            >
                              <FontAwesomeIcon
                                icon={faFileSignature}
                                className="me-2"
                              />
                              Firma del cliente
                            </Button>
                            <DocumentsChapterDetails
                              eSigns={totalContractorESign}
                              show={
                                chapterModalOpen ===
                                `contractor-${document.fileName}`
                              }
                              document={document}
                              lip={lip}
                              onHide={() => {
                                startTransition(() => {
                                  setChapterModalOpen(undefined);
                                });
                              }}
                            />
                          </>
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
