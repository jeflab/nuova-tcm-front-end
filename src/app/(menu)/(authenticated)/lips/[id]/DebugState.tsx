"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {Debug} from "@/ui/Debug";
import React from "react";

const divStyle = {
  position: "sticky",
  top: "23rem",
} as const;

export function DebugState() {
  const lipData = useDrawerStore((state) => state.lipData);

  return (
    <div style={divStyle}>
      <p>Debug stato lip:</p>
      <Debug>{lipData}</Debug>
    </div>
  );
}
