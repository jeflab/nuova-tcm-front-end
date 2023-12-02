import {Column} from "@tanstack/table-core";
import {FormControl} from "react-bootstrap";
import useDebouncedCallback from "beautiful-react-hooks/useDebouncedCallback";

interface DefaultFilterComponentProps {
  disabled?: boolean;
  filterValue: string;
  setFilterValueDebounced: (value: string) => void;
}

function DefaultFilterComponent({
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
    />
  );
}

interface FilterProps<Row> {
  column: Column<Row>;
  disabled?: boolean;
}

export function Filter<Row>({column, disabled}: FilterProps<Row>) {
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
      setFilterValue,
      setFilterValueDebounced,
    });
  }

  return (
    <DefaultFilterComponent
      disabled={disabled}
      filterValue={filterValue}
      setFilterValueDebounced={setFilterValueDebounced}
    />
  );
}
