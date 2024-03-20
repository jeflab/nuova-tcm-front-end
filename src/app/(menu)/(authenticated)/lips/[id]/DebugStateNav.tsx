import {drawers} from "@/app/(menu)/(authenticated)/lips/[id]/drawers";
import {ButtonLink} from "@/ui/ButtonLink";
import {ButtonGroup} from "react-bootstrap";

export async function DebugStateNav() {
  return (
    <ButtonGroup className="d-flex flex-wrap gap-2">
      {drawers.map((drawer) => (
        <ButtonLink
          key={drawer.name}
          href={`debug?step=${drawer.name}`}
          variant="primary"
          className="d-flex align-items-center btn-sm"
        >
          {drawer.shortTitle ?? drawer.title}
        </ButtonLink>
      ))}
      <ButtonLink
        href="debug?step=all"
        variant="primary"
        className="d-flex align-items-center btn-sm"
      >
        Tutti
      </ButtonLink>
    </ButtonGroup>
  );
}
