"use client";

import {cns} from "@/helpers/cns";
import {dateString} from "@/helpers/dates";
import {Lip} from "@/models/entities/lip";
import {Contractor, Insured} from "@/models/entities/personalData";
import {ButtonLink} from "@/ui/ButtonLink";
import {CardCollapsable} from "@/ui/CardCollapsable";
import {DownloadDocumentButton} from "@/ui/DownloadDocumentButton";
import {LipStateBadge, LipStateBadgeSkeleton} from "@/ui/LipStateBadge";
import dataTableStyles from "@/ui/table/DataTable.module.scss";
import responsiveStyles from "@/ui/table/ResponsiveTable.module.scss";
import {faEye} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Alert, Button, Placeholder, Stack, Table} from "react-bootstrap";

interface PolicyProps {
  lip: Lip;
  insured?: Insured | null;
  contractor: Contractor;
}

export function Policy({lip, insured, contractor}: PolicyProps) {
  return (
    <CardCollapsable
      header={
        <Stack direction="horizontal" gap={3}>
          <div className="flex-grow-1">
            <p className="mb-0">
              <strong>Proposta di Polizza n°:</strong> {lip.lipNumber}
            </p>
            <p className="mb-0">
              <strong>Stato proposta:</strong>{" "}
              <LipStateBadge lipState={lip.lipState} />
            </p>
            <p className="mb-0">
              <strong>Creata il:</strong> {dateString(lip.createdAt)}
            </p>
            <p className="mb-0">
              <strong>Agente:</strong> {lip.agent.name} {lip.agent.surname}
            </p>
          </div>
          <div>
            <ButtonLink
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
              }}
              href={`/contractorLips/${lip.id}`}
            >
              <FontAwesomeIcon icon={faEye} className="me-2" />
              Dettagli
            </ButtonLink>
          </div>
        </Stack>
      }
    >
      <div className="vstack gap-2">
        <p className="mb-0">
          <strong>Creata il:</strong> {dateString(lip.createdAt)}
        </p>
        {lip.type === "self-insured" ? (
          <p className="mb-0">
            <strong>Contraente / Assicurato:</strong> {contractor.name}{" "}
            {contractor.surname}
          </p>
        ) : (
          <>
            <p className="mb-0">
              <strong>Contraente:</strong> {contractor.name}{" "}
              {contractor.surname}
            </p>
            <p className="mb-0">
              <strong>Assicurato:</strong> {insured?.name} {insured?.surname}
            </p>
          </>
        )}
        <p className="mb-0">
          <strong>Agente:</strong> {lip.agent.name} {lip.agent.surname}
        </p>
        <hr />
        <div>
          <h4>Documenti di rendicontazione</h4>
          {lip.documents?.fileDUR ? (
            <Table
              size="sm"
              hover
              className={cns(
                responsiveStyles.responsiveTableWrapper,
                "mb-0 align-middle",
              )}
            >
              <thead>
                <tr>
                  <th>Anno di riferimento</th>
                  <th>Data di emissione</th>
                  <th style={{width: "1px"}}>Download</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(lip.documents.fileDUR)
                  .reverse()
                  .map(([year, file]) => (
                    <tr
                      key={year}
                      className={dataTableStyles.rowStopStretching}
                    >
                      <td data-label="Anno di riferimento">
                        {parseInt(year, 10) - 1}
                      </td>
                      <td data-label="Data di emissione">
                        {dateString(file.date)}
                      </td>
                      <td>
                        <DownloadDocumentButton
                          uri="pdf-dur"
                          year={year}
                          lipId={lip.id}
                          size="sm"
                          className={cns(
                            "w-100 text-nowrap",
                            dataTableStyles.rowDefaultLink,
                          )}
                        >
                          Download PDF
                        </DownloadDocumentButton>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          ) : (
            <Alert className="mb-0" variant="info">
              Al momento non ci sono Documenti di rendicontazione per questa
              proposta. Non appena saranno disponibili, verranno visualizzati
              qui.
            </Alert>
          )}
        </div>
      </div>
    </CardCollapsable>
  );
}

export function PolicySkeleton() {
  return (
    <CardCollapsable
      disabled
      header={
        <Stack direction="horizontal" gap={3}>
          <Placeholder as="div" className="flex-grow-1" animation="glow">
            <p className="mb-0">
              <Placeholder style={{width: "165px"}}></Placeholder>{" "}
              <Placeholder style={{width: "100px"}}></Placeholder>
            </p>
            <p className="mb-0">
              <Placeholder style={{width: "115px"}}></Placeholder>{" "}
              <LipStateBadgeSkeleton />
            </p>
            <p className="mb-0">
              <Placeholder style={{width: "70px"}}></Placeholder>{" "}
              <Placeholder style={{width: "120px"}}></Placeholder>
            </p>
            <p className="mb-0">
              <Placeholder style={{width: "60px"}}></Placeholder>{" "}
              <Placeholder style={{width: "130px"}}></Placeholder>
            </p>
          </Placeholder>
          <Placeholder as="div" animation="glow">
            <Button variant="primary" disabled className="disabled placeholder">
              <FontAwesomeIcon icon={faEye} className="me-2" />
              Dettagli
            </Button>
          </Placeholder>
        </Stack>
      }
    />
  );
}
