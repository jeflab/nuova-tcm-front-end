"use client";

import {
  complementaryCoverages,
  getCoverageDuration,
} from "@/app/(menu)/(authenticated)/lipsDrawers/quote/ComplementaryCoverages";
import {Coverage} from "@/app/(menu)/(authenticated)/lipsDrawers/quote/Coverage";
import {isQuoteValid} from "@/app/(menu)/(authenticated)/lipsDrawers/quote/quoteValidators";
import {useSuspenseLip} from "@/app/(menu)/(authenticated)/lipsDrawers/useSuspenseLip";
import {calendarYearAge} from "@/helpers/ages";
import {dateString} from "@/helpers/dates";
import {Currency} from "@/ui/Currency";
import {IconStack} from "@/ui/IconStack";
import {
  faCheck,
  faDollar as faDollarDuotone,
  faShield,
  faShieldPlus,
  faUser,
} from "@fortawesome/pro-duotone-svg-icons";
import {faDollar} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Alert, Col, Row} from "react-bootstrap";

export function QuoteSummary() {
  const {
    data: {lip},
  } = useSuspenseLip();

  if (!isQuoteValid(lip)) {
    return null;
  }

  const filteredComplementaryCoverages = Object.values(
    complementaryCoverages,
  ).filter(({key}) => {
    const coverage = lip.quotation[key];
    return typeof coverage === "boolean" ? coverage : coverage.enabled;
  });

  return (
    <Row className="row-gap-3">
      <Col xs={12} sm={6} md={12} lg={6}>
        <h4 className="text-primary">
          <FontAwesomeIcon icon={faUser} /> Dati Assicurato
        </h4>
        <p className="mb-0">
          <strong>Data di nascita:</strong>{" "}
          {dateString(lip.quotation.birthDate)}
        </p>
        <p className="mb-0">
          <strong>Età assicurativa:</strong>{" "}
          {calendarYearAge(lip.quotation.birthDate)}
        </p>
        <p className="mb-0">
          <strong>Fumatore:</strong>{" "}
          {lip.quotation.smoker === "yes" ? "Si" : "No"}
        </p>
      </Col>
      <Col xs={12} sm={6} md={12} lg={6}>
        <h4 className="text-primary">
          <IconStack>
            <FontAwesomeIcon icon={faShield} className="fa-stack-2x" />
            <FontAwesomeIcon icon={faDollar} className="fa-stack-1x" />
          </IconStack>{" "}
          Coperture assicurative
        </h4>
        <h5>
          <FontAwesomeIcon icon={faCheck} className="text-success" /> Caso morte
        </h5>
        <p className="mb-0">
          <strong>Capitale assicurato:</strong>{" "}
          <Currency>{lip.quotation.death}</Currency>
        </p>
        <p className="mb-0">
          <strong>Durata:</strong>{" "}
          {getCoverageDuration("death", lip.quotation.birthDate)} anni
        </p>
      </Col>
      {calendarYearAge(lip.quotation.birthDate) > 65 && (
        <Col xs={12}>
          <Alert variant="warning" className="mb-0">
            In virtù dell'età assicurativa dell'Assicurato maggiore di 65 anni,
            la proposta di Polizza sarà soggetta ad ulteriori approfondimenti.
          </Alert>
        </Col>
      )}
      <Col>
        <h4 className="text-primary">
          <FontAwesomeIcon icon={faShieldPlus} /> Coperture complementari
        </h4>
        {filteredComplementaryCoverages.length > 0 ? (
          <Row xs={1} sm={2} md={1} lg={2} className="row-gap-3 d-flex">
            {filteredComplementaryCoverages.map((complementaryCoverage) => {
              return (
                <Col key={complementaryCoverage.key}>
                  <Coverage
                    complementaryCoverage={complementaryCoverage}
                    enabled={true}
                    quoteData={lip.quotation}
                  />
                </Col>
              );
            })}
          </Row>
        ) : (
          <p className="mb-0">Nessuna copertura complementare selezionata</p>
        )}
      </Col>
      <Col xs={12} className="w-100">
        <h4 className="text-primary">
          <FontAwesomeIcon icon={faDollarDuotone} /> Premio annuo
        </h4>
        Premio annuo: <Currency>{lip.quotation.premium}</Currency>
      </Col>
    </Row>
  );
}
