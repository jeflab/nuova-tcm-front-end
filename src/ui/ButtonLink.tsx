import Link from "next/link";
import {Button, ButtonProps} from "react-bootstrap";
import type {WithChildren} from "./types";

interface ButtonLinkProps extends WithChildren, ButtonProps {
  scroll?: boolean;
  download?: boolean;
  prefetch?: boolean;
  href: string;
}
export function ButtonLink({children, href, ...rest}: ButtonLinkProps) {
  return (
    // @ts-expect-error - c'è un errore sulla prop "as" di Button. Pare un bug di react-bootstrap.
    //  Questo componente è solo per non scrivere il workaround ogni volta.
    <Button as={Link} href={href} type="button" {...rest}>
      {children}
    </Button>
  );
}
