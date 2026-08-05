"use client";

import {getLipQuery} from "@/app/(menu)/(authenticated)/lips/[id]/queries";
import {validateLipIdOrNotFound} from "@/app/(menu)/(authenticated)/lipsDrawers/validateLipIdOrNotFound";
import {cns} from "@/helpers/cns";
import {ButtonLink} from "@/ui/ButtonLink";
import {Drawer} from "@/ui/drawer/Drawer";
import {NavDrawer} from "@/ui/drawer/NavDrawer";
import {LipStateBadge} from "@/ui/LipStateBadge";
import {PageTitle} from "@/ui/PageTitle";
import ScrollReveal from "@/ui/ScrollReveal/ScrollReveal";
import {faArrowLeft} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useSuspenseQuery} from "@tanstack/react-query";
import {useParams} from "next/navigation";
import {Fragment} from "react";
import {Col, Nav, Row} from "react-bootstrap";
import {drawers} from "./drawers";
import styles from "./page.module.scss";

const minWidthHack = {minWidth: "1px"};

export function LipDetails() {
  const lipId = validateLipIdOrNotFound(useParams<{id: string}>().id);
  const {
    data: {lip},
  } = useSuspenseQuery(getLipQuery(lipId));

  return (
    <>
      <div>
        <PageTitle>
          {"lipNumber" in lip
            ? `Polizza n° ${lip.lipNumber}`
            : "Nuova proposta di polizza"}
        </PageTitle>
        {"lipState" in lip && <LipStateBadge lipState={lip.lipState} />}
      </div>
      <ButtonLink href="/lips">
        <FontAwesomeIcon icon={faArrowLeft} /> Torna all'elenco
      </ButtonLink>
      <Row className="flex-row-reverse gy-3">
        <Col md="auto">
          <Nav className={cns("flex-column", styles.connectedList)}>
            <ScrollReveal revealThreshold={70}>
              <div className="mb-3 pb-2 border-bottom">
                <PageTitle>
                  {"lipNumber" in lip ? (
                    <>
                      Polizza n°
                      <br />
                      {lip.lipNumber}
                    </>
                  ) : (
                    <>
                      Nuova proposta
                      <br />
                      di polizza
                    </>
                  )}
                </PageTitle>
                {"lipState" in lip && <LipStateBadge lipState={lip.lipState} />}
              </div>
            </ScrollReveal>
            <div className={styles.navLinks}>
              {drawers.map(({name, title, shortTitle, isVisible}) => {
                if (isVisible && lip?.type && !isVisible(lip.type)) {
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
          {drawers.map(
            ({name, title, modalContent, summaryContent, lock, isVisible}) => {
              if (isVisible && lip?.type && !isVisible(lip.type)) {
                return null;
              }
              return (
                <Fragment key={name}>
                  {lock}
                  <Drawer name={name} title={title} modalContent={modalContent}>
                    {summaryContent}
                  </Drawer>
                </Fragment>
              );
            },
          )}
        </Col>
      </Row>
    </>
  );
}
