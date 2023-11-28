"use client";

import {Lip} from "@/app/(authenticated)/lips/model";
import styles from "@/ui/table/DataTable.module.scss";
import {
  faCheckCircle,
  faCircleHalf,
  faDollarCircle,
  faEye,
  faTrash,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ColumnDef, createColumnHelper} from "@tanstack/react-table";
import {ReactNode} from "react";
import {Button} from "react-bootstrap";

const stateIcon: Record<Lip["state"], ReactNode> = {
  Aperta: <FontAwesomeIcon icon={faCircleHalf} className="text-warning" />,
  "In attesa di pagamento": (
    <FontAwesomeIcon icon={faDollarCircle} className="text-warning" />
  ),
  Completata: <FontAwesomeIcon icon={faCheckCircle} className="text-success" />,
};

const columnHelper = createColumnHelper<Lip>();
export const columns = [
  columnHelper.accessor("surname", {
    header: "Cognome",
  }),
  columnHelper.accessor("name", {header: "Nome"}),
  columnHelper.accessor("date", {
    header: "Data",
    cell: (props) => props.getValue().toLocaleDateString(),
  }),
  columnHelper.accessor("state", {
    header: "Stato",
    cell: (props) => (
      <>
        {stateIcon[props.getValue()]} {props.getValue()}
      </>
    ),
  }),
  columnHelper.display({
    id: "actions",
    cell: () => (
      <span className={styles.actions}>
        <Button variant="primary" size="sm" className="text-nowrap">
          <FontAwesomeIcon icon={faEye} /> Visualizza
        </Button>{" "}
        <Button variant="danger" size="sm" title="Elimina polizza">
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </span>
    ),
  }),
] as ColumnDef<Lip>[];

export const skeletonColumns = [
  columnHelper.accessor("surname", {
    header: "Cognome",
    cell: () => (
      <span
        className="placeholder"
        style={{width: `${40 + Math.random() * 35}px`}}
      />
    ),
  }),
  columnHelper.accessor("name", {
    header: "Nome",
    cell: () => (
      <span
        className="placeholder"
        style={{width: `${40 + Math.random() * 35}px`}}
      />
    ),
  }),
  columnHelper.accessor("date", {
    header: "Data",
    cell: () => <span className="placeholder" style={{width: "80px"}} />,
  }),
  columnHelper.accessor("state", {
    header: "Stato",
    cell: () => (
      <>
        <span className="placeholder rounded-circle" style={{width: "1em"}} />{" "}
        <span
          className="placeholder"
          style={{width: `${45 + Math.random() * 115}px`}}
        />
      </>
    ),
  }),
  columnHelper.display({
    id: "actions",
    cell: () => (
      <span className={styles.actions}>
        <Button
          variant="primary"
          size="sm"
          className="text-nowrap disabled placeholder"
        >
          <FontAwesomeIcon icon={faEye} /> Visualizza
        </Button>{" "}
        <Button
          variant="danger"
          size="sm"
          title="Elimina polizza"
          className="disabled placeholder"
        >
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </span>
    ),
  }),
] as ColumnDef<Lip>[];
