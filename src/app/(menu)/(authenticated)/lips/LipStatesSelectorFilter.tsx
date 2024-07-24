import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {FormSelect} from "react-bootstrap";

interface LipStatesSelectorFilterProps {
  filterValue: string;
  setFilterValue: (value: string) => void;
}

export function LipStatesSelectorFilter({
  filterValue,
  setFilterValue,
}: LipStatesSelectorFilterProps) {
  const lipStates = useDrawerStore((state) => state.tableContext);

  if (!lipStates) {
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
      {lipStates?.map(({id, label}) => (
        <option key={id} value={label}>
          {label}
        </option>
      ))}
    </FormSelect>
  );
}
