"use client";

import {LipStatesSelectorFilter} from "@/app/(menu)/(authenticated)/lips/LipStatesSelectorFilter";
import {cns} from "@/helpers/cns";
import {dateString, dbDateString} from "@/helpers/dates";
import {Lip} from "@/models/entities/lip";
import {ButtonLink} from "@/ui/ButtonLink";
import {LipStateBadge, LipStateBadgeSkeleton} from "@/ui/LipStateBadge";
import dataTableStyles from "@/ui/table/DataTable.module.scss";
import {
  faEye,
  faFilterCircleXmark,
  faUser,
  faUserGroupSimple,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ColumnDef, createColumnHelper} from "@tanstack/react-table";
import {Button, FormControl, FormSelect, Placeholder} from "react-bootstrap";
import styles from "@/ui/table/DataTable.module.scss";

const columnHelper = createColumnHelper<Lip>();
export const columns = [
  columnHelper.accessor("lipNumber", {
    header: "Numero proposta",
    cell: (props) => {
      const lipType = props.row.original.type;
      return (
        <>
          <FontAwesomeIcon
            icon={lipType === "self-insured" ? faUser : faUserGroupSimple}
            fixedWidth
            className={cns("cursor-help", styles.rowOtherLink)}
            title={
              lipType === "self-insured"
                ? "Il Contraente e l'Assicurato coincidono"
                : "Il Contraente è diverso dall'Assicurato"
            }
          />{" "}
          {props.getValue()}
        </>
      );
    },
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
      filterComponent: ({disabled, filterValue, idPrefix, setFilterValue}) => {
        const [from, to] = filterValue?.split(">") ?? [undefined, undefined];
        return (
          <div className="hstack gap-2 date-filter">
            <FormControl
              type="date"
              size="sm"
              defaultValue={from && dbDateString(new Date(from))}
              onBlur={(event) => {
                setFilterValue(
                  to
                    ? [event.target.value, to].sort().join(">")
                    : `${event.target.value}>`,
                );
              }}
              disabled={disabled}
              aria-label="Filtra per data di inizio"
            />
            <FormControl
              type="date"
              size="sm"
              defaultValue={to && dbDateString(new Date(to))}
              onBlur={(event) => {
                setFilterValue(
                  from
                    ? [from, event.target.value].sort().join(">")
                    : `>${event.target.value}`,
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
  columnHelper.accessor("lipStates", {
    header: "Stato",
    enableColumnFilter: true,
    cell: (props) => <LipStateBadge lipState={props.getValue()} />,
    meta: {
      filterComponent: ({filterValue, setFilterValue, tableContext}) => {
        return (
          <LipStatesSelectorFilter
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            tableContext={tableContext}
          />
        );
      },
    },
  }),
  columnHelper.display({
    id: "actions",
    header: ({table}) => (
      <Button
        size="sm"
        className="w-100 text-nowrap"
        onClick={() => table.resetColumnFilters()}
      >
        <FontAwesomeIcon icon={faFilterCircleXmark} className="me-2" />
        Reset filtri
      </Button>
    ),
    cell: ({row}) => (
      <span className={dataTableStyles.actions}>
        <ButtonLink
          variant="primary"
          size="sm"
          href={`/lips/${row.original.id}`}
          className={cns("w-100 text-nowrap", dataTableStyles.rowDefaultLink)}
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
    header: "Numero proposta",
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
    header: "Contraente",
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
  columnHelper.accessor("lipStates", {
    header: "Stato",
    enableColumnFilter: true,
    cell: () => <LipStateBadgeSkeleton />,
    meta: {
      filterComponent: ({disabled, filterValue}) => {
        return (
          <FormSelect
            defaultValue={filterValue}
            disabled={disabled}
            size="sm"
            aria-label="Filtra per stato"
          >
            <option key="all" value="">
              {filterValue || "Tutti"}
            </option>
          </FormSelect>
        );
      },
    },
  }),
  columnHelper.display({
    id: "actions",
    header: () => (
      <Placeholder as="div" animation="glow">
        <Button size="sm" className="w-100 text-nowrap disabled placeholder">
          <FontAwesomeIcon icon={faFilterCircleXmark} className="me-2" />
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
          className="w-100 text-nowrap disabled placeholder"
        >
          <FontAwesomeIcon icon={faEye} /> Visualizza
        </Button>
      </Placeholder>
    ),
  }),
] as ColumnDef<Lip>[];
