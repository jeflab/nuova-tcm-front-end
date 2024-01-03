"use client";

import {WithChildren} from "@/ui/types";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {NavLink} from "react-bootstrap";

export function LoginButton({children}: WithChildren) {
  const currentPath = usePathname();
  const searchParams = new URLSearchParams({next: currentPath});

  return (
    <NavLink as={Link} href={`/login?${searchParams.toString()}`}>
      {children}
    </NavLink>
  );
}
