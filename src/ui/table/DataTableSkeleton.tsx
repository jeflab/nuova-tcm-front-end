"use client";
import {cns} from "@/app/helpers/cns";
import {sortIcon} from "@/ui/table/DataTable";
import styles from "@/ui/table/DataTable.module.scss";
import {Filter} from "@/ui/table/Filter";
import {
  columnFiltersStringToObject,
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
  const {page, perPage, sorting, columnFilters} =
    dataTableParamsSchema.parse(searchParams);
  const table = useReactTable({
    columns,
    data: Array.from({length: perPage}, () => ({})),
    state: {
      sorting: sortingStringToObject(sorting),
      columnFilters: columnFiltersStringToObject(columnFilters),
    },
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
                    className={cns(
                      header.id === "actions" && styles.narrowColumn,
                    )}
                  >
                    <div>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}{" "}
                      {header.column.getCanSort() && sortIcon[sortDirection]}
                    </div>
                    {header.column.getCanFilter() ? (
                      <div className="mt-2">
                        <Filter column={header.column} disabled />
                      </div>
                    ) : null}
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
