"use server";

import {standard} from "@/app/(authenticated)/lips/mock";
import {Lip, lipSchema} from "./model";
import {z} from "zod";
import {sortingStringToObject} from "@/ui/table/helpers";

interface GetLipsListOptions {
  query: string;
  page: number;
  perPage: number;
  sorting: string;
}

const getLipsSchema = z.object({
  pageCount: z.number(),
  lips: z.array(lipSchema),
});

export async function getLipsList({
  query,
  page,
  perPage,
  sorting,
}: GetLipsListOptions) {
  const offset = (page - 1) * perPage;
  const sortingRules = sortingStringToObject<Lip>(sorting);

  // Fingiamo di ricevere i dati dal server
  const lips = standard()
    .lips.filter((lip) => {
      if (query.length === 0) {
        return true;
      }
      return lip.name.toLowerCase().includes(query.toLowerCase());
    })
    .sort((a, b) => {
      for (const {id, desc} of sortingRules) {
        if (a[id] < b[id]) {
          return desc ? 1 : -1;
        }
        if (a[id] > b[id]) {
          return desc ? -1 : 1;
        }
      }
      return 0;
    })
    .slice(offset, offset + perPage);
  const pageCount = Math.ceil(standard().lips.length / perPage);

  const response = getLipsSchema.parse({lips, pageCount});

  return new Promise<z.infer<typeof getLipsSchema>>((resolve) => {
    setTimeout(() => {
      resolve(response);
    }, 3000);
  });
}
