import {getLipQuery} from "@/app/(menu)/(authenticated)/lips/[id]/queries";
import {complementaryCoverages} from "@/app/(menu)/(authenticated)/lipsDrawers/quote/ComplementaryCoverages";
import {Coverage} from "@/app/(menu)/(authenticated)/lipsDrawers/quote/Coverage";
import {isQuoteValid} from "@/app/(menu)/(authenticated)/lipsDrawers/quote/quoteValidators";
import {validateLipIdOrNotFound} from "@/app/(menu)/(authenticated)/lipsDrawers/validateLipIdOrNotFound";
import {Lip, Underwriting} from "@/models/entities/lip";
import {useSuspenseQuery} from "@tanstack/react-query";
import {useParams} from "next/navigation";
import {Col, Row} from "react-bootstrap";

interface ExclusionListProps {
  exclusions: Underwriting["exclusions"];
}

export function getExcludedCoverages(
  exclusions: Underwriting["exclusions"],
  quoteData: Lip["quotation"],
) {
  if (!quoteData) {
    return [];
  }

  return Object.values(complementaryCoverages)
    .filter(({key}) => {
      const coverage = quoteData[key];
      return typeof coverage === "boolean" ? coverage : coverage.enabled;
    })
    .filter(({key}) => {
      const exclusion = exclusions.find((exclusion) => exclusion.name === key);
      return exclusion?.decline;
    });
}

export function ExclusionList({exclusions}: ExclusionListProps) {
  const lipId = validateLipIdOrNotFound(useParams<{id: string}>().id) as number;
  const {
    data: {lip},
  } = useSuspenseQuery(getLipQuery(lipId));

  if (!isQuoteValid(lip)) {
    return null;
  }

  const filteredExcludedCoverages = getExcludedCoverages(
    exclusions,
    lip.quotation,
  );

  const exclusionsJsx = filteredExcludedCoverages.map((exclusion) => (
    <Col key={exclusion.key}>
      <Coverage
        complementaryCoverage={exclusion}
        enabled={false}
        quoteData={lip.quotation}
      />
    </Col>
  ));

  if (exclusionsJsx.length === 0) {
    return null;
  }

  return (
    <Row xs={1} sm={2} md={1} lg={2} className="row-gap-3 d-flex">
      {exclusionsJsx}
    </Row>
  );
}
