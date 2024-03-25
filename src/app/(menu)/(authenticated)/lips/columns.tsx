"use client";

import {
  Lip,
  lipStatuses,
  LipStatusesIcons,
  lipStatusesLabels,
} from "@/models/entities/lip";
import {cns} from "@/helpers/cns";
import {dateString, dbDateString} from "@/helpers/dates";
import {ButtonLink} from "@/ui/ButtonLink";
import dataTableStyles from "@/ui/table/DataTable.module.scss";
import {faEye, faFilterCircleXmark} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ColumnDef, createColumnHelper} from "@tanstack/react-table";
import {Button, FormControl, FormSelect, Placeholder} from "react-bootstrap";

const columnHelper = createColumnHelper<Lip>();
export const columns = [
  columnHelper.accessor("lipNumber", {
    header: "Numero",
  }),
  columnHelper.accessor((row) => `${row.agent.surname} ${row.agent.name}`, {
    id: "agent",
    header: "Agente",
  }),
  columnHelper.accessor(
    (row) => `${row.contractor.surname} ${row.contractor.name}`,
    {
      id: "contractor",
      header: "Contraente",
    },
  ),
  columnHelper.accessor("createdAt", {
    header: "Data",
    cell: (props) => dateString(props.getValue()),
    meta: {
      filterComponent: ({
        disabled,
        filterValue,
        idPrefix,
        setFilterValueDebounced,
      }) => {
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
              aria-label="Filtra per data di inizio"
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
              aria-label="Filtra per data di fine"
              id={`${idPrefix ? `${idPrefix}-` : ""}filter-date-end`}
            />
          </div>
        );
      },
    },
  }),
  columnHelper.accessor("status", {
    header: "Stato",
    cell: (props) => (
      <>
        {LipStatusesIcons[props.getValue()]}{" "}
        {lipStatusesLabels[props.getValue()]}
      </>
    ),
    meta: {
      filterComponent: ({filterValue, setFilterValue}) => {
        return (
          <FormSelect
            defaultValue={filterValue}
            onChange={(e) => setFilterValue(e.target.value as Lip["status"])}
            size="sm"
            aria-label="Filtra per stato"
          >
            <option key="all" value="all">
              Tutti
            </option>
            {lipStatuses.map((status) => (
              <option key={status} value={status}>
                {lipStatusesLabels[status]}
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
        className="w-100 d-none" // TODO: filtri disabilitati temporaneamente aspettando il backend
        onClick={() => table.resetColumnFilters()}
      >
        <FontAwesomeIcon icon={faFilterCircleXmark} />
        Reset filtri3
      </Button>
    ),
    cell: ({row}) => (
      <span className={dataTableStyles.actions}>
        <ButtonLink
          variant="primary"
          size="sm"
          href={`/lips/${row.original.id}`}
          className={cns("text-nowrap", dataTableStyles.rowDefaultLink)}
        >
          <FontAwesomeIcon icon={faEye} /> Visualizza
        </ButtonLink>
      </span>
    ),
  }),
] as ColumnDef<Lip>[];

// TODO: Facciamo in modo che in skeletonColumns ci siano solo le proprietà che cambiano da columns
export const skeletonColumns = [
  columnHelper.accessor("lipNumber", {
    header: "Numero polizza",
    cell: () => (
      <Placeholder as="span" animation="glow">
        <Placeholder as="span" style={{width: `84px`}} />
      </Placeholder>
    ),
  }),
  columnHelper.accessor("agent", {
    header: "Agente",
    id: "agent",
    cell: () => (
      <Placeholder as="span" animation="glow">
        <Placeholder
          as="span"
          style={{width: `${40 + Math.random() * 35}px`}}
        />{" "}
        <Placeholder
          as="span"
          style={{width: `${40 + Math.random() * 35}px`}}
        />
      </Placeholder>
    ),
  }),
  columnHelper.accessor("contractor", {
    header: "Cliente",
    id: "contractor",
    cell: () => (
      <Placeholder as="span" animation="glow">
        <Placeholder
          as="span"
          style={{width: `${40 + Math.random() * 35}px`}}
        />{" "}
        <Placeholder
          as="span"
          style={{width: `${40 + Math.random() * 35}px`}}
        />
      </Placeholder>
    ),
  }),
  columnHelper.accessor("createdAt", {
    header: "Data",
    cell: () => (
      <Placeholder as="span" animation="glow">
        <Placeholder
          as="span"
          style={{width: `${100 + Math.random() * 30}px`}}
        />
      </Placeholder>
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
              aria-label="Filtra per data di inizio"
            />
            <FormControl
              type="date"
              size="sm"
              defaultValue={to && dbDateString(new Date(to))}
              disabled={disabled}
              aria-label="Filtra per data di fine"
            />
          </div>
        );
      },
    },
  }),
  columnHelper.accessor("status", {
    header: "Stato",
    cell: () => (
      <>
        <Placeholder as="span" animation="glow">
          <Placeholder
            as="span"
            className="rounded-circle"
            style={{width: "1em"}}
          />{" "}
          <Placeholder
            as="span"
            style={{width: `${45 + Math.random() * 115}px`}}
          />
        </Placeholder>
      </>
    ),
    meta: {
      filterComponent: ({disabled, filterValue, setFilterValue}) => {
        return (
          <FormSelect
            defaultValue={filterValue}
            disabled={disabled}
            onChange={(e) => setFilterValue(e.target.value as Lip["status"])}
            size="sm"
            aria-label="Filtra per stato"
          >
            <option key="all" value="all">
              Tutti
            </option>
            {lipStatuses.map((status) => (
              <option key={status} value={status}>
                {lipStatusesLabels[status]}
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
      <Placeholder as="div" animation="glow" className="d-none">
        {/*TODO: filtri disabilitati temporaneamente aspettando il backend*/}
        <Button size="sm" className="w-100 disabled placeholder">
          <FontAwesomeIcon icon={faFilterCircleXmark} />
          Reset filtri
        </Button>
      </Placeholder>
    ),
    cell: () => (
      <Placeholder
        as="span"
        animation="glow"
        className={dataTableStyles.actions}
      >
        <Button
          variant="primary"
          size="sm"
          className="text-nowrap disabled placeholder"
        >
          <FontAwesomeIcon icon={faEye} /> Visualizza
        </Button>
      </Placeholder>
    ),
  }),
] as ColumnDef<Lip>[];
