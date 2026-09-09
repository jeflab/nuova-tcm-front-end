"use client";

import {drawers} from "@/app/(menu)/(authenticated)/contractorLips/[id]/drawers";
import styles from "@/app/(menu)/(authenticated)/contractorLips/[id]/page.module.scss";
import {useSuspenseLip} from "@/app/(menu)/(authenticated)/lipsDrawers/useSuspenseLip";
import {cns} from "@/helpers/cns";
import {isLip} from "@/models/entities/lip";
import {ButtonLink} from "@/ui/ButtonLink";
import {Drawer} from "@/ui/drawer/Drawer";
import {NavDrawer} from "@/ui/drawer/NavDrawer";
import {LipStateBadge} from "@/ui/LipStateBadge";
import {PageTitle} from "@/ui/PageTitle";
import ScrollReveal from "@/ui/ScrollReveal/ScrollReveal";
import {faArrowLeft} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Fragment} from "react";
import {Col, Nav, Row} from "react-bootstrap";

const minWidthHack = {minWidth: "1px"};

export function ContractorLipDetails() {
  const {
    data: {lip},
  } = useSuspenseLip();

  if (!isLip(lip)) {
    throw new Error("Errore nel caricamento della polizza");
  }

  return (
    <>
      <div>
        <PageTitle>Polizza n° {lip.lipNumber}</PageTitle>
        {lip.lipState && <LipStateBadge lipState={lip.lipState} />}
      </div>
      <ButtonLink href="/contractorLips">
        <FontAwesomeIcon icon={faArrowLeft} /> Torna alle tue polizze
      </ButtonLink>
      <Row className="flex-row-reverse gy-3">
        <Col md="auto">
          <Nav className={cns("flex-column", styles.connectedList)}>
            <ScrollReveal revealThreshold={70}>
              <div className="mb-3 pb-2 border-bottom">
                <PageTitle>
                  Polizza n°
                  <br />
                  {lip.lipNumber}
                </PageTitle>
                <LipStateBadge lipState={lip.lipState} />
              </div>
            </ScrollReveal>
            <div className={styles.navLinks}>
              {drawers.map(({name, title, shortTitle, isVisible}) => {
                if (isVisible && !isVisible(lip.type)) {
                  return null;
                }
                return (
                  <NavDrawer name={name} key={name}>
                    {shortTitle ?? title}
                  </NavDrawer>
                );
              })}
            </div>
          </Nav>
        </Col>
        <Col className="d-flex flex-column gap-3" style={minWidthHack}>
          {drawers.map(({name, title, summaryContent, lock, isVisible}) => {
            if (isVisible && lip && !isVisible(lip.type)) {
              return null;
            }
            return (
              <Fragment key={name}>
                {lock}
                <Drawer name={name} title={title} readonly>
                  {summaryContent}
                </Drawer>
              </Fragment>
            );
          })}
        </Col>
      </Row>
    </>
  );
}
