"use client";

import {isInsuredDataValid} from "@/app/(menu)/(authenticated)/lipsDrawers/insuredData/insuredDataValidators";
import {
  genderOptions,
  insuredRelationshipOptions,
} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {useSuspenseLip} from "@/app/(menu)/(authenticated)/lipsDrawers/useSuspenseLip";
import {dateString} from "@/helpers/dates";
import {getOptionsLabel} from "@/helpers/getOptionsLabel";
import {
  faAddressBook,
  faBriefcase,
  faUser,
  faUserGroup,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Col, Row} from "react-bootstrap";

export function InsuredDataSummary() {
  const {
    data: {lip},
  } = useSuspenseLip();

  if (!isInsuredDataValid(lip)) {
    return null;
  }

  return (
    <Row className="row-gap-4">
      <Col xs={12} sm={6} md={12} lg={6}>
        <h4 className="w-100 text-primary">
          <FontAwesomeIcon icon={faUser} /> Anagrafica
        </h4>
        <p className="mb-0">
          {lip.insured.name} {lip.insured.surname}, nato il{" "}
          {dateString(lip.insured.birthDate)} a {lip.insured.birthPlace} (
          {lip.insured.birthProvince})
        </p>
        <p>
          Residente in {lip.insured.address} {lip.insured.streetNumber},{" "}
          {lip.insured.zipCode} {lip.insured.city} ({lip.insured.region})
        </p>
        <p className="mb-0">
          <strong>Nazionalità:</strong>{" "}
          <span>{lip.insured.citizenshipInstance?.citizenship}</span>
        </p>
        {lip.insured.secondCitizenship && (
          <p className="mb-0">
            <strong>Seconda Nazionalità:</strong>{" "}
            <span>{lip.insured.secondCitizenshipInstance?.citizenship}</span>
          </p>
        )}
        <p className="mb-0">
          <strong>Genere:</strong>{" "}
          {getOptionsLabel(genderOptions, lip.insured.gender)}
        </p>
        <p className="mb-0">
          <strong>Codice Fiscale:</strong> {lip.insured.fiscalCode}
        </p>
      </Col>
      <Col xs={12} sm={6} md={12} lg={6}>
        <h4 className="w-100 text-primary">
          <FontAwesomeIcon icon={faAddressBook} /> Contatti
        </h4>
        <p className="mb-0">
          <strong>Telefono:</strong>{" "}
          <a href={`tel:${lip.insured.phone}`}>{lip.insured.phone}</a>
        </p>
        <p className="mb-0">
          <strong>E-Mail:</strong>{" "}
          <a href={`mailto:${lip.insured.email}`}>{lip.insured.email}</a>
        </p>
      </Col>
      <Col xs={12} sm={6} md={12} lg={6}>
        <h4 className="w-100 text-primary">
          <FontAwesomeIcon icon={faUserGroup} /> Rapporto con il Contraente
        </h4>
        <p className="mb-0">
          <strong>Rapporto con il Contraente:</strong>{" "}
          {lip.contractorInsuredRelationship === "other"
            ? lip.contractorInsuredRelationshipOther
            : getOptionsLabel(
                insuredRelationshipOptions,
                lip.contractorInsuredRelationship ?? "ad",
              )}
        </p>
      </Col>
      <Col xs={12} sm={6} md={12} lg={6}>
        <h4 className="w-100 text-primary">
          <FontAwesomeIcon icon={faBriefcase} /> Situazione professionale
        </h4>
        <p className="mb-0">
          <strong>Attività esercitata:</strong>{" "}
          {lip.insured.pep?.job.positionOther}
        </p>
      </Col>
    </Row>
  );
}
