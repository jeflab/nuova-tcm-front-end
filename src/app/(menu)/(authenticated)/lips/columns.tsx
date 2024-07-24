"use client";

import {Lip, LipStatesIcons} from "@/models/entities/lip";
import {cns} from "@/helpers/cns";
import {dateString, dbDateString} from "@/helpers/dates";
import {ButtonLink} from "@/ui/ButtonLink";
import dataTableStyles from "@/ui/table/DataTable.module.scss";
import {faEye, faFilterCircleXmark} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ColumnDef, createColumnHelper} from "@tanstack/react-table";
import {Button, FormControl, FormSelect, Placeholder} from "react-bootstrap";

// TODO: trovare il modo di prenderli dal backend
const lipStates = [
  {id: 1, label: "Incompleta"},
  {id: 2, label: "Underwriting"},
  {id: 3, label: "Completa"},
  {id: 4, label: "Approvata dal broker"},
  {id: 5, label: "Primo pagamento confermato"},
  {id: 6, label: "Approvazione dal MasterBroker"},
  {id: 7, label: "Inviata in compagnia"},
  {id: 8, label: "Rifiutata"},
  {id: 9, label: "Accettata"},
  {id: 10, label: "Non approvata dal broker"},
  {id: 11, label: "Non approvata dal Master Broker a livello finanziario"},
  {id: 12, label: "Non approvata dal Master Broker a livello qualitativo"},
  {id: 13, label: "Bloccata per AML"},
  {id: 14, label: "Approvata dopo revisione underwriting sanitario"},
  {id: 15, label: "Non approvata dopo revisione underwriting sanitario"},
];

const columnHelper = createColumnHelper<Lip>();
export const columns = [
  columnHelper.accessor("lipNumber", {
    header: "Numero proposta",
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
  columnHelper.accessor("lipStates", {
    header: "Stato",
    enableColumnFilter: true,
    cell: (props) => (
      <>
        {LipStatesIcons[props.getValue().id] ?? LipStatesIcons[0]}{" "}
        {props.getValue().label}
      </>
    ),
    meta: {
      filterComponent: ({filterValue, setFilterValue}) => {
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
            {lipStates.map(({id, label}) => (
              <option key={id} value={id}>
                {label}
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
            onChange={(e) => setFilterValue(e.target.value)}
            size="sm"
            aria-label="Filtra per stato"
          >
            <option key="all" value="all">
              Tutti
            </option>
            {lipStates.map(({id, label}) => (
              <option key={id} value={id}>
                {label}
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
      <Placeholder as="div" animation="glow">
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
