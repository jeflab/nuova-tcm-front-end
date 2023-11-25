"use client";
import {cns} from "@/app/helpers";
import {
  faArrowDownShortWide,
  faArrowUpWideShort,
  faCheckCircle,
  faCircleHalf,
  faDollarCircle,
  faEye,
  faSortAlt,
  faTrash,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortDirection,
  useReactTable,
} from "@tanstack/react-table";
import {ReactNode} from "react";
import {Button, Table} from "react-bootstrap";
import styles from "./LipsTable.module.scss";
import {Lip} from "./model";

interface LipsTableProps {
  lips: Lip[];
}

const sortIcon: Record<SortDirection | "unsorted", ReactNode> = {
  asc: <FontAwesomeIcon icon={faArrowDownShortWide} fixedWidth />,
  desc: <FontAwesomeIcon icon={faArrowUpWideShort} fixedWidth />,
  unsorted: <FontAwesomeIcon icon={faSortAlt} fixedWidth />,
};

const stateIcon: Record<Lip["state"], ReactNode> = {
  Aperta: <FontAwesomeIcon icon={faCircleHalf} className="text-warning" />,
  "In attesa di pagamento": (
    <FontAwesomeIcon icon={faDollarCircle} className="text-warning" />
  ),
  Completata: <FontAwesomeIcon icon={faCheckCircle} className="text-success" />,
};

const columnHelper = createColumnHelper<Lip>();
const columns = [
  columnHelper.accessor("surname", {
    header: "Cognome",
  }),
  columnHelper.accessor("name", {header: "Nome"}),
  columnHelper.accessor("date", {header: "Data"}),
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
];

export function LipsTable({lips}: LipsTableProps) {
  const table = useReactTable({
    data: lips,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // TODO: rendere la tabella responsive con https://codepen.io/AllThingsSmitty/pen/MyqmdM

  return (
    <Table hover striped bordered responsive>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const sortDirection = header.column.getIsSorted() || "unsorted";
              return (
                <th
                  key={header.id}
                  scope="col"
                  onClick={header.column.getToggleSortingHandler()}
                  className={cns(
                    header.id === "actions" && styles.narrowColumn,
                    header.column.getCanSort() && styles.sortableColumn,
                  )}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}{" "}
                  {header.column.getCanSort() && sortIcon[sortDirection]}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
