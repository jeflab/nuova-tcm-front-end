"use client";

import {DrawerName} from "@/app/(menu)/(authenticated)/lips/[id]/page";
import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {DrawerIcon} from "@/ui/drawer/DrawerIcon";
import React, {ReactNode} from "react";
import {NavLink} from "react-bootstrap";

interface DrawerProps {
  children?: ReactNode;
  name: DrawerName;
}

export function NavDrawer({children, name}: DrawerProps) {
  const drawerStates = useDrawerStore((state) => state.drawerStates);

  const isActive = drawerStates[name] === "active";
  const isSuccess = drawerStates[name] === "success";
  const isDanger = drawerStates[name] === "danger";

  return (
    <NavLink disabled={!isActive && !isDanger && !isSuccess} href={`#${name}`}>
      <DrawerIcon
        isActive={isActive}
        isSuccess={isSuccess}
        isDanger={isDanger}
        className="me-2"
      />
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
      <DrawerIcon isLoading className="me-2" />
      {children}
    </NavLink>
  );
}
