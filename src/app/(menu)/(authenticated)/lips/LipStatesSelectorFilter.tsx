import {TableContext} from "@/ui/table/react-table";
import {FormSelect} from "react-bootstrap";

interface LipStatesSelectorFilterProps {
  filterValue: string;
  setFilterValue: (value: string) => void;
  tableContext: TableContext | undefined;
}

export function LipStatesSelectorFilter({
  filterValue,
  setFilterValue,
  tableContext,
}: LipStatesSelectorFilterProps) {
  if (!tableContext) {
    return (
      <FormSelect size="sm" key="loading">
        <option key="loading">{filterValue || "Tutti"}</option>
      </FormSelect>
    );
  }

  return (
    <FormSelect
      defaultValue={filterValue}
      onChange={(e) => setFilterValue(e.target.value)}
      size="sm"
      aria-label="Filtra per stato"
    >
      <option key="all" value="">
        Tutti
      </option>
      {tableContext.map(({id, label}) => (
        <option key={id} value={label}>
          {label}
        </option>
      ))}
    </FormSelect>
  );
}
