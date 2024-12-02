import {drawers} from "@/app/(menu)/(authenticated)/lips/[id]/drawers";
import {cns} from "@/helpers/cns";
import {AppContainer} from "@/ui/AppContainer";
import {ButtonLink} from "@/ui/ButtonLink";
import {DrawerSkeleton} from "@/ui/drawer/Drawer";
import {NavDrawerSkeleton} from "@/ui/drawer/NavDrawer";
import {LipStateBadgeSkeleton} from "@/ui/LipStateBadge";
import {PageTitle} from "@/ui/PageTitle";
import {faArrowLeft} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Col, Nav, Row} from "react-bootstrap";
import styles from "./page.module.scss";

export default async function NewLipPage() {
  return (
    <AppContainer className="vstack gap-3 align-items-start">
      <div>
        <PageTitle>Caricamento polizza</PageTitle>
        <LipStateBadgeSkeleton />
      </div>
      <ButtonLink href="/contractorLips">
        <FontAwesomeIcon icon={faArrowLeft} /> Torna alle tue polizze
      </ButtonLink>
      <Row className="flex-row-reverse gy-3">
        <Col md="auto">
          <Nav className={cns("flex-column", styles.connectedList)}>
            {drawers.map(({name, title, shortTitle}) => (
              <NavDrawerSkeleton key={name}>
                {shortTitle ?? title}
              </NavDrawerSkeleton>
            ))}
          </Nav>
        </Col>
        <Col className="d-flex flex-column gap-3">
          {drawers.map(({name, title}) => (
            <DrawerSkeleton key={name} title={title} />
          ))}
        </Col>
      </Row>
    </AppContainer>
  );
}
