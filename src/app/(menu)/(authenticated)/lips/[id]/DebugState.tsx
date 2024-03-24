"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {Debug} from "@/ui/Debug";
import {ReactNode} from "react";
import {Card, CardBody, CardHeader} from "react-bootstrap";

const divStyle = {} as const;

interface DebugStateProps {
  debugNav: ReactNode;
}

export function DebugState({debugNav}: DebugStateProps) {
  const preliminaryData = useDrawerStore((state) => state.preliminaryData);
  const lip = useDrawerStore((state) => state.lip);
  const drawerStates = useDrawerStore((state) => state.drawerStates);

  return (
    <Card style={divStyle}>
      <CardHeader>Debug stato lip</CardHeader>
      <CardBody>
        {debugNav}
        <Debug className="mt-3">{{preliminaryData, lip, drawerStates}}</Debug>
      </CardBody>
    </Card>
  );
}
