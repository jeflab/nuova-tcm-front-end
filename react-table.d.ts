import "@tanstack/react-table";

interface FilterComponentProps {
  disabled?: boolean;
  filterValue: string;
  setFilterValue: (value: string) => void;
  setFilterValueDebounced: (value: string) => void;
}

declare module "@tanstack/table-core" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterComponent: (props: FilterComponentProps) => ReactNode;
  }
}
