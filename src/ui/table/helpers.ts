import {ColumnFiltersState, SortingState} from "@tanstack/react-table";
import {z} from "zod";

export const dataTableParamsSchema = z.object({
  query: z.string().optional().default(""),
  page: z.coerce.number().int().positive().catch(1),
  perPage: z.coerce.number().int().positive().catch(25),
  sorting: z.string().optional().default("-createdAt"),
  columnFilters: z.string().optional().default(""),
});
export const defaultDataTableParams = dataTableParamsSchema.parse({});
export type DataTableParams = z.infer<typeof dataTableParamsSchema>;
export type DataTableParamsInput = z.input<typeof dataTableParamsSchema>;

export function sortingObjectToString(sorting: SortingState): string {
  return sorting
    .map(({id, desc}) => {
      return `${desc ? "-" : ""}${id}`;
    })
    .join(",");
}

export function sortingStringToObject<Type extends Record<string, unknown>>(
  sorting: string,
) {
  return sorting.split(",").map((sort) => {
    const desc = sort.startsWith("-");
    const id = (desc ? sort.slice(1) : sort) as Extract<keyof Type, string>;
    return {id, desc};
  });
}

export function columnFiltersObjectToString(columnFilters: ColumnFiltersState) {
  return columnFilters
    .map(({id, value}) => {
      return `${id}:${String(value)}`;
    })
    .join(",");
}

export function columnFiltersStringToObject<
  Type extends Record<string, unknown>,
>(columnFilters: string) {
  return columnFilters
    .split(",")
    .filter((columnFilter) => Boolean(columnFilter))
    .map((columnFilter) => {
      const [id, value] = columnFilter.split(":") as [
        Extract<keyof Type, string>,
        string,
      ];
      return {id, value};
    });
}
