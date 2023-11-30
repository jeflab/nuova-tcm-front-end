"use client";
import {cns} from "@/app/helpers/cns";
import {sortIcon} from "@/ui/table/DataTable";
import styles from "@/ui/table/DataTable.module.scss";
import {Filter} from "@/ui/table/Filter";
import {
  columnFiltersStringToObject,
  DataTableParams,
  dataTableParamsSchema,
  sortingObjectToString,
  sortingStringToObject,
} from "@/ui/table/helpers";
import {
  faAngleDown,
  faBackward,
  faCaretLeft,
  faCaretRight,
  faFilterCircleXmark,
  faForward,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {Fragment} from "react";
import {
  Button,
  Card,
  CardHeader,
  FormControl,
  FormLabel,
  FormSelect,
  Placeholder,
  Table,
} from "react-bootstrap";
import responsiveStyles from "./ResponsiveTable.module.scss";

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
      pagination: {
        pageIndex: page - 1,
        pageSize: perPage,
      },
      sorting: sortingStringToObject(sorting),
      columnFilters: columnFiltersStringToObject(columnFilters),
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const getActiveFilterCount = () => {
    const count = table.getState().columnFilters.length;
    const defaultSorting = dataTableParamsSchema.shape.sorting.parse(undefined);
    const sorting = sortingObjectToString(table.getState().sorting);

    return count + (sorting !== defaultSorting ? 1 : 0);
  };

  return (
    <>
      <Card className={responsiveStyles.filterPanel}>
        <CardHeader className="d-flex justify-content-between align-items-center">
          <span>
            Filtri {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}{" "}
            <FontAwesomeIcon icon={faAngleDown} />
          </span>{" "}
          <Placeholder as="span" animation="glow">
            <Button
              size="sm"
              className="disabled placeholder"
              hidden={getActiveFilterCount() === 0}
            >
              <FontAwesomeIcon icon={faFilterCircleXmark} />
              Reset filtri
            </Button>
          </Placeholder>
        </CardHeader>
      </Card>
      <Table
        hover
        striped
        bordered
        responsive
        className={cns(responsiveStyles.responsiveTableWrapper, "mb-0")}
      >
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
                <td
                  key={cell.id}
                  data-label={
                    typeof cell.column.columnDef.header === "string"
                      ? `${cell.column.columnDef.header}:`
                      : undefined
                  }
                >
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
        <div className={styles.paginationControls}>
          <FormControl
            type="number"
            min={1}
            max={100}
            defaultValue={table.getState().pagination.pageIndex + 1}
            className={styles.paginationInput}
          />
          <span>di #</span>
          <div className="vr" />
          <FormSelect
            className={styles.paginationSelect}
            id="chose-page"
            defaultValue={table.getState().pagination.pageSize}
          >
            {[10, 25, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </FormSelect>{" "}
          <FormLabel htmlFor="chose-page">polizze per pagina</FormLabel>
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
