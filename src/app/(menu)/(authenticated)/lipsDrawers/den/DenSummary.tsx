"use client";

import {
  dependentFamilyMembersOptions,
  durationOptions,
  economicConditionOptions,
  educationOptions,
  expectationsOptions,
  familyOptions,
  fundSourceOptions,
  jobPositionOptions,
  needsToMeetOptions,
} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {getOptionsLabel} from "@/helpers/getOptionsLabel";
import {
  validateDenDuration,
  validateDenExpectation,
} from "@/helpers/lip-validator";
import {Currency} from "@/ui/Currency";
import {
  faCalendarClock,
  faFamily,
  faHandHoldingDollar,
  faSackDollar,
  faShieldCheck,
  faShieldHeart,
  faSquareCheck,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Col, Row} from "react-bootstrap";

export function DenSummary() {
  const lip = useDrawerStore((state) => state.lip);
  const denData = useDrawerStore((state) => state.lip?.den);
  const job = useDrawerStore((state) => state.lip?.contractor.pep?.job);

  if (!denData) {
    return null;
  }

  if (!validateDenDuration(lip?.den)) {
    return (
      <p className="mb-0">
        Non è possibile continuare la consulenza poiché le aspettative del
        Contraente in merito alla durata del contratto non sono coerenti con la
        durata del prodotto.
      </p>
    );
  }

  if (!validateDenExpectation(lip?.den)) {
    return (
      <p className="mb-0">
        Non è possibile continuare la consulenza poiché le aspettative del
        Contraente non sono coerenti con le caratteristiche del prodotto.
      </p>
    );
  }

  return (
    <Row className="row-gap-4">
      <Col xs={12} sm={6} md={12} lg={6}>
        <h4 className="text-primary">
          <FontAwesomeIcon icon={faFamily} className="me-2" />
          Situazione personale e familiare
        </h4>
        <p className="mb-0">
          <strong>Titolo di studio:</strong>{" "}
          {denData.education.response === "other"
            ? denData.educationOther
            : getOptionsLabel(educationOptions, denData.education.response)}
        </p>
        <p className="mb-0">
          <strong>Occupazione:</strong>{" "}
          {job
            ? job.position.response === "other"
              ? job?.positionOther
              : getOptionsLabel(jobPositionOptions, job.position.response)
            : ""}
        </p>
        <p className="mb-0">
          <strong>
            Numero di componenti del nucleo familiare oltre al Contraente:
          </strong>{" "}
          {getOptionsLabel(familyOptions, denData.family.response)} di cui{" "}
          {getOptionsLabel(
            dependentFamilyMembersOptions,
            denData.dependentFamilyMembers.response,
          )}{" "}
          a carico
        </p>
      </Col>
      <Col xs={12} sm={6} md={12} lg={6}>
        <h4 className="text-primary">
          <FontAwesomeIcon icon={faShieldCheck} className="me-2" />
          Situazione assicurativa attuale
        </h4>
        <p className="mb-0">
          <strong>Prodotti assicurativi in essere:</strong>
        </p>
        <ul className="list-unstyled mb-0">
          {denData.otherInsuranceProducts.response === "yes" ? (
            denData.needsIntendToMeet.response.map((value) => (
              <li key={value} className="d-flex">
                <FontAwesomeIcon icon={faSquareCheck} className="me-2 mt-1" />
                {value === "other"
                  ? denData.needsIntendToMeetOther
                  : getOptionsLabel(needsToMeetOptions, value)}
              </li>
            ))
          ) : (
            <li>Nessuno</li>
          )}
        </ul>
      </Col>
      <Col xs={12} sm={6} md={12} lg={6}>
        <h4 className="text-primary">
          <FontAwesomeIcon icon={faSackDollar} className="me-2" />
          Situazione finanziaria
        </h4>
        <p className="mb-0">
          <strong>Reddito medio annuale netto:</strong>{" "}
          <Currency>{denData.income}</Currency>
        </p>
        <p className="mb-0">
          <strong>Capacità di risparmio media mensile:</strong>{" "}
          <Currency>{denData.savings}</Currency>
        </p>
        <p className="mb-0">
          <strong>Andamento della condizione economica:</strong>{" "}
          {getOptionsLabel(
            economicConditionOptions,
            denData.economicCondition.response,
          )}
        </p>
      </Col>
      <Col xs={12} sm={6} md={12} lg={6}>
        <h4 className="w-100 text-primary">
          <FontAwesomeIcon icon={faHandHoldingDollar} /> Origine prevalente dei
          fondi
        </h4>
        <p className="mb-0">
          <strong>Origine prevalente dei fondi:</strong>{" "}
          {denData.fundSource !== "other"
            ? getOptionsLabel(fundSourceOptions, denData.fundSource)
            : denData.fundSourceOther}
        </p>
      </Col>
      <Col xs={12} sm={6} md={12} lg={6}>
        <h4 className="text-primary">
          <FontAwesomeIcon icon={faShieldHeart} className="me-2" />
          Aspettative
        </h4>
        <p className="mb-0">
          <strong>
            Aspettative in relazione al contratto di assicurazione:
          </strong>
        </p>
        <ul className="list-unstyled mb-0">
          <li className="d-flex">
            <FontAwesomeIcon icon={faSquareCheck} className="me-2 mt-1" />
            {getOptionsLabel(
              expectationsOptions,
              denData.expectations.response,
            )}
          </li>
        </ul>
      </Col>
      <Col xs={12} sm={6} md={12} lg={6}>
        <h4 className="text-primary">
          <FontAwesomeIcon icon={faCalendarClock} className="me-2" />
          Aspettative in merito alla durata del contratto
        </h4>
        <p className="mb-0">
          <strong>
            Il Contraente ha bisogno di coperture per un periodo di tempo:
          </strong>{" "}
          {getOptionsLabel(durationOptions, denData.duration.response)}
        </p>
      </Col>
    </Row>
  );
}
