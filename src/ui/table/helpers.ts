import {ColumnFiltersState, SortingState} from "@tanstack/react-table";
import {z} from "zod";

export const dataTableParamsSchema = z.object({
  query: z.string().optional().default(""),
  page: z.coerce.number().int().positive().catch(1),
  perPage: z.coerce.number().int().positive().catch(25),
  sorting: z.string().optional().default("-date"),
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

export function sortingStringToObject<Type extends {[Key: string]: unknown}>(
  sorting: string,
) {
  return sorting.split(",").map((sort) => {
    const desc = sort.startsWith("-");
    const id = (desc ? sort.slice(1) : sort) as Extract<keyof Type, string>;
    return {id, desc};
  });
}

export function filtersObjectToString(filters: ColumnFiltersState) {
  return Object.entries(filters)
    .map(([key, value]) => {
      return `${key}:${value}`;
    })
    .join(",");
}

export function filtersStringToObject(filters: string) {
  return Object.fromEntries(
    filters.split(",").map((filter) => {
      const [key, value] = filter.split(":");
      return [key, value];
    }),
  );
}
