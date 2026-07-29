import {
  type ComplementaryCoverage,
  getCoverageDuration,
} from "@/app/(menu)/(authenticated)/lipsDrawers/quote/ComplementaryCoverages";
import {LipWithQuotation} from "@/app/(menu)/(authenticated)/lipsDrawers/quote/quoteValidators";
import {Currency} from "@/ui/Currency";
import {faCheck, faXmark} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Card} from "react-bootstrap";

interface CoverageProps {
  complementaryCoverage: ComplementaryCoverage;
  enabled: boolean;
  quoteData: LipWithQuotation["quotation"];
}

export function Coverage({
  complementaryCoverage,
  enabled,
  quoteData,
}: CoverageProps) {
  const coverageData = quoteData?.[complementaryCoverage.key];

  if (!coverageData) {
    return null;
  }

  const value =
    complementaryCoverage.key === "accidentalDeath"
      ? quoteData.death * 2
      : complementaryCoverage.key === "trafficAccidentalDeath"
        ? quoteData.death * 3
        : typeof coverageData !== "boolean"
          ? coverageData.coverage
          : undefined;

  const duration = getCoverageDuration(
    complementaryCoverage.key,
    quoteData.birthDate,
  );

  return (
    <Card body className="h-100">
      <h5>
        {enabled ? (
          <FontAwesomeIcon icon={faCheck} className="text-success" />
        ) : (
          <FontAwesomeIcon icon={faXmark} className="text-danger" />
        )}{" "}
        {complementaryCoverage.label}
      </h5>
      <p className="mb-0">
        <strong>{complementaryCoverage.valueLabel}</strong>
        {value && (
          <>
            <strong>:</strong> <Currency>{value}</Currency>
          </>
        )}
      </p>
      <p className="mb-0">
        <strong>Durata:</strong> {duration} anni
      </p>
    </Card>
  );
}
