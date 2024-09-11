"use client";

import {IdImage} from "@/app/(menu)/(authenticated)/lipsDrawers/identification/IdImage";
import {idTypeOptions} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {dateString} from "@/helpers/dates";
import {getOptionsLabel} from "@/helpers/getOptionsLabel";
import {
  faAddressCard,
  faClipboardListCheck,
  faSquareCheck,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Col, Row} from "react-bootstrap";

export function IdentificationDataSummary() {
  const agentId = useDrawerStore((state) => state.lip?.agent.id);
  const contractorId = useDrawerStore((state) => state.lip?.contractor.id);
  const identification = useDrawerStore((state) =>
    state.lip?.contractor.identitydocument?.at(-1),
  );

  if (!identification) {
    return null;
  }

  return (
    <Row className="row-gap-3">
      <Col xs={12} sm={6} md={12} lg={6}>
        <h4 className="text-primary">
          <FontAwesomeIcon icon={faAddressCard} className="me-2" />
          Documento di identità
        </h4>
        <p className="mb-0">
          <strong>Documento:</strong>{" "}
          {getOptionsLabel(idTypeOptions, identification.idType)}
        </p>
        <p className="mb-0">
          <strong>Numero documento:</strong> {identification.number}
        </p>
        <p className="mb-0">
          <strong>Rilasciato da:</strong> {identification.issuedByOrg}
        </p>
        <p className="mb-0">
          <strong>Luogo di rilascio:</strong> {identification.issuedBy}
        </p>
        <p className="mb-0">
          <strong>In data:</strong> {dateString(identification.issuedDate)}
        </p>
        <p className="mb-0">
          <strong>Scadenza:</strong> {dateString(identification.expiringDate)}
        </p>
      </Col>
      <Col xs={6} sm={3} md={6} lg={3}>
        <div className="ratio ratio-4x3 p-3">
          {agentId &&
            contractorId &&
            identification.identification?.fileIdFrontName && (
              <IdImage
                agentId={agentId}
                contractorId={contractorId}
                filename={identification.identification?.fileIdFrontName}
              />
            )}
        </div>
      </Col>
      <Col xs={6} sm={3} md={6} lg={3}>
        <div className="ratio ratio-4x3 p-3">
          {agentId &&
            contractorId &&
            identification.identification?.fileIdBackName && (
              <IdImage
                agentId={agentId}
                contractorId={contractorId}
                filename={identification.identification?.fileIdBackName}
              />
            )}
        </div>
      </Col>
      <Col xs={12}>
        <h4 className="text-primary">
          <FontAwesomeIcon icon={faClipboardListCheck} className="me-2" />
          L'Agente dichiara:
        </h4>
        <p className="mb-0">
          <FontAwesomeIcon icon={faSquareCheck} className="me-2" />
          Di aver incontrato il Contraente di persona
        </p>
        <p className="mb-0">
          <FontAwesomeIcon icon={faSquareCheck} className="me-2" />
          Che il documento è la copia di quello mostrato dal Contraente
        </p>
        <p className="mb-0">
          <FontAwesomeIcon icon={faSquareCheck} className="me-2" />
          Che la fotografia è del Contraente
        </p>
        <p className="mb-0">
          <FontAwesomeIcon icon={faSquareCheck} className="me-2" />
          Di aver identificato il Contraente
        </p>
      </Col>
    </Row>
  );
}
