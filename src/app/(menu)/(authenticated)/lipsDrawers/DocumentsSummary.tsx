"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {PDFType} from "@/entities/esign";
import {apiUrl} from "@/services/const";
import {ButtonLink} from "@/ui/ButtonLink";
import {faCheckCircle, faDownload} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Fragment} from "react";
import {Badge, Button, Card, CardHeader, Stack} from "react-bootstrap";
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

export function DocumentsSummary() {
  const lip = useDrawerStore((state) => state.lip);

  if (!lip) {
    return null;
  }

  const allESigns = documents.every((document) => {
    const [partialESign, totalESign] = eSignsCount(
      document.eSigns,
      document.key === "identificazione"
        ? lip.eSigns?.identificazione
          ? {onlyOne: lip.eSigns.identificazione}
          : {}
        : lip.eSigns?.polizza ?? {},
    );

    return partialESign.length === totalESign.length;
  });

  if (!allESigns) {
    return null;
  }

  return (
    <Stack gap={3}>
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
              <Button
                as="a"
                size="sm"
                download
                className="ms-sm-auto"
                href={`${process.env.NEXT_PUBLIC_API_URL}/${document.urlDownload}/?lipId=${lip.id}&agentId=${lip.agent.id}&contractorId=${lip.contractor.id}`}
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
      {/*<ButtonLink*/}
      {/*  href={`${apiUrl}/${lipId}/pdf-allegato4?lipId=${lipId}&agentId=${agentId}`}*/}
      {/*  download*/}
      {/*>*/}
      {/*  <FontAwesomeIcon icon={faDownload} /> Allegato 4*/}
      {/*</ButtonLink>*/}
      {/*<ButtonLink*/}
      {/*  href={`${apiUrl}/${lipId}/set-informativo?lipId=${lipId}&agentId=${agentId}`}*/}
      {/*  download*/}
      {/*>*/}
      {/*  <FontAwesomeIcon icon={faDownload} /> Set informativo*/}
      {/*</ButtonLink>*/}
    </Stack>
  );
}
