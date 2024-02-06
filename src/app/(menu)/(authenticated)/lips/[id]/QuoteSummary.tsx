"use client";

import {Advantages} from "@/app/(menu)/quoter/Advantages";
import {getCoverageDuration} from "@/app/(menu)/quoter/helpers";
import {calendarYearAge} from "@/helpers/ages";
import {dateString} from "@/helpers/dates";
import {Currency} from "@/ui/Currency";
import {
  faCheck,
  faPiggyBank,
  faShield,
  faShieldPlus,
  faUser,
} from "@fortawesome/pro-duotone-svg-icons";
import {faDollar} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Card, Col, Row} from "react-bootstrap";
import {useDrawerStore} from "./store";

const complementaryCoverages = [
  {
    key: "accidentalDeath",
    label: "Morte accidentale",
    maxDuration: 30,
    maxAge: 85,
  },
  {
    key: "trafficAccidentalDeath",
    label: "Morte per incidente stradale",
    maxDuration: 30,
    maxAge: 85,
  },
  {
    key: "exemptionFromPaying",
    label: "Esenzione dal pagamento dei premi",
    maxDuration: 30,
    maxAge: 65,
  },
  {
    key: "tpi",
    label: "Invalidità permanente da infortunio o malattia",
    maxDuration: 30,
    maxAge: 65,
  },
  {key: "cancer", label: "Cancro", maxDuration: 10, maxAge: 85},
  {
    key: "tpd",
    label: "Perdita totale di autosufficienza",
    maxDuration: 30,
    maxAge: 85,
  },
] as const;

export function QuoteSummary() {
  const quoteData = useDrawerStore((state) => state.lipData.quote);

  if (!quoteData) {
    return null;
  }

  const filteredComplementaryCoverages = complementaryCoverages.filter(
    ({key}) => {
      const coverage = quoteData[key];
      return typeof coverage === "boolean" ? coverage : coverage.enabled;
    },
  );

  return (
    <Row className="row-gap-3">
      <Col xs={12} sm={6} md={12} lg={6}>
        <h4 className="text-primary">
          <FontAwesomeIcon icon={faUser} /> Dati Contraente
        </h4>
        <p className="mb-0">
          <strong>Data di nascita:</strong> {dateString(quoteData.birthDate)}
        </p>
        <p className="mb-0">
          <strong>Età assicurativa:</strong>{" "}
          {calendarYearAge(quoteData.birthDate)}
        </p>
        <p className="mb-0">
          <strong>Fumatore:</strong> {quoteData.smoker === "yes" ? "Si" : "No"}
        </p>
      </Col>
      <Col xs={12} sm={6} md={12} lg={6}>
        <h4 className="text-primary">
          <span className="fa-stack small">
            <FontAwesomeIcon icon={faShield} className="fa-stack-2x" />
            <FontAwesomeIcon icon={faDollar} className="fa-stack-1x" />
          </span>{" "}
          Coperture assicurative
        </h4>
        <h5>
          <FontAwesomeIcon icon={faCheck} className="text-success" /> Caso morte
        </h5>
        <p className="mb-0">
          <strong>Capitale assicurato:</strong>{" "}
          <Currency>{quoteData.death}</Currency>
        </p>
        <p className="mb-0">
          <strong>Durata:</strong> {getCoverageDuration(quoteData.birthDate)}{" "}
          anni
        </p>
      </Col>
      <Col xs={12}>
        <h4 className="text-primary">
          <FontAwesomeIcon icon={faPiggyBank} /> Vantaggi assicurativi
        </h4>
        <Advantages
          premium={quoteData.premium ?? 0}
          duration={getCoverageDuration(quoteData.birthDate)}
          showTitle={false}
        />
      </Col>
      <Col>
        <h4 className="text-primary">
          <FontAwesomeIcon icon={faShieldPlus} /> Coperture complementari
        </h4>
        {filteredComplementaryCoverages.length > 0 ? (
          <Row xs={1} sm={2} md={1} lg={2} className="row-gap-3 d-flex">
            {filteredComplementaryCoverages.map(
              ({key, label, maxDuration, maxAge}) => {
                const coverage = quoteData[key];
                if (typeof coverage === "boolean") {
                  if (!coverage) {
                    return null;
                  }

                  return (
                    <Col key={key}>
                      <Card body className="h-100">
                        <h5>
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="text-success"
                          />{" "}
                          {label}
                        </h5>
                        <p className="mb-0">
                          {key === "accidentalDeath" ? (
                            <>
                              <strong>Capitale assicurato:</strong>{" "}
                              <Currency>
                                {parseInt(quoteData.death, 10) * 2}
                              </Currency>
                            </>
                          ) : key === "trafficAccidentalDeath" ? (
                            <>
                              <strong>Capitale assicurato:</strong>{" "}
                              <Currency>
                                {parseInt(quoteData.death, 10) * 3}
                              </Currency>
                            </>
                          ) : (
                            <strong>Attiva</strong>
                          )}
                        </p>
                        <p className="mb-0">
                          <strong>Durata:</strong>{" "}
                          {getCoverageDuration(
                            quoteData.birthDate,
                            maxDuration,
                            maxAge,
                          )}{" "}
                          anni
                        </p>
                      </Card>
                    </Col>
                  );
                } else {
                  if (!coverage.enabled) {
                    return null;
                  }

                  return (
                    <Col key={key}>
                      <Card body className="h-100">
                        <h5>
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="text-success"
                          />{" "}
                          {label}
                        </h5>
                        <p className="mb-0">
                          <strong>Capitale assicurato:</strong>{" "}
                          <Currency>{coverage.coverage}</Currency>
                        </p>
                        <p className="mb-0">
                          <strong>Durata:</strong>{" "}
                          {getCoverageDuration(
                            quoteData.birthDate,
                            maxDuration,
                            maxAge,
                          )}{" "}
                          anni
                        </p>
                      </Card>
                    </Col>
                  );
                }
              },
            )}
          </Row>
        ) : (
          <p className="mb-0">Nessuna copertura complementare selezionata</p>
        )}
      </Col>
    </Row>
  );
}
