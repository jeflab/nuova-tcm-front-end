"use client";

import {isContractorDataValid} from "@/app/(menu)/(authenticated)/lipsDrawers/contractorData/contractorDataValidators";
import {
  genderOptions,
  jobPositionOptions,
  publicOfficesOptions,
  tAECodeOptions,
  yesNoOptions,
} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {useSuspenseLip} from "@/app/(menu)/(authenticated)/lipsDrawers/useSuspenseLip";
import {dateString} from "@/helpers/dates";
import {getOptionsLabel} from "@/helpers/getOptionsLabel";
import {
  faAddressBook,
  faBriefcase,
  faLandmarkMagnifyingGlass,
  faUser,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Col, Row} from "react-bootstrap";

export function ContractorDataSummary() {
  const {
    data: {lip},
  } = useSuspenseLip();

  if (!isContractorDataValid(lip)) {
    return null;
  }

  return (
    <Row className="row-gap-4">
      <Col xs={12} sm={6} md={12} lg={6}>
        <h4 className="w-100 text-primary">
          <FontAwesomeIcon icon={faUser} /> Anagrafica
        </h4>
        <p className="mb-0">
          {lip.contractor.name} {lip.contractor.surname}, nato il{" "}
          {dateString(lip.contractor.birthDate)} a {lip.contractor.birthPlace} (
          {lip.contractor.birthProvince})
        </p>
        <p>
          Residente in {lip.contractor.address} {lip.contractor.streetNumber},{" "}
          {lip.contractor.zipCode} {lip.contractor.city} (
          {lip.contractor.region})
        </p>
        <p className="mb-0">
          <strong>Nazionalità:</strong>{" "}
          <span>{lip.contractor.citizenshipInstance?.citizenship}</span>
        </p>
        {lip.contractor.secondCitizenship && (
          <p className="mb-0">
            <strong>Seconda Nazionalità:</strong>{" "}
            <span>{lip.contractor.secondCitizenshipInstance?.citizenship}</span>
          </p>
        )}
        <p className="mb-0">
          <strong>Genere:</strong>{" "}
          {getOptionsLabel(genderOptions, lip.contractor.gender)}
        </p>
        <p className="mb-0">
          <strong>Codice Fiscale:</strong> {lip.contractor.fiscalCode}
        </p>
      </Col>
      <Col xs={12} sm={6} md={12} lg={6}>
        <h4 className="w-100 text-primary">
          <FontAwesomeIcon icon={faAddressBook} /> Contatti
        </h4>
        <p className="mb-0">
          <strong>Telefono:</strong>{" "}
          <a href={`tel:${lip.contractor.phone}`}>{lip.contractor.phone}</a>
        </p>
        <p className="mb-0">
          <strong>E-Mail:</strong>{" "}
          <a href={`mailto:${lip.contractor.email}`}>{lip.contractor.email}</a>
        </p>
      </Col>
      <Col xs={12} xl={6}>
        <h4 className="w-100 text-primary">
          <FontAwesomeIcon icon={faBriefcase} /> Situazione professionale
        </h4>
        <p className="mb-0">
          <strong>Attività esercitata:</strong>{" "}
          {lip.contractor.pep.job.position.response !== "other"
            ? getOptionsLabel(
                jobPositionOptions,
                lip.contractor.pep.job.position.response,
              )
            : lip.contractor.pep.job.positionOther}
        </p>
        {lip.contractor.pep.job.tAECode?.response && (
          <p className="mb-0">
            <strong>Codice TAE attività:</strong>{" "}
            {getOptionsLabel(
              tAECodeOptions,
              lip.contractor.pep.job.tAECode.response,
            )}{" "}
            (codice: {lip.contractor.pep.job.tAECode.response})
          </p>
        )}
        {lip.contractor.pep.job.type && (
          <p className="mb-0">
            <strong>Tipologia di lavoro svolto:</strong>{" "}
            {lip.contractor.pep.job.type}
          </p>
        )}
        <p className="mb-0">
          <strong>Provincia attività prevalente:</strong>{" "}
          {lip.contractor.pep.job.province || lip.contractor.region}
        </p>
        <p className="mb-0">
          <strong>Paese attività prevalente:</strong>{" "}
          {lip.contractor.pep.job.country || "Italia"}
        </p>
      </Col>
      <Col xs={12} xl={6}>
        <h4 className="w-100 text-primary">
          <FontAwesomeIcon icon={faLandmarkMagnifyingGlass} /> Persona esposta
          politicamente
        </h4>
        <p className="mb-0">
          <strong>Il Contraente è una persona esposta politicamente:</strong>{" "}
          {getOptionsLabel(yesNoOptions, lip.contractor.pep.isPep.response)}
        </p>
        <p className="mb-0">
          <strong>
            Il Contraente Ricopre cariche pubbliche diverse da P.E.P.:
          </strong>{" "}
          {getOptionsLabel(
            publicOfficesOptions,
            lip.contractor.pep.publicOffice.response,
          )}
        </p>
        <p className="mb-0">
          <strong>
            È stato qualificato come P.E.P. nell’ambito di altri rapporti
            contrattuali stipulati con altri soggetti destinatari del Decreto
            231/2007 negli ultimi 2 anni:
          </strong>{" "}
          {getOptionsLabel(yesNoOptions, lip.contractor.pep.otherPep.response)}
        </p>
      </Col>
    </Row>
  );
}
