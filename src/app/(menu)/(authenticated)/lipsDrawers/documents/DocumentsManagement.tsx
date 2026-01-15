"use client";

import {LipWithDen} from "@/app/(menu)/(authenticated)/lipsDrawers/den/denValidators";
import {DocumentsChapterDetails} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/DocumentsChapterDetails";
import {isPaymentValid} from "@/app/(menu)/(authenticated)/lipsDrawers/payment/paymentValidators";
import {
  DocumentManagementDownloadUris,
  DocumentManagementPreviewUris,
} from "@/app/download-doc/schema";
import {PDFType} from "@/models/entities/esign";
import {Lip} from "@/models/entities/lip";
import {DownloadDocumentButton} from "@/ui/DownloadDocumentButton";
import {useDrawerModal} from "@/ui/ModalContext";
import {
  faCheckCircle,
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

export interface ESign {
  key: string;
  whoESign: "advisor" | "contractor" | "insured";
  eSignIndex: number;
  signed: boolean;
  date?: string;
  chapters: string[];
}
export interface Document {
  key:
    | "allegato4"
    | "setInformativo"
    | "identificazione"
    | "identificazione_assicurato"
    | "polizza";
  fileName: string;
  urlPreview: DocumentManagementPreviewUris;
  urlDownload: DocumentManagementDownloadUris;
  type: PDFType;
  eSigns: ESign[];
}
export const createDocuments: (
  lipType: Lip["type"],
  lipDocuments: Lip["documents"],
) => readonly Document[] = (lipType, lipDocuments) =>
  [
    {
      key: "identificazione",
      fileName: "File di identificazione del Contraente",
      urlPreview: "pdf-identificazione-preview",
      urlDownload: "pdf-identificazione",
      type: PDFType.Identification,
      eSigns: [
        {
          key: "esign_agente",
          whoESign: "advisor",
          chapters: [
            "L'Intermediario dichiara di avere incontrato di persona e di avere identificato attraverso il suo documento d'identità il Contraente.",
          ],
        } as ESign,
      ],
    },
    ...((lipType !== "self-insured"
      ? [
          {
            key: "identificazione_assicurato",
            fileName: "File di identificazione dell'Assicurato",
            urlPreview: "pdf-identificazione-assicurato-preview",
            urlDownload: "pdf-identificazione-assicurato",
            type: PDFType.InsuredIdentification,
            eSigns: [
              {
                key: "esign_agente",
                whoESign: "advisor",
                chapters: [
                  "L'Intermediario dichiara di avere incontrato di persona e di avere identificato attraverso il suo documento d'identità l'Assicurato.",
                ],
              } as ESign,
            ],
          },
        ]
      : []) satisfies Document[]),
    ...((lipDocuments && "fileAllegato4" in lipDocuments
      ? [
          {
            key: "allegato4",
            fileName: "Allegato 4",
            urlPreview: "pdf-allegato4",
            urlDownload: "pdf-allegato4",
            type: PDFType.Allegato4,
            eSigns: [],
          },
        ]
      : []) satisfies Document[]),
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
        {
          key: "esign_agente",
          whoESign: "advisor",
          chapters: [
            "PG 2/34 - Dichiarazione di coerenza del contratto.",
            "PG 34/34 - Firma del soggetto incaricato dell'adeguata verifica.",
          ],
        } as ESign,
        {
          key: "esign_contraente",
          whoESign: "contractor",
          chapters: [
            "PG 11/34 - Autorizzazione alla comunicazione elettronica.",
            "PG 12/34 - Dichiarazioni del Contraente e dell'Assicurato.",
            "PG 12/34 - Consenso dell'Assicurato alla stipula dell'Assicurazione sulla propria vita.",
            "PG 34/34 - Firma del Contraente.",
          ],
        } as ESign,
        {
          key: "esign_contraente_sepa",
          whoESign: "contractor",
          chapters: [
            "PG 11/34 - Firma del Contraente per l'addebito diretto SEPA - S.D.D.",
          ],
        } as ESign,
        ...((lipType !== "self-insured"
          ? [
              {
                key: "esign_assicurato",
                whoESign: "insured",
                chapters: [
                  "PG 5/34 - Questionario Anamnestico.",
                  "PG 7/34 - Accettazione del sistema di autenticazione tramite OTP.",
                  "PG 11/34 - Dichiarazioni rese dall'Assicurato in relazione al proprio stato di salute e abitudini di vita.",
                  "PG 12/34 - Dichiarazioni del Contraente e dell'Assicurato.",
                  "PG 12/34 - Consenso dell'Assicurato alla stipula dell'Assicurazione sulla propria vita.",
                  "PG 34/34 - Firma dell'Assicurato.",
                ],
              },
            ]
          : []) as ESign[]),
      ],
    },
  ] as const satisfies Document[];

