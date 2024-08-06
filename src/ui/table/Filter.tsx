import {TableContext} from "@/ui/table/react-table";
import {Column} from "@tanstack/table-core";
import useDebouncedCallback from "beautiful-react-hooks/useDebouncedCallback";
import {ReactNode} from "react";
import {FormControl} from "react-bootstrap";

interface DefaultFilterComponentProps {
  ariaLabel: string;
  disabled?: boolean;
  filterValue: string;
  setFilterValueDebounced: (value: string) => void;
}

function DefaultFilterComponent({
  ariaLabel,
  disabled,
  filterValue,
  setFilterValueDebounced,
}: DefaultFilterComponentProps) {
  return (
    <FormControl
      type="text"
      size="sm"
      defaultValue={filterValue}
      onChange={(event) => setFilterValueDebounced(event.target.value)}
      disabled={disabled}
      aria-label={ariaLabel}
    />
  );
}

interface FilterProps<Row> {
  column: Column<Row>;
  disabled?: boolean;
  idPrefix?: string;
  tableContext?: TableContext;
}

export function Filter<Row>({
  column,
  disabled,
  idPrefix,
  tableContext,
}: FilterProps<Row>) {
  const filterValue = column.getFilterValue() as string;

  const setFilterValueDebounced = useDebouncedCallback(
    (value: string) => {
      column.setFilterValue(value);
    },
    [column],
  );

  const setFilterValue = (value: string) => {
    column.setFilterValue(value);
  };

  if (column.columnDef.meta?.filterComponent) {
    return column.columnDef.meta.filterComponent({
      disabled,
      filterValue,
      idPrefix,
      setFilterValue,
      setFilterValueDebounced,
      tableContext,
    }) as ReactNode;
  }

  return (
    <DefaultFilterComponent
      ariaLabel={`Filtra per ${String(column.columnDef.header)}`}
      disabled={disabled}
      filterValue={filterValue}
      setFilterValueDebounced={setFilterValueDebounced}
    />
  );
}
