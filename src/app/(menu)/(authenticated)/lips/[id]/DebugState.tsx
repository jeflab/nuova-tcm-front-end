"use client";

import {drawers} from "@/app/(menu)/(authenticated)/lips/[id]/drawers";
import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {ButtonLink} from "@/ui/ButtonLink";
import {Debug} from "@/ui/Debug";
import React, {useEffect} from "react";
import {ButtonGroup, Card, CardBody, CardHeader} from "react-bootstrap";

const divStyle = {} as const;

interface DebugStateProps {
  step?: string;
}

export function DebugState({step}: DebugStateProps) {
  const preliminaryData = useDrawerStore((state) => state.preliminaryData);
  const lipData = useDrawerStore((state) => state.lipData);
  const lip = useDrawerStore((state) => state.lip);
  const contractor = useDrawerStore((state) => state.contractor);

  return (
    <Card style={divStyle}>
      <CardHeader>Debug stato lip</CardHeader>
      <CardBody>
        <ButtonGroup className="d-flex flex-wrap gap-2">
          {drawers.map((drawer) => (
            <ButtonLink
              key={drawer.name}
              href={`debug?step=${drawer.name}`}
              variant="primary"
              className="d-flex align-items-center btn-sm"
            >
              {drawer.shortTitle ?? drawer.title}
            </ButtonLink>
          ))}
          <ButtonLink
            href="debug?step=all"
            variant="primary"
            className="d-flex align-items-center btn-sm"
          >
            Tutti
          </ButtonLink>
        </ButtonGroup>
        <Debug className="mt-3">
          {{preliminaryData, lipData, lip, contractor}}
        </Debug>
      </CardBody>
    </Card>
  );
}
