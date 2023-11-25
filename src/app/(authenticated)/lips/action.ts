"use server";

import {standard} from "@/app/(authenticated)/lips/mock";

interface GetLipsListOptions {
  query?: string;
  page?: number;
  perPage?: number;
  orderBy?: string;
}

const defaultOptions = {
  query: "",
  page: 1,
  perPage: 25,
  orderBy: "-date",
} as const;

export async function getLipsList(options: GetLipsListOptions) {
  const {query, page, perPage} = {...defaultOptions, ...options};
  const offset = (page - 1) * perPage;

  const lips = standard()
    .lips.filter((lip) => {
      if (query.length === 0) {
        return true;
      }
      return lip.name.toLowerCase().includes(query.toLowerCase());
    })
    .slice(offset, offset + perPage);

  return await Promise.resolve(lips);
}
