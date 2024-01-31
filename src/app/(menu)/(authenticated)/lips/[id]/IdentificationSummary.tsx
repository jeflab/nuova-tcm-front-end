"use client";

import {getTypeLabel} from "@/app/(menu)/(authenticated)/lips/[id]/IdentificationForm";
import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {dateString} from "@/helpers/dates";
import {
  faAddressCard,
  faClipboardListCheck,
  faSquareCheck,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Col, Row} from "react-bootstrap";

export function IdentificationDataSummary() {
  const identification = useDrawerStore(
    (state) => state.lipData.identification,
  );
  const idPictures = useDrawerStore((state) => state.lipData.idPictures);

  if (!identification) {
    return null;
  }

  return (
    <Row className="row-gap-3">
      <Col xs={12} sm={6}>
        <h4 className="text-primary">
          <FontAwesomeIcon icon={faAddressCard} className="me-2" />
          Documento di identità
        </h4>
        <p className="mb-0">
          <strong>Documento:</strong> {getTypeLabel(identification.idType)}
        </p>
        <p className="mb-0">
          <strong>Numero documento:</strong> {identification.number}
        </p>
        <p className="mb-0">
          <strong>Rilasciato da:</strong> {identification.issuedBy}
        </p>
        <p className="mb-0">
          <strong>In data:</strong>{" "}
          {dateString(new Date(identification.issuedDate))}
        </p>
        <p className="mb-0">
          <strong>Scadenza:</strong>{" "}
          {dateString(new Date(identification.expiringDate))}
        </p>
      </Col>
      <Col xs={12} sm={3}>
        <div className="ratio ratio-1x1">
          <div
            className="bg-primary-subtle d-flex justify-content-center align-items-md-center"
            style={{
              backgroundImage: `url(${idPictures?.frontPictureUrl})`,
              borderRadius: "0.5rem",
              padding: "1rem",
              backgroundOrigin: "content-box",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
            }}
          ></div>
        </div>
      </Col>
      <Col xs={12} sm={3}>
        <div className="ratio ratio-1x1">
          <div
            className="bg-primary-subtle d-flex justify-content-center align-items-md-center"
            style={{
              backgroundImage: `url(${idPictures?.backPictureUrl})`,
              borderRadius: "0.5rem",
              padding: "1rem",
              backgroundOrigin: "content-box",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
            }}
          ></div>
        </div>
      </Col>
      <Col xs={12}>
        <h4 className="text-primary">
          <FontAwesomeIcon icon={faClipboardListCheck} className="me-2" />
          Il contraente dichiara:
        </h4>
        <p className="mb-0">
          <FontAwesomeIcon icon={faSquareCheck} className="me-2" />
          Di aver incontrato il contraente di persona
        </p>
        <p className="mb-0">
          <FontAwesomeIcon icon={faSquareCheck} className="me-2" />
          Che il documento è la copia di quello mostrato dal contraente
        </p>
        <p className="mb-0">
          <FontAwesomeIcon icon={faSquareCheck} className="me-2" />
          Che la fotografia è del contraente
        </p>
        <p className="mb-0">
          <FontAwesomeIcon icon={faSquareCheck} className="me-2" />
          Di aver identificato il contraente
        </p>
      </Col>
    </Row>
  );
}
