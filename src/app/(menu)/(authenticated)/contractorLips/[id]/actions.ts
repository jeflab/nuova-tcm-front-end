"use server";

import {lipSchema} from "@/models/entities/lip";
import {get} from "@/services/api";

const getLipShape = {
  lip: lipSchema,
};
export async function getLip(id: number) {
  return get(`/lips/${id}`, getLipShape, {tags: ["getLip", `getLip-${id}`]});
}