const eSignsCount = (
  documentESigns: ESign[],
  lipESigns: Record<string, {esign_id: number; data: string}>,
  filter?: string,
): [ESign[], ESign[]] => {
  let filteredESigns = documentESigns.map((eSign, index) => ({
    ...eSign,
    eSignIndex: index,
    signed: !!lipESigns[eSign.key]?.esign_id,
    date: lipESigns[eSign.key]?.data,
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

interface DocumentsManagementProps {
  lip: LipWithDen;
}
export function DocumentsManagement({lip}: DocumentsManagementProps) {
  const [chapterModalOpen, setChapterModalOpen] =
    useState<`${"advisor" | "contractor" | "insured"}-${(typeof documents)[number]["fileName"]}`>();
  const {closeModal} = useDrawerModal();

  if (!isPaymentValid(lip)) {
    return null;
  }

  const documents = createDocuments(lip.type, lip.documents);

  const allAdvisorESigns = documents.every((document) => {
    const [partialAdvisorESign, totalAdvisorESign] = eSignsCount(
      document.eSigns,
      lip.eSigns?.[document.key] ?? {},
      "advisor",
    );

    return partialAdvisorESign.length === totalAdvisorESign.length;
  });
  const allContractorESigns = documents.every((document) => {
    const [partialContractorESign, totalContractorESign] = eSignsCount(
      document.eSigns,
      lip.eSigns?.[document.key] ?? {},
      "contractor",
    );

    return partialContractorESign.length === totalContractorESign.length;
  });

  // TODO: Ripensare all'auto-chiusura
  /*
  const [partialESign, totalESign] = documents.reduce(
    ([prevPartial, prevTotal], document) => {
      const [partialESign, totalESign] = eSignsCount(
        document.eSigns,
        lip.eSigns?.[document.key] ?? {},
      );

      return [prevPartial.concat(partialESign), prevTotal.concat(totalESign)];
    },
    [[], []] as [ESign[], ESign[]],
  );
  */

  // const lastESign = partialESign.length === totalESign.length - 1;

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
          const [partialInsuredESign, totalInsuredESign] = eSignsCount(
            document.eSigns,
            lip.eSigns?.[document.key] ?? {},
            "insured",
          );

          return (
            <Card key={document.fileName}>
              <CardHeader className={styles.documentHeader}>
                <strong>{document.fileName}</strong>
                {partialAdvisorESign.length === totalAdvisorESign.length &&
                partialContractorESign.length ===
                  totalContractorESign.length ? (
                  <DownloadDocumentButton
                    className="ms-sm-auto"
                    uri={document.urlDownload}
                    lipId={lip.id}
                    agentId={lip.agent.id}
                    contractorId={lip.contractor.id}
                    size="sm"
                  >
                    Scarica il documento firmato
                  </DownloadDocumentButton>
                ) : (
                  <DownloadDocumentButton
                    className="ms-sm-auto"
                    uri={document.urlPreview}
                    lipId={lip.id}
                    agentId={lip.agent.id}
                    contractorId={lip.contractor.id}
                    size="sm"
                    icon={faEye}
                  >
                    Visualizza anteprima del documento
                  </DownloadDocumentButton>
                )}
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
                          Firma del Consulente
                        </Button>
                        <DocumentsChapterDetails
                          eSigns={totalAdvisorESign}
                          show={
                            chapterModalOpen === `advisor-${document.fileName}`
                          }
                          document={document}
                          lip={lip}
                          onHide={() => {
                            setChapterModalOpen(undefined);
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
                              Firma del Contraente
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
                                setChapterModalOpen(undefined);
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
                {lip.type !== "self-insured" && (
                  <>
                    <div>
                      <strong>Firme Assicurato:</strong>
                      <span className="d-block d-sm-none">
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
                          {allAdvisorESigns ? (
                            allContractorESigns ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setChapterModalOpen(
                                      `insured-${document.fileName}`,
                                    );
                                  }}
                                  disabled={totalInsuredESign.every(
                                    (eSign) => eSign.signed,
                                  )}
                                >
                                  <FontAwesomeIcon
                                    icon={faFileSignature}
                                    className="me-2"
                                  />
                                  Firma dell'Assicurato
                                </Button>
                                <DocumentsChapterDetails
                                  eSigns={totalInsuredESign}
                                  show={
                                    chapterModalOpen ===
                                    `insured-${document.fileName}`
                                  }
                                  document={document}
                                  lip={lip}
                                  onHide={() => {
                                    setChapterModalOpen(undefined);
                                  }}
                                />
                              </>
                            ) : (
                              <>In attesa delle firme del Contraente</>
                            )
                          ) : (
                            <>In attesa delle firme del Consulente</>
                          )}
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
      </ModalBody>
      <ModalFooter>
        <Button type="button" variant="cancel" onClick={() => closeModal()}>
          <FontAwesomeIcon icon={faXmark} className="me-2" />
          Annulla
        </Button>
        <Button type="submit" variant="primary" onClick={() => closeModal()}>
          <FontAwesomeIcon icon={faSave} className="me-2" />
          Salva e concludi
        </Button>
      </ModalFooter>
    </>
  );
}
