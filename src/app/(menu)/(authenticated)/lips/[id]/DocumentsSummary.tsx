"use client";

import styles from "@/app/(menu)/(authenticated)/lips/[id]/DocumentsManagement.module.scss";
import {ESignsManagementModal} from "@/app/(menu)/(authenticated)/lips/[id]/DocumentsManagement/ESignsManagementModal";
import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {FileEsign} from "@/entities/document";
import {
  faCheckCircle,
  faDownload,
  faEye,
  faFileCheck,
  faFileContract,
  faFileSignature,
  faUser,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Button, Card, CardHeader, Stack} from "react-bootstrap";

const eSignsCount = (eSigns: FileEsign[], filter?: string) => {
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

export function DocumentsSummary() {
  const documentationData = useDrawerStore(
    (state) => state.lipData.documentation,
  );

  if (!documentationData) {
    return null;
  }

  return (
    <Stack gap={3}>
      <h4 className="w-100 text-primary">
        <FontAwesomeIcon icon={faFileContract} /> Documentazione
      </h4>
      {documentationData.files.map((document) => {
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
              <strong>
                <FontAwesomeIcon icon={faFileCheck} /> {document.fileName}
              </strong>
              <span>{document.requiredFile && "(Obbligatorio)"}</span>
              {document.allRequiredEsigned ? (
                <Button
                  as="a"
                  size="sm"
                  download
                  className="ms-sm-auto"
                  href={`${process.env.API_URL}proposals/${"TODO"}/download-file-esign?fileName=${document.fileName}`}
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
                  href={`${process.env.API_URL}proposals/${"TODO"}/download-file?fileName=${document.fileName}`}
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
