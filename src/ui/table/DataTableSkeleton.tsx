"use client";
import {cns} from "@/app/helpers";
import {sortIcon} from "@/ui/table/DataTable";
import styles from "@/ui/table/DataTable.module.scss";
import {
  DataTableParams,
  dataTableParamsSchema,
  sortingStringToObject,
} from "@/ui/table/helpers";
import {
  faBackward,
  faCaretLeft,
  faCaretRight,
  faForward,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Button,
  FormControl,
  FormLabel,
  FormSelect,
  Table,
} from "react-bootstrap";

interface DataTableSkeletonProps {
  columns: ColumnDef<any>[];
  searchParams: Partial<DataTableParams>;
}
export function DataTableSkeleton({
  columns,
  searchParams,
}: DataTableSkeletonProps) {
  const {page, perPage, sorting} = dataTableParamsSchema.parse(searchParams);
  const table = useReactTable({
    columns,
    data: Array.from({length: perPage}, () => ({})),
    state: {sorting: sortingStringToObject(sorting)},
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Table hover striped bordered responsive className="mb-0">
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
      <div className="hstack align-baseline gap-3 justify-content-center">
        <div className="hstack gap-2 align-baseline">
          <Button disabled>
            <FontAwesomeIcon icon={faBackward} />
          </Button>
          <Button disabled>
            <FontAwesomeIcon icon={faCaretLeft} />
          </Button>
        </div>
        <div className="hstack gap-2 align-baseline">
          <FormControl
            type="number"
            defaultValue={page}
            className={styles.paginationInput}
          />{" "}
          di #
          <div className="vr" />
          <FormSelect className="w-auto" id="test" defaultValue={perPage}>
            {[10, 25, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </FormSelect>{" "}
          <FormLabel htmlFor="test">polizze per pagina</FormLabel>
        </div>
        <div className="hstack gap-2 align-baseline">
          <Button disabled>
            <FontAwesomeIcon icon={faCaretRight} />
          </Button>
          <Button disabled>
            <FontAwesomeIcon icon={faForward} />
          </Button>
        </div>
      </div>
    </>
  );
}
