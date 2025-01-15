import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {
  getCoverageDuration,
  type ComplementaryCoverage,
} from "@/app/(menu)/(authenticated)/lipsDrawers/quote/ComplementaryCoverages";
import {Currency} from "@/ui/Currency";
import {faCheck, faXmark} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Card} from "react-bootstrap";

interface CoverageProps {
  complementaryCoverage: ComplementaryCoverage;
  enabled: boolean;
}

export function Coverage({complementaryCoverage, enabled}: CoverageProps) {
  const quoteData = useStore((state) => state.lip?.quotation);
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
