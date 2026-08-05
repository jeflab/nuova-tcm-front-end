"use client";

import {getLipQuery} from "@/app/(menu)/(authenticated)/lips/[id]/queries";
import {isInsuredIdentificationValid} from "@/app/(menu)/(authenticated)/lipsDrawers/insuredIdentification/insuredIdentificationValidators";
import {idTypeOptions} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {validateLipIdOrNotFound} from "@/app/(menu)/(authenticated)/lipsDrawers/validateLipIdOrNotFound";
import {dateString} from "@/helpers/dates";
import {getOptionsLabel} from "@/helpers/getOptionsLabel";
import {getValidIdentityDocument} from "@/models/entities/personalData";
import {DownloadDocumentButton} from "@/ui/DownloadDocumentButton";
import {IdImage} from "@/ui/IdImage";
import {
  faAddressCard,
  faClipboardListCheck,
  faHouseCircleCheck,
  faSquareCheck,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useSuspenseQuery} from "@tanstack/react-query";
import {useParams} from "next/navigation";
import {Col, Row} from "react-bootstrap";

export function InsuredIdentificationSummary() {
  const lipId = validateLipIdOrNotFound(useParams<{id: string}>().id) as number;
  const {
    data: {lip},
  } = useSuspenseQuery(getLipQuery(lipId));

  if (!isInsuredIdentificationValid(lip)) {
    return null;
  }

  const identityDocument = getValidIdentityDocument(lip.insured);

  return (
    <Row className="row-gap-3">
      <Col xs={12} sm={6} md={12} lg={6}>
        <h4 className="text-primary">
          <FontAwesomeIcon icon={faAddressCard} className="me-2" />
          Documento di identità
        </h4>
        <p className="mb-0">
          <strong>Documento:</strong>{" "}
          {getOptionsLabel(idTypeOptions, identityDocument.idType)}
        </p>
        <p className="mb-0">
          <strong>Numero documento:</strong> {identityDocument.number}
        </p>
        <p className="mb-0">
          <strong>Rilasciato da:</strong> {identityDocument.issuedByOrg}
        </p>
        <p className="mb-0">
          <strong>Luogo di rilascio:</strong> {identityDocument.issuedBy}
        </p>
        <p className="mb-0">
          <strong>In data:</strong> {dateString(identityDocument.issuedDate)}
        </p>
        <p className="mb-0">
          <strong>Scadenza:</strong> {dateString(identityDocument.expiringDate)}
        </p>
      </Col>
      <Col xs={6} sm={3} md={6} lg={3}>
        <div className="ratio ratio-4x3 p-3">
          {identityDocument.identification?.fileIdFrontName && (
            <IdImage
              agentId={lip.agent.id}
              personalDataId={lip.insured.id}
              filename={identityDocument.identification?.fileIdFrontName}
            />
          )}
        </div>
      </Col>
      <Col xs={6} sm={3} md={6} lg={3}>
        <div className="ratio ratio-4x3 p-3">
          {identityDocument.identification?.fileIdBackName && (
            <IdImage
              agentId={lip.agent.id}
              personalDataId={lip.insured.id}
              filename={identityDocument.identification?.fileIdBackName}
            />
          )}
        </div>
      </Col>
      {identityDocument.identification?.fileResidenceProofName && (
        <Col xs={12}>
          <h4 className="text-primary">
            <FontAwesomeIcon icon={faHouseCircleCheck} className="me-2" />{" "}
            Conferma residenza
          </h4>
          <p>È stato caricato un documento che attesta la residenza:</p>
          <p className="mb-0">
            <DownloadDocumentButton
              uri="pdf-residence-proof-assicurato"
              lipId={lip.id}
              agentId={lip.agent.id}
            >
              Scarica conferma residenza
            </DownloadDocumentButton>
          </p>
        </Col>
      )}
      {lip.salesMode === "remote" &&
        !identityDocument.identification?.fileResidenceProofName && (
          <Col xs={12}>
            <h4 className="text-primary">
              <FontAwesomeIcon icon={faHouseCircleCheck} className="me-2" />{" "}
              Conferma residenza
            </h4>
            <p className="mb-0">
              <FontAwesomeIcon icon={faSquareCheck} className="me-2" />
              L'Intermediario dichiara che l documento a conferma della
              residenza verrà fornito successivamente
            </p>
          </Col>
        )}
      <Col xs={12}>
        <h4 className="text-primary">
          <FontAwesomeIcon icon={faClipboardListCheck} className="me-2" />
          L'Agente dichiara:
        </h4>
        <p className="mb-0">
          <FontAwesomeIcon icon={faSquareCheck} className="me-2" />
          {lip.salesMode === "remote"
            ? "Di aver identificato l'Assicurato a distanza"
            : "Di aver incontrato l'Assicurato di persona"}
        </p>
        <p className="mb-0">
          <FontAwesomeIcon icon={faSquareCheck} className="me-2" />
          Che il documento è la copia di quello mostrato dall'Assicurato
        </p>
        <p className="mb-0">
          <FontAwesomeIcon icon={faSquareCheck} className="me-2" />
          Che la fotografia è dell'Assicurato
        </p>
        <p className="mb-0">
          <FontAwesomeIcon icon={faSquareCheck} className="me-2" />
          Di aver identificato l'Assicurato
        </p>
      </Col>
    </Row>
  );
}
