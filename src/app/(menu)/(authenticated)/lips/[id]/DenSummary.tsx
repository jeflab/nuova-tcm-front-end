"use client";

import {
  dependentFamilyMembersOptions,
  durationOptions,
  economicConditionOptions,
  educationOptions,
  expectationsOptions,
  familyOptions,
  jobOptions,
  needsToMeetOptions,
} from "@/app/(menu)/(authenticated)/lips/[id]/DenForm";
import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {getOptionsLabel} from "@/helpers/getOptionsLabel";
import {Currency} from "@/ui/Currency";
import {
  faCalendarClock,
  faClipboardListCheck,
  faFamily,
  faSackDollar,
  faShieldCheck,
  faShieldHeart,
  faSquareCheck,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Col, Row} from "react-bootstrap";

export function DenSummary() {
  const denData = useDrawerStore((state) => state.lipData.den);

  if (!denData) {
    return null;
  }

  if (denData.duration !== "multi_year") {
    return (
      <p className="mb-0">
        Non è possibile continuare la consulenza poiché le aspettative del
        contraente in merito alla durata del contratto non sono coerenti con la
        durata del prodotto.
      </p>
    );
  }

  if (
    !(
      [
        "capital_for_heirs",
        "protection_against_death_accident_and_illness",
      ] as const
    ).some((value) => denData.expectations.includes(value))
  ) {
    return (
      <p className="mb-0">
        Non è possibile continuare la consulenza poiché le aspettative del
        contraente non sono coerenti con le caratteristiche del prodotto.
      </p>
    );
  }

  return (
    <Row className="row-gap-4">
      <Col xs={12} sm={4} md={12} lg={4}>
        <h4 className="text-primary">
          <FontAwesomeIcon icon={faFamily} className="me-2" />
          Situazione personale e familiare
        </h4>
        <p className="mb-0">
          <strong>Titolo di studio:</strong>{" "}
          {getOptionsLabel(educationOptions, denData.education)}
        </p>
        <p className="mb-0">
          <strong>Occupazione:</strong>{" "}
          {getOptionsLabel(jobOptions, denData.job)}
        </p>
        <p className="mb-0">
          <strong>
            Numero di componenti del nucleo familiare oltre al contraente:
          </strong>{" "}
          {getOptionsLabel(familyOptions, denData.family)} di cui{" "}
          {getOptionsLabel(
            dependentFamilyMembersOptions,
            denData.dependentFamilyMembers,
          )}{" "}
          a carico
        </p>
      </Col>
      <Col xs={12} sm={4} md={12} lg={4}>
        <h4 className="text-primary">
          <FontAwesomeIcon icon={faShieldCheck} className="me-2" />
          Situazione assicurativa attuale
        </h4>
        <p className="mb-0">
          <strong>Prodotti assicurativi in essere:</strong>
        </p>
        <ul className="list-unstyled">
          {denData.otherInsuranceProducts === "yes"
            ? denData.needsIntendToMeet.map((value) => (
                <li key={value} className="d-flex">
                  <FontAwesomeIcon icon={faSquareCheck} className="me-2 mt-1" />
                  {getOptionsLabel(needsToMeetOptions, value)}
                </li>
              ))
            : "Nessuno"}
        </ul>
      </Col>
      <Col xs={12} sm={4} md={12} lg={4}>
        <h4 className="text-primary">
          <FontAwesomeIcon icon={faSackDollar} className="me-2" />
          Situazione finanziaria
        </h4>
        <p className="mb-0">
          <strong>Capacità di risparmio media annua:</strong>{" "}
          <Currency>{denData.savings}</Currency>
        </p>
        <p className="mb-0">
          <strong>Andamento della condizione economica:</strong>{" "}
          {getOptionsLabel(economicConditionOptions, denData.economicCondition)}
        </p>
      </Col>
      <Col xs={12} sm={8} md={12} lg={8}>
        <h4 className="text-primary">
          <FontAwesomeIcon icon={faShieldHeart} className="me-2" />
          Aspettative
        </h4>
        <p className="mb-0">
          <strong>
            Aspettative in relazione al contratto di assicurazione:
          </strong>
        </p>
        <ul className="list-unstyled">
          {denData.expectations.map((value) => (
            <li key={value} className="d-flex">
              <FontAwesomeIcon icon={faSquareCheck} className="me-2 mt-1" />
              {getOptionsLabel(expectationsOptions, value)}
            </li>
          ))}
        </ul>
      </Col>
      <Col xs={12} sm={4} md={12} lg={4}>
        <h4 className="text-primary">
          <FontAwesomeIcon icon={faCalendarClock} className="me-2" />
          Aspettative in merito alla durata del contratto
        </h4>
        <p className="mb-0">
          <strong>
            Il contraente ha bisogno di coperture per un periodo di tempo:
          </strong>{" "}
          {getOptionsLabel(durationOptions, denData.duration)}
        </p>
      </Col>
      <Col xs={12}>
        <h4 className="text-primary">
          <FontAwesomeIcon icon={faClipboardListCheck} className="me-2" />
          Dichiarazione di coerenza con le richieste ed esigenze del cliente
        </h4>
        <p className="mb-0">
          <strong>
            L'intermediario dichiara che, in base alle informazioni fornite dal
            contraente e alla valutazione delle sue richieste ed esigenze, in
            maniera chiara e comprensibile:
          </strong>
        </p>
        <ul className="list-unstyled">
          <li className="d-flex">
            <FontAwesomeIcon icon={faSquareCheck} className="me-2 mt-1" />
            Ha fornito al Cliente informazioni oggettive sul contratto,
            illustrandone le caratteristiche, la durata, i costi, i limiti della
            copertura ed ogni altro elemento utile a consentirgli di prendere
            una decisione informata.
          </li>
          <li className="d-flex">
            <FontAwesomeIcon icon={faSquareCheck} className="me-2 mt-1" />
            il contratto offerto risulta coerente con le richieste ed esigenze
            del Cliente.
          </li>
        </ul>
      </Col>
    </Row>
  );
}
