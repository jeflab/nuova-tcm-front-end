"use client";

import {DrawerName} from "@/app/(menu)/(authenticated)/lips/[id]/page";
import {cns} from "@/helpers/cns";
import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {DrawerIcon} from "@/ui/drawer/DrawerIcon";
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

export function Drawer({
  children,
  isLoading,
  modalContent,
  name,
  title,
}: DrawerProps) {
  const modalOpen = useDrawerStore((state) => state.modalOpen);
  const openModal = useDrawerStore((state) => state.openModal);
  const closeModal = useDrawerStore((state) => state.closeModal);
  const drawerStates = useDrawerStore((state) => state.drawerStates);

  const isActive = drawerStates[name] === "active";
  const isSuccess = drawerStates[name] === "success";
  const isDanger = drawerStates[name] === "danger";

  return (
    <>
      <Card
        className={cns(
          styles.drawer,
          isActive && styles.isActive,
          isSuccess && styles.isSuccess,
          isDanger && styles.isDanger,
        )}
      >
        <div id={name} className={styles.anchor}>
          Test
        </div>
        <CardHeader className="d-flex align-items-center justify-content-between py-3">
          <h4 className="mb-0">
            <DrawerIcon
              isActive={isActive}
              isSuccess={isSuccess}
              isDanger={isDanger}
              isLoading={isLoading}
              className="me-2"
            />
            {title}
          </h4>
          <Button
            className={cns(!isActive && "invisible")}
            onClick={() => openModal(name)}
          >
            <FontAwesomeIcon icon={faPenToSquare} className="me-2" />
            {isSuccess ? "Modifica" : "Compila"}
          </Button>
        </CardHeader>
        {isSuccess && <CardBody>{children}</CardBody>}
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
            <DrawerIcon isLoading className="me-2" />
            {title}
          </h4>
          <Button className="invisible">Compila</Button>
        </CardHeader>
      </Card>
    </>
  );
}
