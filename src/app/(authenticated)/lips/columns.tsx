"use client";

import {
  Lip,
  lipStates,
  LipStatesIcons,
  lipStatesLabels,
} from "@/app/(authenticated)/lips/model";
import {dateString, dbDateString} from "@/app/helpers/date";
import styles from "@/ui/table/DataTable.module.scss";
import {
  faEye,
  faFilterCircleXmark,
  faTrash,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ColumnDef, createColumnHelper} from "@tanstack/react-table";
import {Button, FormControl, FormSelect} from "react-bootstrap";

const columnHelper = createColumnHelper<Lip>();
export const columns = [
  columnHelper.accessor("surname", {
    header: "Cognome",
  }),
  columnHelper.accessor("name", {header: "Nome"}),
  columnHelper.accessor("date", {
    header: "Data",
    cell: (props) => dateString(props.getValue()),
    meta: {
      filterComponent: ({disabled, filterValue, setFilterValueDebounced}) => {
        const [from, to] = filterValue?.split(">") ?? [undefined, undefined];
        return (
          <div className="hstack gap-2">
            <FormControl
              type="date"
              size="sm"
              defaultValue={from && dbDateString(new Date(from))}
              onChange={(event) => {
                setFilterValueDebounced(
                  [event.target.value, to].sort().join(">"),
                );
              }}
              disabled={disabled}
            />
            <FormControl
              type="date"
              size="sm"
              defaultValue={to && dbDateString(new Date(to))}
              onChange={(event) => {
                setFilterValueDebounced(
                  [from, event.target.value].sort().join(">"),
                );
              }}
              disabled={disabled}
            />
          </div>
        );
      },
    },
  }),
  columnHelper.accessor("state", {
    header: "Stato",
    cell: (props) => (
      <>
        {LipStatesIcons[props.getValue()]} {lipStatesLabels[props.getValue()]}
      </>
    ),
    meta: {
      filterComponent: ({filterValue, setFilterValue}) => {
        return (
          <FormSelect
            defaultValue={filterValue}
            onChange={(e) => setFilterValue(e.target.value as Lip["state"])}
            size="sm"
          >
            <option key="all" value="all">
              Tutti
            </option>
            {lipStates.map((state) => (
              <option key={state} value={state}>
                {lipStatesLabels[state]}
              </option>
            ))}
          </FormSelect>
        );
      },
    },
  }),
  columnHelper.display({
    id: "actions",
    header: ({table}) => (
      <Button
        size="sm"
        className="w-100"
        onClick={() => table.resetColumnFilters()}
      >
        <FontAwesomeIcon icon={faFilterCircleXmark} />
        Reset filtri
      </Button>
    ),
    cell: () => (
      <span className={styles.actions}>
        <Button variant="primary" size="sm" className="text-nowrap">
          <FontAwesomeIcon icon={faEye} /> Visualizza
        </Button>{" "}
        <Button variant="danger" size="sm" title="Elimina polizza">
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </span>
    ),
  }),
] as ColumnDef<Lip>[];

// TODO: Facciamo in modo che in skeletonColumns ci siano solo le proprietà che cambiano da columns

export const skeletonColumns = [
  columnHelper.accessor("surname", {
    header: "Cognome",
    cell: () => (
      <span
        className="placeholder"
        style={{width: `${40 + Math.random() * 35}px`}}
      />
    ),
  }),
  columnHelper.accessor("name", {
    header: "Nome",
    cell: () => (
      <span
        className="placeholder"
        style={{width: `${40 + Math.random() * 35}px`}}
      />
    ),
  }),
  columnHelper.accessor("date", {
    header: "Data",
    cell: () => (
      <span
        className="placeholder"
        style={{width: `${100 + Math.random() * 30}px`}}
      />
    ),
    meta: {
      filterComponent: ({disabled, filterValue}) => {
        const [from, to] = filterValue?.split(">") ?? [undefined, undefined];
        return (
          <div className="hstack gap-2">
            <FormControl
              type="date"
              size="sm"
              defaultValue={from && dbDateString(new Date(from))}
              disabled={disabled}
            />
            <FormControl
              type="date"
              size="sm"
              defaultValue={to && dbDateString(new Date(to))}
              disabled={disabled}
            />
          </div>
        );
      },
    },
  }),
  columnHelper.accessor("state", {
    header: "Stato",
    cell: () => (
      <>
        <span className="placeholder rounded-circle" style={{width: "1em"}} />{" "}
        <span
          className="placeholder"
          style={{width: `${45 + Math.random() * 115}px`}}
        />
      </>
    ),
    meta: {
      filterComponent: ({disabled, filterValue, setFilterValue}) => {
        return (
          <FormSelect
            defaultValue={filterValue}
            disabled={disabled}
            onChange={(e) => setFilterValue(e.target.value as Lip["state"])}
            size="sm"
          >
            <option key="all" value="all">
              Tutti
            </option>
            {lipStates.map((state) => (
              <option key={state} value={state}>
                {lipStatesLabels[state]}
              </option>
            ))}
          </FormSelect>
        );
      },
    },
  }),
  columnHelper.display({
    id: "actions",
    header: () => (
      <Button size="sm" className="w-100 disabled placeholder">
        <FontAwesomeIcon icon={faFilterCircleXmark} />
        Reset filtri
      </Button>
    ),
    cell: () => (
      <span className={styles.actions}>
        <Button
          variant="primary"
          size="sm"
          className="text-nowrap disabled placeholder"
        >
          <FontAwesomeIcon icon={faEye} /> Visualizza
        </Button>{" "}
        <Button
          variant="danger"
          size="sm"
          title="Elimina polizza"
          className="disabled placeholder"
        >
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </span>
    ),
  }),
] as ColumnDef<Lip>[];
