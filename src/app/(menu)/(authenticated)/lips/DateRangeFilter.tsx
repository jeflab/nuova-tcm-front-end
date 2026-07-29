import {dbDateString} from "@/helpers/dates";
import {useSyncedState} from "@/helpers/useSyncedState";
import {FormControl} from "react-bootstrap";

interface DateRangeFilterProps {
  disabled?: boolean;
  filterValue: string;
  idPrefix?: string;
  setFilterValue: (value: string) => void;
}

function splitDateRange(range: string) {
  const [from, to] = range.split(">");

  return {
    from: from ? dbDateString(new Date(from)) : "",
    to: to ? dbDateString(new Date(to)) : "",
  };
}

function joinDateRange(from: string, to: string) {
  if (from && to) {
    return [from, to].sort().join(">");
  }
  if (from) {
    return `${from}>`;
  }
  if (to) {
    return `>${to}`;
  }

  return "";
}

export function DateRangeFilter({
  disabled,
  filterValue,
  idPrefix,
  setFilterValue,
}: DateRangeFilterProps) {
  const [range, setRange] = useSyncedState(filterValue);
  const {from, to} = splitDateRange(range);

  return (
    <div className="hstack gap-2 date-filter">
      <FormControl
        type="date"
        size="sm"
        value={from}
        onChange={(event) => setRange(joinDateRange(event.target.value, to))}
        onBlur={() => setFilterValue(range)}
        disabled={disabled}
        aria-label="Filtra per data di inizio"
      />
      <FormControl
        type="date"
        size="sm"
        value={to}
        onChange={(event) => setRange(joinDateRange(from, event.target.value))}
        onBlur={() => setFilterValue(range)}
        disabled={disabled}
        aria-label="Filtra per data di fine"
        id={`${idPrefix ? `${idPrefix}-` : ""}filter-date-end`}
      />
    </div>
  );
}
