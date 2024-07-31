"use client";

import {Lip} from "@/models/entities/lip";
import {Placeholder} from "react-bootstrap";

interface LipStateBadgeProps {
  lipState: Lip["lipStates"];
}

export function LipStateBadge({lipState}: LipStateBadgeProps) {
  return (
    <span>
      {lipState.icon} {lipState.label}
    </span>
  );
}

export function LipStateBadgeSkeleton() {
  return (
    <Placeholder as="span" animation="glow">
      <Placeholder
        as="span"
        className="rounded-circle"
        style={{width: "1em"}}
      />{" "}
      <Placeholder as="span" style={{width: `${45 + Math.random() * 115}px`}} />
    </Placeholder>
  );
}
