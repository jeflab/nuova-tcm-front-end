import {genderOptions} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {dateString} from "@/helpers/dates";
import {getOptionsLabel} from "@/helpers/getOptionsLabel";
import {Contractor} from "@/models/entities/personalData";
import {Card, CardBody, CardHeader, Col, Row} from "react-bootstrap";

interface ContractorProfileProps {
  contractor: Contractor;
}

export function ContractorProfile({contractor}: ContractorProfileProps) {
  return (
    <Card>
      <CardHeader>Contraente</CardHeader>
      <CardBody>
        <Row as="dl" xs={1} sm={3} className="mb-0">
          <Col>
            <dt>Nome:</dt>
            <dd>{contractor.name}</dd>
          </Col>
          <Col>
            <dt>Cognome:</dt>
            <dd>{contractor.surname}</dd>
          </Col>
          <Col>
            <dt>Data di nascita:</dt>
            <dd>{dateString(contractor.birthDate)}</dd>
          </Col>
          <Col>
            <dt>Luogo di nascita:</dt>
            <dd>
              {contractor.birthPlace} ({contractor.birthProvince})
            </dd>
          </Col>
          <Col>
            <dt>Codice fiscale:</dt>
            <dd>{contractor.fiscalCode}</dd>
          </Col>
          <Col>
            <dt>Genere:</dt>
            <dd>{getOptionsLabel(genderOptions, contractor.gender)}</dd>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}
