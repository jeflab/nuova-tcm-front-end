import "@tanstack/react-table";
import {lipStateSchema} from "@/models/entities/lip";

interface FilterComponentProps {
  disabled?: boolean;
  filterValue: string;
  idPrefix?: string;
  setFilterValue: (value: string) => void;
  setFilterValueDebounced: (value: string) => void;
}

type TableContext = z.infer<typeof lipStateSchema>[];

declare module "@tanstack/table-core" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterComponent: (props: FilterComponentProps) => ReactNode;
  }
}
