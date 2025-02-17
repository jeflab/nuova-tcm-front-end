import "@tanstack/react-table";
import {LipState} from "@/models/entities/lip";

interface FilterComponentProps {
  disabled?: boolean;
  filterValue: string;
  idPrefix?: string;
  setFilterValue: (value: string) => void;
  setFilterValueDebounced: (value: string) => void;
  tableContext?: TableContext;
}

type TableContext = LipState[];

declare module "@tanstack/table-core" {
  interface ColumnMeta {
    filterComponent: (props: FilterComponentProps) => ReactNode;
  }
}
