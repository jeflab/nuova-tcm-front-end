import {complementaryCoverages} from "@/app/(menu)/(authenticated)/lipsDrawers/quote/ComplementaryCoverages";
import {Coverage} from "@/app/(menu)/(authenticated)/lipsDrawers/quote/Coverage";
import {Lip, Underwriting} from "@/models/entities/lip";
import {Col, Row} from "react-bootstrap";
import {useStore} from "../../lips/[id]/store";

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

  return complementaryCoverages
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
  const quoteData = useStore((state) => state.lip?.quotation);
  if (!quoteData) {
    return null;
  }

  const filteredExcludedCoverages = getExcludedCoverages(exclusions, quoteData);

  const exclusionsJsx = filteredExcludedCoverages.map((exclusion) => (
    <Col key={exclusion.key}>
      <Coverage complementaryCoverage={exclusion} enabled={false} />
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
