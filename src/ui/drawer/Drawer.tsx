"use client";
import {cns} from "@/app/helpers/cns";
import {DrawerIcon} from "@/ui/drawer/DrawerIcon";
import {faPenToSquare} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ReactNode, useState} from "react";
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
  title: string;
  isActive?: boolean;
  isComplete?: boolean;
  isLoading?: boolean;
  children?: ReactNode;
  modalContent?: ReactNode;
}

export function Drawer({
  children,
  isActive,
  isComplete,
  isLoading,
  modalContent,
  title,
}: DrawerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card
        className={cns(
          isComplete && styles.isComplete,
          isActive && styles.isActive,
        )}
      >
        <CardHeader className="d-flex align-items-center justify-content-between py-3">
          <h4 className="mb-0">
            <DrawerIcon
              isActive={isActive}
              isComplete={isComplete}
              isLoading={isLoading}
              className="me-2"
            />
            {title}
          </h4>
          <Button
            className={cns(!isActive && "invisible")}
            onClick={() => setIsModalOpen(true)}
          >
            <FontAwesomeIcon icon={faPenToSquare} className="me-2" />
            {isComplete ? "Modifica" : "Compila"}
          </Button>
        </CardHeader>
        {isComplete && <CardBody>{children}</CardBody>}
      </Card>
      <Modal
        backdrop="static"
        className={styles.modal}
        fullscreen="xl-down"
        size="xl"
        keyboard={false}
        onHide={() => {
          setIsModalOpen(false);
        }}
        show={isModalOpen}
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
