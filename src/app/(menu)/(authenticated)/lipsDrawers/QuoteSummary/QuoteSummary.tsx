"use client";

import {complementaryCoverages} from "@/app/(menu)/(authenticated)/lipsDrawers/ComplementaryCoverages";
import {Coverage} from "@/app/(menu)/(authenticated)/lipsDrawers/QuoteSummary/Coverage";
import {getCoverageDuration} from "@/app/(menu)/(authenticated)/quoter/helpers";
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
import {Col, Row} from "react-bootstrap";
import {useDrawerStore} from "../../lips/[id]/store";

export function QuoteSummary() {
  const quoteData = useDrawerStore((state) => state.lip?.quotation);

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
          <Currency>{quoteData.death}</Currency>
        </p>
        <p className="mb-0">
          <strong>Durata:</strong> {getCoverageDuration(quoteData.birthDate)}{" "}
          anni
        </p>
      </Col>
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
        Premio annuo: <Currency>{quoteData.premium}</Currency>
      </Col>
    </Row>
  );
}
