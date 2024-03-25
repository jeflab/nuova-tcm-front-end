"use client";

import {User} from "@/models/entities/user";
import {Button, Row, Card, Col} from "react-bootstrap";

interface AccountProfileProps {
  user: User;
}

export function AccountProfile({user}: AccountProfileProps) {
  return (
    <>
      <h3>Account</h3>
      <Card body>
        <Row as="dl" className="last-dd-m-0" xs={3}>
          <Col>
            <dt>Codice fiscale:</dt>
            <dd>{user.fiscalCode}</dd>
          </Col>
          <Col>
            <dt>Email:</dt>
            <dd>{user.email}</dd>
          </Col>
          <Col>
            <dt>Numero di cellulare:</dt>
            <dd>{user.phone}</dd>
          </Col>
        </Row>
        <Button>Modifica</Button>
      </Card>
    </>
  );
}
