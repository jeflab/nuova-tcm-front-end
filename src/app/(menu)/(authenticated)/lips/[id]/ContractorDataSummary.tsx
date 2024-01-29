"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {
  faAddressBook,
  faLandmarkMagnifyingGlass,
  faUser,
  faWashingMachine,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Col, Row} from "react-bootstrap";

export function ContractorDataSummary() {
  const contractorData = useDrawerStore(
    (state) => state.lipData.contractorData,
  );

  if (!contractorData) {
    return null;
  }

  const {contractorPersonalData, contact, residence, pep, aml} = contractorData;

  return (
    <Row className="row-gap-4" xs={1} md={2}>
      <Col>
        <h4 className="w-100 text-primary">
          <FontAwesomeIcon icon={faUser} /> Anagrafica
        </h4>
        <p className="mb-0">
          {contractorPersonalData.name} {contractorPersonalData.surname}, nato
          il {contractorPersonalData.birthDate} a{" "}
          {contractorPersonalData.birthDate}
        </p>
        <p>
          Residente in {residence.streetName} {residence.streetNumber},{" "}
          {residence.zipCode} {residence.place.city} ({residence.place.province}
          )
        </p>
        <p className="mb-0">
          <strong>Genere:</strong> {contractorPersonalData.gender}
        </p>
        <p className="mb-0">
          <strong>Codice Fiscale:</strong> {contractorPersonalData.fiscalCode}
        </p>
      </Col>
      <Col>
        <h4 className="w-100 text-primary">
          <FontAwesomeIcon icon={faAddressBook} /> Contatti
        </h4>
        <p className="mb-0">
          <strong>Telefono:</strong> {contact.phone}
        </p>
        <p className="mb-0">
          <strong>Email:</strong> {contact.email}
        </p>
      </Col>
      <Col>
        <h4 className="w-100 text-primary">
          <FontAwesomeIcon icon={faLandmarkMagnifyingGlass} /> Persona esposta
          politicamente
        </h4>
        {pep.isPep === "yes" ? (
          <>
            <p className="mb-0">
              Il contraente è una persona esposta politicamente:
            </p>
            <p className="mb-0">
              <strong>Persona:</strong> {pep.person}
            </p>
            <p className="mb-0">
              <strong>Rapporto:</strong> {pep.relation}
            </p>
          </>
        ) : (
          <p className="mb-0">
            Il contraente non è una persona esposta politicamente
          </p>
        )}
      </Col>
      <Col>
        <h4 className="w-100 text-primary">
          <FontAwesomeIcon icon={faWashingMachine} /> Antiriciclaggio
        </h4>
        <p className="mb-0">
          <strong>Professione:</strong> {aml.job}
        </p>
        <p className="mb-0">
          <strong>Settore:</strong> {aml.sector}
        </p>
        <p className="mb-0">
          <strong>Reddito netto:</strong> {aml.netIncome}
        </p>
        <p className="mb-0">
          <strong>Fonte del reddito:</strong> {aml.fundSource}
        </p>
      </Col>
    </Row>
  );
}
