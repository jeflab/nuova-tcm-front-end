"use client";

import {
  Contractor,
  Lip,
} from "@/app/(menu)/(authenticated)/contractorLips/models";
import {dateString} from "@/helpers/dates";
import {CardCollapsable} from "@/ui/CardCollapsable";
import {faEye} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Button, Placeholder, Stack} from "react-bootstrap";

interface PolicyProps {
  lip: Lip;
  contractor: Contractor;
}

export function Policy({lip, contractor}: PolicyProps) {
  return (
    <CardCollapsable
      header={
        <Stack direction="horizontal" gap={3}>
          <div className="flex-grow-1">
            <p className="mb-0">
              <strong>Polizza n°:</strong> {lip.id}
            </p>
            <p className="mb-0">
              <strong>Stipulata il:</strong> {dateString(lip.createdAt)}
            </p>
            <p className="mb-0">
              <strong>Agente:</strong> {lip.agent.name} {lip.agent.surname}
            </p>
          </div>
          <div>
            <Button
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <FontAwesomeIcon icon={faEye} className="me-2" />
              Dettagli
            </Button>
          </div>
        </Stack>
      }
    >
      <div className="vstack gap-3">
        <p className="mb-0">
          <strong>Stipulata il:</strong> {dateString(lip.createdAt)}
        </p>
        <p className="mb-0">
          <strong>Contraente / Assicurato:</strong> {contractor.name}{" "}
          {contractor.surname}
        </p>
        <p className="mb-0">
          <strong>Agente:</strong> {lip.agent.name} {lip.agent.surname}
        </p>
      </div>
    </CardCollapsable>
  );
}

export function PolicySkeleton() {
  return (
    <CardCollapsable
      disabled
      header={
        <Stack direction="horizontal" gap={3}>
          <Placeholder as="div" className="flex-grow-1" animation="glow">
            <p className="mb-0">
              <Placeholder style={{width: "70px"}}></Placeholder>{" "}
              <Placeholder style={{width: "20px"}}></Placeholder>
            </p>
            <p className="mb-0">
              <Placeholder style={{width: "80px"}}></Placeholder>{" "}
              <Placeholder style={{width: "130px"}}></Placeholder>
            </p>
            <p className="mb-0">
              <Placeholder style={{width: "60px"}}></Placeholder>{" "}
              <Placeholder style={{width: "130px"}}></Placeholder>
            </p>
          </Placeholder>
          <Placeholder as="div" animation="glow">
            <Button variant="primary" disabled className="disabled placeholder">
              <FontAwesomeIcon icon={faEye} className="me-2" />
              Dettagli
            </Button>
          </Placeholder>
        </Stack>
      }
    />
  );
}
