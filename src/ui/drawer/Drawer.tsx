"use client";

import {DrawerName} from "@/app/(menu)/(authenticated)/lips/[id]/drawers";
import {useSuspenseLip} from "@/app/(menu)/(authenticated)/lipsDrawers/useSuspenseLip";
import {cns} from "@/helpers/cns";
import {DrawerIcon} from "@/ui/drawer/DrawerIcon";
import {buttonMap} from "@/ui/drawer/types";
import {upperCaseFirstNormalizer} from "@/ui/form/normalizers";
import {useDrawerModal} from "@/ui/ModalContext";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {faPenToSquare} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ReactNode} from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalHeader,
} from "react-bootstrap";
import styles from "./Drawer.module.scss";

interface DrawerProps {
  children?: ReactNode;
  modalContent?: ReactNode;
  name: DrawerName;
  readonly?: boolean;
  title: string;
}

export function Drawer({
  children,
  modalContent,
  name,
  readonly,
  title,
}: DrawerProps) {
  const {
    data: {drawerStates},
  } = useSuspenseLip();

  const [animateContainer] = useAutoAnimate();
  const {modalOpen, openModal, closeModal} = useDrawerModal();

  const {variant, buttonLabel, buttonIcon, isLocked} = drawerStates[name] ?? {};

  return (
    <>
      <Card
        className={cns(
          styles.drawer,
          variant && styles[`is${upperCaseFirstNormalizer(variant)}`],
          isLocked && styles.isLocked,
        )}
      >
        <CardHeader className="d-flex align-items-center justify-content-between py-3">
          <div id={name} className={styles.anchor} />
          <h4 className="mb-0 d-flex align-items-center">
            <DrawerIcon variant={variant} className="me-3" />
            {title}
          </h4>
          {buttonLabel && !readonly && (
            <Button
              className={cns(styles.actionButton, "ms-3")}
              onClick={() => {
                openModal(name);
              }}
            >
              <FontAwesomeIcon
                icon={buttonIcon ? buttonMap[buttonIcon] : faPenToSquare}
              />
              <span className={styles.actionButtonLabel}>{buttonLabel}</span>
            </Button>
          )}
        </CardHeader>
        <CardBody ref={animateContainer}>{variant && children}</CardBody>
      </Card>
      {!readonly && (
        <Modal
          backdrop="static"
          className={styles.modal}
          fullscreen="xl-down"
          size="xl"
          onHide={() => closeModal()}
          keyboard={false}
          show={modalOpen === name}
        >
          <ModalHeader closeButton>
            <Modal.Title>{title}</Modal.Title>
          </ModalHeader>
          {modalContent}
        </Modal>
      )}
    </>
  );
}

interface DrawerSkeletonProps {
  title: string;
}

export function DrawerSkeleton({title}: DrawerSkeletonProps) {
  return (
    <>
      <Card className={styles.drawer}>
        <CardHeader className="d-flex align-items-center justify-content-between py-3">
          <h4 className="mb-0 d-flex align-items-center">
            <DrawerIcon variant="loading" className="me-3" />
            {title}
          </h4>
        </CardHeader>
      </Card>
    </>
  );
}
