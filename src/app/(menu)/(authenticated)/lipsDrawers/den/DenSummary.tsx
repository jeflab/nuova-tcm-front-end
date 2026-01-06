"use client";

import {getLipQuery} from "@/app/(menu)/(authenticated)/lips/[id]/queries";
import {
  isDenValid,
  validateDenDuration,
  validateDenExpectation,
} from "@/app/(menu)/(authenticated)/lipsDrawers/den/denValidators";
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
import {validateLipIdOrNotFound} from "@/app/(menu)/(authenticated)/lipsDrawers/validateLipIdOrNotFound";
import {getOptionsLabel} from "@/helpers/getOptionsLabel";
import {isLip} from "@/models/entities/lip";
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
import {useSuspenseQuery} from "@tanstack/react-query";
import {useParams} from "next/navigation";
import {Col, Row} from "react-bootstrap";

export function DenSummary() {
  const lipId = validateLipIdOrNotFound(useParams<{id: string}>().id) as number;
  const {
    data: {lip},
  } = useSuspenseQuery(getLipQuery(lipId));

  if (!isLip(lip)) {
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

  if (!isDenValid(lip)) {
    return null;
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
          {lip.den.education.response === "other"
            ? lip.den.educationOther
            : getOptionsLabel(educationOptions, lip.den.education.response)}
        </p>
        <p className="mb-0">
          <strong>Occupazione:</strong>{" "}
          {lip.contractor.pep.job.position.response === "other"
            ? lip.contractor.pep.job.positionOther
            : getOptionsLabel(
                jobPositionOptions,
                lip.contractor.pep.job.position.response,
              )}
        </p>
        <p className="mb-0">
          <strong>
            Numero di componenti del nucleo familiare oltre al Contraente:
          </strong>{" "}
          {getOptionsLabel(familyOptions, lip.den.family.response)} di cui{" "}
          {getOptionsLabel(
            dependentFamilyMembersOptions,
            lip.den.dependentFamilyMembers.response,
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
          {lip.den.otherInsuranceProducts.response === "yes" ? (
            lip.den.needsIntendToMeet.response.map((value) => (
              <li key={value} className="d-flex">
                <FontAwesomeIcon icon={faSquareCheck} className="me-2 mt-1" />
                {value === "other"
                  ? lip.den.needsIntendToMeetOther
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
          <Currency>{lip.den.income}</Currency>
        </p>
        <p className="mb-0">
          <strong>Capacità di risparmio media mensile:</strong>{" "}
          <Currency>{lip.den.savings}</Currency>
        </p>
        <p className="mb-0">
          <strong>Andamento della condizione economica:</strong>{" "}
          {getOptionsLabel(
            economicConditionOptions,
            lip.den.economicCondition.response,
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
          {lip.den.fundSource !== "other"
            ? getOptionsLabel(fundSourceOptions, lip.den.fundSource)
            : lip.den.fundSourceOther}
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
              lip.den.expectations.response,
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
          {getOptionsLabel(durationOptions, lip.den.duration.response)}
        </p>
      </Col>
    </Row>
  );
}
