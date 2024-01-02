"use client";
import {logout} from "@/app/(public)/(auth)/actions";
import {Button, NavLink} from "react-bootstrap";

export function LogoutButton() {
  return (
    <NavLink
      as={Button}
      onClick={async () => {
        await logout();
      }}
      variant="link"
      className="text-start"
    >
      Esci
    </NavLink>
  );
}
