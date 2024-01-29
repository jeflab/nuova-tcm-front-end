"use client";

import {DrawerName} from "@/app/(menu)/(authenticated)/lips/[id]/drawers";
import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {cns} from "@/helpers/cns";
import {DrawerIcon} from "@/ui/drawer/DrawerIcon";
import React, {ReactNode} from "react";
import {NavLink} from "react-bootstrap";

interface DrawerProps {
  active?: boolean;
  children?: ReactNode;
  name: DrawerName;
}

export function NavDrawer({active, children, name}: DrawerProps) {
  const drawerState = useDrawerStore((state) => state.drawerStates[name]);

  return (
    <NavLink
      disabled={!drawerState}
      href={`#${name}`}
      className={cns(active && "fw-bold")}
    >
      <DrawerIcon state={drawerState} className="me-2" />
      {children}
    </NavLink>
  );
}

interface DrawerSkeletonProps {
  children?: ReactNode;
}

export function NavDrawerSkeleton({children}: DrawerSkeletonProps) {
  return (
    <NavLink disabled>
      <DrawerIcon state="loading" className="me-2" />
      {children}
    </NavLink>
  );
}
