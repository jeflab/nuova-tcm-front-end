"use client";

import {PersonalData} from "@/models/entities/personalData";
import {Lip} from "@/models/entities/lip";
import {dateString} from "@/helpers/dates";
import {ButtonLink} from "@/ui/ButtonLink";
import {CardCollapsable} from "@/ui/CardCollapsable";
import {LipStateBadge, LipStateBadgeSkeleton} from "@/ui/LipStateBadge";
import {faEye} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Button, Placeholder, Stack} from "react-bootstrap";

interface PolicyProps {
  lip: Lip;
  insured?: PersonalData | null;
  contractor: PersonalData;
}

export function Policy({lip, insured, contractor}: PolicyProps) {
  return (
    <CardCollapsable
      header={
        <Stack direction="horizontal" gap={3}>
          <div className="flex-grow-1">
            <p className="mb-0">
              <strong>Proposta di Polizza n°:</strong> {lip.lipNumber}
            </p>
            <p className="mb-0">
              <strong>Stato proposta:</strong>{" "}
              <LipStateBadge lipState={lip.lipStates} />
            </p>
            <p className="mb-0">
              <strong>Creata il:</strong> {dateString(lip.createdAt)}
            </p>
            <p className="mb-0">
              <strong>Agente:</strong> {lip.agent.name} {lip.agent.surname}
            </p>
          </div>
          <div>
            <ButtonLink
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
              }}
              href={`/contractorLips/${lip.id}`}
            >
              <FontAwesomeIcon icon={faEye} className="me-2" />
              Dettagli
            </ButtonLink>
          </div>
        </Stack>
      }
    >
      <div className="vstack gap-3">
        <p className="mb-0">
          <strong>Creata il:</strong> {dateString(lip.createdAt)}
        </p>
        {lip.type === "self-insured" ? (
          <p className="mb-0">
            <strong>Contraente / Assicurato:</strong> {contractor.name}{" "}
            {contractor.surname}
          </p>
        ) : (
          <>
            <p className="mb-0">
              <strong>Contraente:</strong> {contractor.name}{" "}
              {contractor.surname}
            </p>
            <p className="mb-0">
              <strong>Assicurato:</strong> {insured?.name} {insured?.surname}
            </p>
          </>
        )}
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
              <Placeholder style={{width: "165px"}}></Placeholder>{" "}
              <Placeholder style={{width: "100px"}}></Placeholder>
            </p>
            <p className="mb-0">
              <Placeholder style={{width: "115px"}}></Placeholder>{" "}
              <LipStateBadgeSkeleton />
            </p>
            <p className="mb-0">
              <Placeholder style={{width: "70px"}}></Placeholder>{" "}
              <Placeholder style={{width: "120px"}}></Placeholder>
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
