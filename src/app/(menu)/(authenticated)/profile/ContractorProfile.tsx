import {genderOptions} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {dateString} from "@/helpers/dates";
import {getOptionsLabel} from "@/helpers/getOptionsLabel";
import {PersonalData} from "@/models/entities/personalData";
import {Card, Col, Row} from "react-bootstrap";

interface ContractorProfileProps {
  contractor: PersonalData;
}

export function ContractorProfile({contractor}: ContractorProfileProps) {
  return (
    <>
      <h3>Cliente</h3>
      <Card body>
        <Row as="dl" xs={3} className="mb-0">
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
      </Card>
    </>
  );
}
