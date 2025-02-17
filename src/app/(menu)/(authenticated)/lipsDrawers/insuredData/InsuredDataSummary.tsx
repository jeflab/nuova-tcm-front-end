"use client";

import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {
  genderOptions,
  insuredRelationshipOptions,
} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {dateString} from "@/helpers/dates";
import {getOptionsLabel} from "@/helpers/getOptionsLabel";
import {
  faAddressBook,
  faUser,
  faUserGroup,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Col, Row} from "react-bootstrap";

export function InsuredDataSummary() {
  const lip = useStore((state) => state.lip);
  const insured = lip?.insured;

  if (!insured || !lip) {
    return null;
  }

  return (
    <Row className="row-gap-4">
      <Col xs={12} sm={6} md={12} lg={6}>
        <h4 className="w-100 text-primary">
          <FontAwesomeIcon icon={faUser} /> Anagrafica
        </h4>
        <p className="mb-0">
          {insured.name} {insured.surname}, nato il{" "}
          {dateString(insured.birthDate)} a {insured.birthPlace} (
          {insured.birthProvince})
        </p>
        <p>
          Residente in {insured.address} {insured.streetNumber},{" "}
          {insured.zipCode} {insured.city} ({insured.region})
        </p>
        <p className="mb-0">
          <strong>Nazionalità:</strong>{" "}
          <span>{insured.citizenshipInstance?.citizenship}</span>
        </p>
        {insured.secondCitizenship && (
          <p className="mb-0">
            <strong>Seconda Nazionalità:</strong>{" "}
            <span>{insured.secondCitizenshipInstance?.citizenship}</span>
          </p>
        )}
        <p className="mb-0">
          <strong>Genere:</strong>{" "}
          {getOptionsLabel(genderOptions, insured.gender)}
        </p>
        <p className="mb-0">
          <strong>Codice Fiscale:</strong> {insured.fiscalCode}
        </p>
      </Col>
      <Col xs={12} sm={6} md={12} lg={6}>
        <h4 className="w-100 text-primary">
          <FontAwesomeIcon icon={faAddressBook} /> Contatti
        </h4>
        <p className="mb-0">
          <strong>Telefono:</strong>{" "}
          <a href={`tel:${insured.phone}`}>{insured.phone}</a>
        </p>
        <p className="mb-0">
          <strong>E-Mail:</strong>{" "}
          <a href={`mailto:${insured.email}`}>{insured.email}</a>
        </p>
      </Col>
      <Col xs={12}>
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
    </Row>
  );
}
