"use client";

import {DrawerName} from "@/app/(menu)/(authenticated)/lips/[id]/drawers";
import {getLipQuery} from "@/app/(menu)/(authenticated)/lips/[id]/queries";
import {validateLipIdOrNotFound} from "@/app/(menu)/(authenticated)/lipsDrawers/validateLipIdOrNotFound";
import {cns} from "@/helpers/cns";
import {DrawerIcon} from "@/ui/drawer/DrawerIcon";
import {useSuspenseQuery} from "@tanstack/react-query";
import {useParams} from "next/navigation";
import React, {ReactNode} from "react";
import {NavLink} from "react-bootstrap";

interface DrawerProps {
  active?: boolean;
  children?: ReactNode;
  name: DrawerName;
}

export function NavDrawer({active, children, name}: DrawerProps) {
  const lipId = validateLipIdOrNotFound(useParams<{id: string}>().id);
  const {
    data: {drawerStates},
  } = useSuspenseQuery(getLipQuery(lipId));
  const drawerState = drawerStates[name];

  return (
    <NavLink
      disabled={!drawerState}
      href={`#${name}`}
      className={cns("text-nowrap", active && "fw-bold")}
    >
      <DrawerIcon variant={drawerState?.variant} className="me-2" />
      {children}
    </NavLink>
  );
}

interface DrawerSkeletonProps {
  children?: ReactNode;
}

export function NavDrawerSkeleton({children}: DrawerSkeletonProps) {
  return (
    <NavLink disabled className="text-nowrap">
      <DrawerIcon variant="loading" className="me-2" />
      {children}
    </NavLink>
  );
}
