"use client";
import {cns} from "@/app/helpers/cns";
import {ButtonLink} from "@/ui/ButtonLink";
import {Filter} from "@/ui/table/Filter";
import {
  faArrowDownShortWide,
  faArrowUpWideShort,
  faBackward,
  faCaretLeft,
  faCaretRight,
  faForward,
  faSortAlt,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  RowData,
  SortDirection,
  useReactTable,
} from "@tanstack/react-table";
import {usePathname, useRouter} from "next/navigation";
import {ReactNode} from "react";
import {FormControl, FormLabel, FormSelect, Table} from "react-bootstrap";
import styles from "./DataTable.module.scss";
import {
  columnFiltersObjectToString,
  columnFiltersStringToObject,
  DataTableParams,
  dataTableParamsSchema,
  defaultDataTableParams,
  sortingObjectToString,
  sortingStringToObject,
} from "./helpers";

interface DataTableProps<Row extends RowData> {
  columns: ColumnDef<Row>[];
  data: Row[];
  pageCount: number;
  searchParams: DataTableParams;
}

export const sortIcon: Record<SortDirection | "unsorted", ReactNode> = {
  asc: <FontAwesomeIcon icon={faArrowDownShortWide} fixedWidth />,
  desc: <FontAwesomeIcon icon={faArrowUpWideShort} fixedWidth />,
  unsorted: <FontAwesomeIcon icon={faSortAlt} fixedWidth />,
};

export function DataTable<Row>({
  columns,
  data,
  pageCount,
  searchParams,
}: DataTableProps<Row>) {
  const pathname = usePathname();
  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    manualSorting: true,
    manualPagination: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: (updaterFn) => {
      const oldSorting = table.getState().sorting;
      const newSorting =
        typeof updaterFn === "function" ? updaterFn(oldSorting) : updaterFn;

      const newPath = createPageURL({
        page: 1,
        sorting: sortingObjectToString(newSorting),
      });

      router.push(newPath, {scroll: false});
    },
    onPaginationChange: (updaterFn) => {
      const oldPagination = table.getState().pagination;
      const newPagination =
        typeof updaterFn === "function" ? updaterFn(oldPagination) : updaterFn;

      const newPath = createPageURL({
        page: newPagination.pageIndex + 1,
        perPage: newPagination.pageSize,
      });

      router.push(newPath, {scroll: false});
    },
    onColumnFiltersChange: (updaterFn) => {
      const oldColumnFilters = table.getState().columnFilters;
      const newColumnFilters =
        typeof updaterFn === "function"
          ? updaterFn(oldColumnFilters)
          : updaterFn;

      const newPath = createPageURL({
        page: 1,
        columnFilters: columnFiltersObjectToString(newColumnFilters),
      });

      router.push(newPath, {scroll: false});
    },
    pageCount,
    state: {
      pagination: {
        pageIndex: searchParams.page - 1,
        pageSize: searchParams.perPage,
      },
      sorting: sortingStringToObject(searchParams.sorting),
      columnFilters: columnFiltersStringToObject(searchParams.columnFilters),
    },
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  const createPageURL = (newParams: Partial<DataTableParams>) => {
    const updatedParams = {...searchParams, ...newParams};

    const parsedSearchParams = dataTableParamsSchema.parse(updatedParams);

    const newSearchParams = new URLSearchParams(
      Object.entries(parsedSearchParams)
        .filter(
          ([key, value]) =>
            value !== defaultDataTableParams[key as keyof DataTableParams],
        )
        .map(([key, value]) => [key, String(value)]),
    );
    const newSearchParamsString = newSearchParams.toString();

    return `${pathname}${
      newSearchParamsString && `?${newSearchParams.toString()}`
    }`;
  };

  // TODO: rendere la tabella responsive con https://codepen.io/AllThingsSmitty/pen/MyqmdM

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
                    <div
                      onClick={header.column.getToggleSortingHandler()}
                      className={cns(
                        header.column.getCanSort() && styles.sortableColumn,
                      )}
                      title={
                        header.column.getCanSort()
                          ? `Ordina per ${header.column.columnDef.header}`
                          : undefined
                      }
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}{" "}
                      {header.column.getCanSort() && sortIcon[sortDirection]}
                    </div>
                    {header.column.getCanFilter() ? (
                      <div className="mt-2">
                        <Filter column={header.column} />
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
          <ButtonLink
            href={createPageURL({page: 1})}
            disabled={!table.getCanPreviousPage()}
            scroll={false}
            title="Vai alla prima pagina"
          >
            <FontAwesomeIcon icon={faBackward} />
          </ButtonLink>
          <ButtonLink
            href={createPageURL({
              page: table.getState().pagination.pageIndex,
            })}
            disabled={!table.getCanPreviousPage()}
            scroll={false}
            title="Vai alla pagina precedente"
          >
            <FontAwesomeIcon icon={faCaretLeft} />
          </ButtonLink>
        </div>
        <div className="hstack gap-2 align-baseline">
          <FormControl
            type="number"
            min={1}
            max={table.getPageCount()}
            onBlur={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            defaultValue={table.getState().pagination.pageIndex + 1}
            className={styles.paginationInput}
          />{" "}
          di {table.getPageCount()}
          <div className="vr" />
          <FormSelect
            className="w-auto"
            id="test"
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            defaultValue={table.getState().pagination.pageSize}
          >
            {[10, 25, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </FormSelect>{" "}
          <FormLabel htmlFor="test">polizze per pagina</FormLabel>
        </div>
        <div className="hstack gap-2 align-baseline">
          <ButtonLink
            href={createPageURL({
              page: table.getState().pagination.pageIndex + 2,
            })}
            disabled={!table.getCanNextPage()}
            scroll={false}
            title="Vai alla prossima pagina"
          >
            <FontAwesomeIcon icon={faCaretRight} />
          </ButtonLink>
          <ButtonLink
            href={createPageURL({page: table.getPageCount()})}
            disabled={!table.getCanNextPage()}
            scroll={false}
            title="Vai all'ultima pagina"
          >
            <FontAwesomeIcon icon={faForward} />
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
