"use client";

import {logout} from "@/app/(no-menu)/(auth)/actions";
import {WithChildren} from "@/ui/types";
import {Button, NavLink} from "react-bootstrap";

export function LogoutButton({children}: WithChildren) {
  return (
    <NavLink
      as={Button}
      onClick={async () => {
        await logout();
      }}
      variant="link"
      className="text-start"
    >
      {children}
    </NavLink>
  );
}
