"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {Debug} from "@/ui/Debug";
import React from "react";
import {Card, CardBody, CardHeader} from "react-bootstrap";

const divStyle = {} as const;

export function DebugState() {
  const lipData = useDrawerStore((state) => state.lipData);

  return (
    <Card style={divStyle}>
      <CardHeader>Debug stato lip</CardHeader>
      <CardBody>
        <Debug>{lipData}</Debug>
      </CardBody>
    </Card>
  );
}
