import {dateString} from "@/helpers/dates";
import {Agent} from "@/models/entities/agent";
import {Card, CardBody, CardHeader, Col, Row} from "react-bootstrap";

interface AgentProfileProps {
  agent: Agent;
}

export function AgentProfile({agent}: AgentProfileProps) {
  return (
    <Card>
      <CardHeader>Agente</CardHeader>
      <CardBody>
        <Row as="dl" xs={1} sm={3} className="mb-0">
          <Col>
            <dt>Nome:</dt>
            <dd>{agent.name}</dd>
          </Col>
          <Col>
            <dt>Cognome:</dt>
            <dd>{agent.surname}</dd>
          </Col>
          <Col>
            <dt>Indirizzo:</dt>
            <dd>{agent.address}</dd>
          </Col>
          <Col>
            <dt>Numero civico:</dt>
            <dd>{agent?.streetNumber || "n.d."}</dd>
          </Col>
          <Col>
            <dt>Città:</dt>
            <dd>{agent.city}</dd>
          </Col>
          <Col>
            <dt>Codice postale:</dt>
            <dd>{agent.zipCode}</dd>
          </Col>
          <Col>
            <dt>Regione:</dt>
            <dd>{agent.region}</dd>
          </Col>
          <Col>
            <dt>Codice RUI:</dt>
            <dd>{agent.ruiCode}</dd>
          </Col>
          <Col>
            <dt>Data RUI:</dt>
            <dd>{dateString(agent.ruiDate)}</dd>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}
