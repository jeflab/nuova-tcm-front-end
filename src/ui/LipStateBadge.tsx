"use client";

import {Lip} from "@/models/entities/lip";
import {Placeholder} from "react-bootstrap";

interface LipStateBadgeProps {
  lipState: Lip["lipState"];
}

export function LipStateBadge({lipState}: LipStateBadgeProps) {
  return (
    <span>
      {lipState.icon} {lipState.label}
    </span>
  );
}

interface LipStateBadgeSkeletonProps {
  width?: number;
}

export function LipStateBadgeSkeleton({
  width = 120,
}: LipStateBadgeSkeletonProps) {
  return (
    <Placeholder as="span" animation="glow">
      <Placeholder
        as="span"
        className="rounded-circle"
        style={{width: "1em"}}
      />{" "}
      <Placeholder as="span" style={{width: `${width}px`}} />
    </Placeholder>
  );
}
