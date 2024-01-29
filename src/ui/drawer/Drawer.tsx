"use client";

import {DrawerName} from "@/app/(menu)/(authenticated)/lips/[id]/drawers";
import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {cns} from "@/helpers/cns";
import {DrawerIcon} from "@/ui/drawer/DrawerIcon";
import {upperCaseFirstNormalizer} from "@/ui/form/normalizers";
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
  isComplete?: boolean;
  isLoading?: boolean;
  modalContent?: ReactNode;
  name: DrawerName;
  title: string;
}

export function Drawer({children, modalContent, name, title}: DrawerProps) {
  const modalOpen = useDrawerStore((state) => state.modalOpen);
  const openModal = useDrawerStore((state) => state.openModal);
  const closeModal = useDrawerStore((state) => state.closeModal);
  const drawerState = useDrawerStore((state) => state.drawerStates[name]);

  return (
    <>
      <Card
        className={cns(
          styles.drawer,
          drawerState && styles[`is${upperCaseFirstNormalizer(drawerState)}`],
        )}
      >
        <div id={name} className={styles.anchor} />
        <CardHeader className="d-flex align-items-center justify-content-between py-3">
          <h4 className="mb-0">
            <DrawerIcon state={drawerState} className="me-2" />
            {title}
          </h4>
          <Button
            className={cns(drawerState !== "active" && "invisible")}
            onClick={() => openModal(name)}
          >
            <FontAwesomeIcon icon={faPenToSquare} className="me-2" />
            {drawerState === "success" ? "Modifica" : "Compila"}
          </Button>
        </CardHeader>
        <CardBody>{children}</CardBody>
      </Card>
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
    </>
  );
}

interface DrawerSkeletonProps {
  title: string;
}

export function DrawerSkeleton({title}: DrawerSkeletonProps) {
  return (
    <>
      <Card>
        <CardHeader className="d-flex align-items-center justify-content-between py-3">
          <h4 className="mb-0">
            <DrawerIcon state="loading" className="me-2" />
            {title}
          </h4>
          <Button className="invisible">Compila</Button>
        </CardHeader>
      </Card>
    </>
  );
}
