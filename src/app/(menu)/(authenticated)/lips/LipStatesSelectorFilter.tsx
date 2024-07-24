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
        <option key={id} value={id}>
          {label}
        </option>
      ))}
    </FormSelect>
  );
}
