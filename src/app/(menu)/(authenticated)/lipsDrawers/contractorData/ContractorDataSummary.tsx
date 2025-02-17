"use client";

import {
  genderOptions,
  jobPositionOptions,
  publicOfficesOptions,
  tAECodeOptions,
  yesNoOptions,
} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
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
  const contractor = useStore((state) => state.lip?.contractor);

  if (!contractor?.pep) {
    return null;
  }

  return (
    <Row className="row-gap-4">
      <Col xs={12} sm={6} md={12} lg={6}>
        <h4 className="w-100 text-primary">
          <FontAwesomeIcon icon={faUser} /> Anagrafica
        </h4>
        <p className="mb-0">
          {contractor.name} {contractor.surname}, nato il{" "}
          {dateString(contractor.birthDate)} a {contractor.birthPlace} (
          {contractor.birthProvince})
        </p>
        <p>
          Residente in {contractor.address} {contractor.streetNumber},{" "}
          {contractor.zipCode} {contractor.city} ({contractor.region})
        </p>
        <p className="mb-0">
          <strong>Nazionalità:</strong>{" "}
          <span>{contractor.citizenshipInstance?.citizenship}</span>
        </p>
        {contractor.secondCitizenship && (
          <p className="mb-0">
            <strong>Seconda Nazionalità:</strong>{" "}
            <span>{contractor.secondCitizenshipInstance?.citizenship}</span>
          </p>
        )}
        <p className="mb-0">
          <strong>Genere:</strong>{" "}
          {getOptionsLabel(genderOptions, contractor.gender)}
        </p>
        <p className="mb-0">
          <strong>Codice Fiscale:</strong> {contractor.fiscalCode}
        </p>
      </Col>
      <Col xs={12} sm={6} md={12} lg={6}>
        <h4 className="w-100 text-primary">
          <FontAwesomeIcon icon={faAddressBook} /> Contatti
        </h4>
        <p className="mb-0">
          <strong>Telefono:</strong>{" "}
          <a href={`tel:${contractor.phone}`}>{contractor.phone}</a>
        </p>
        <p className="mb-0">
          <strong>E-Mail:</strong>{" "}
          <a href={`mailto:${contractor.email}`}>{contractor.email}</a>
        </p>
      </Col>
      <Col xs={12} xl={6}>
        <h4 className="w-100 text-primary">
          <FontAwesomeIcon icon={faBriefcase} /> Situazione professionale
        </h4>
        <p className="mb-0">
          <strong>Attività esercitata:</strong>{" "}
          {contractor.pep.job.position.response !== "other"
            ? getOptionsLabel(
                jobPositionOptions,
                contractor.pep.job.position.response,
              )
            : contractor.pep.job.positionOther}
        </p>
        {contractor.pep.job.tAECode?.response && (
          <p className="mb-0">
            <strong>Codice TAE attività:</strong>{" "}
            {getOptionsLabel(
              tAECodeOptions,
              contractor.pep.job.tAECode.response,
            )}{" "}
            (codice: {contractor.pep.job.tAECode.response})
          </p>
        )}
        {contractor.pep.job.type && (
          <p className="mb-0">
            <strong>Tipologia di lavoro svolto:</strong>{" "}
            {contractor.pep.job.type}
          </p>
        )}
        <p className="mb-0">
          <strong>Provincia attività prevalente:</strong>{" "}
          {contractor.pep.job.province || contractor.region}
        </p>
        <p className="mb-0">
          <strong>Paese attività prevalente:</strong>{" "}
          {contractor.pep.job.country || "Italia"}
        </p>
      </Col>
      <Col xs={12} xl={6}>
        <h4 className="w-100 text-primary">
          <FontAwesomeIcon icon={faLandmarkMagnifyingGlass} /> Persona esposta
          politicamente
        </h4>
        <p className="mb-0">
          <strong>Il Contraente è una persona esposta politicamente:</strong>{" "}
          {getOptionsLabel(yesNoOptions, contractor.pep.isPep.response)}
        </p>
        <p className="mb-0">
          <strong>
            Il Contraente Ricopre cariche pubbliche diverse da P.E.P.:
          </strong>{" "}
          {getOptionsLabel(
            publicOfficesOptions,
            contractor.pep.publicOffice.response,
          )}
        </p>
        <p className="mb-0">
          <strong>
            È stato qualificato come P.E.P. nell’ambito di altri rapporti
            contrattuali stipulati con altri soggetti destinatari del Decreto
            231/2007 negli ultimi 2 anni:
          </strong>{" "}
          {getOptionsLabel(yesNoOptions, contractor.pep.otherPep.response)}
        </p>
      </Col>
    </Row>
  );
}
