"use client";

import {DrawerName} from "@/app/(menu)/(authenticated)/lips/[id]/drawers";
import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {DrawerIcon} from "@/ui/drawer/DrawerIcon";
import React, {ReactNode} from "react";
import {NavLink} from "react-bootstrap";

interface DrawerProps {
  children?: ReactNode;
  name: DrawerName;
}

export function NavDrawer({children, name}: DrawerProps) {
  const drawerState = useDrawerStore((state) => state.drawerStates[name]);

  return (
    <NavLink disabled={!drawerState} href={`#${name}`}>
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
