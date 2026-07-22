"use client";

import {cns} from "@/helpers/cns";
import {ButtonLink} from "@/ui/ButtonLink";
import {CardCollapsable} from "@/ui/CardCollapsable";
import {Filter} from "@/ui/table/Filter";
import {TableContext} from "@/ui/table/react-table";
import {
  faArrowDownShortWide,
  faArrowUpWideShort,
  faBackward,
  faCaretLeft,
  faCaretRight,
  faFilterCircleXmark,
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
import {Fragment, ReactNode} from "react";
import {
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  FormSelect,
  Table,
} from "react-bootstrap";
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
import responsiveStyles from "./ResponsiveTable.module.scss";
import {Route} from "next";

interface DataTableProps<Row extends RowData> {
  columns: ColumnDef<Row>[];
  data: Row[];
  pageCount: number;
  searchParams: DataTableParams;
  contextValue?: TableContext;
  isFetching?: boolean;
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
  contextValue,
  isFetching,
}: DataTableProps<Row>) {
  const pathname = usePathname() as Route;
  const router = useRouter();

  const mobileReset = () => {
    const newPath = createPageURL({
      page: undefined,
      sorting: undefined,
      columnFilters: undefined,
    });

    router.push(newPath, {scroll: false});
  };

  const table = useReactTable({
    data,
    columns,
    manualSorting: true,
    manualPagination: true,
    manualFiltering: true,
    enableColumnFilters: true,
    enableSorting: true,
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
    }` as Route;
  };

  const getActiveFilterCount = () => {
    const count = table.getState().columnFilters.length;
    const defaultSorting = dataTableParamsSchema.shape.sorting.parse(undefined);
    const sorting = sortingObjectToString(table.getState().sorting);

    return count + (sorting !== defaultSorting ? 1 : 0);
  };

  return (
    <>
      <CardCollapsable
        className={responsiveStyles.filterPanel}
        header={
          <div className="d-flex justify-content-between align-items-center">
            <span>
              Filtri
              {getActiveFilterCount() > 0 && ` (${getActiveFilterCount()})`}
            </span>
            <Button
              size="sm"
              onClick={(event) => {
                event.stopPropagation();
                mobileReset();
              }}
              hidden={getActiveFilterCount() === 0}
              // className="ms-auto"
            >
              <FontAwesomeIcon icon={faFilterCircleXmark} />
              Reset filtri
            </Button>
          </div>
        }
      >
        <FormGroup className="mb-3" controlId="mobile-order-by">
          <FormLabel>Ordina per</FormLabel>
          <FormSelect
            size="sm"
            onChange={(event) => {
              table.setSorting(sortingStringToObject(event.target.value));
            }}
            defaultValue={sortingObjectToString(table.getState().sorting)}
          >
            {table.getFlatHeaders().map((header) => {
              return header.column.getCanSort() ? (
                <Fragment key={header.id}>
                  <option value={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}{" "}
                    crescente
                  </option>
                  <option value={"-" + header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}{" "}
                    decrescente
                  </option>
                </Fragment>
              ) : null;
            })}
          </FormSelect>
        </FormGroup>
        <FormLabel>Filtra per</FormLabel>
        {table.getFlatHeaders().map((header) => {
          return header.column.getCanFilter() ? (
            <FormGroup
              key={header.id}
              className="mb-3"
              controlId={`mobile-filter-${header.id}`}
            >
              <FormLabel>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </FormLabel>
              <div className="mt-2">
                <Filter
                  column={header.column}
                  idPrefix="mobile"
                  tableContext={contextValue}
                />
              </div>
            </FormGroup>
          ) : null;
        })}
        <Button
          size="sm"
          onClick={() => {
            mobileReset();
          }}
        >
          <FontAwesomeIcon icon={faFilterCircleXmark} />
          Reset filtri
        </Button>
      </CardCollapsable>
      <Table
        hover
        striped
        bordered
        responsive
        className={cns(
          responsiveStyles.responsiveTableWrapper,
          "mb-0 align-middle",
          isFetching && styles.tableFetching,
        )}
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
                      "align-top",
                    )}
                  >
                    <div
                      onClick={header.column.getToggleSortingHandler()}
                      className={cns(
                        "text-nowrap",
                        header.column.getCanSort() && styles.sortableColumn,
                      )}
                      title={
                        header.column.getCanSort()
                          ? `Ordina per ${String(header.column.columnDef.header)}`
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
                        <Filter
                          column={header.column}
                          tableContext={contextValue}
                        />
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
            <tr key={row.id} className={styles.rowStopStretching}>
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
        <div className={styles.paginationControls}>
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
            aria-label="Vai alla pagina"
          />
          <span>di {table.getPageCount()}</span>
          <div className="vr" />
          <FormSelect
            className={styles.paginationSelect}
            id="chose-page"
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
          <FormLabel htmlFor="chose-page">polizze per pagina</FormLabel>
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
