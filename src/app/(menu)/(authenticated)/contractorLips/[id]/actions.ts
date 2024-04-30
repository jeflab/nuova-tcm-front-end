"use server";

import {lipSchema} from "@/models/entities/lip";
import {get} from "@/services/api";
import {Tags} from "@/services/const";

const getLipShape = {
  lip: lipSchema,
};
export async function getLip(id: number) {
  return get(`/contractor-lips/${id}`, {
    payloadShape: getLipShape,
    tags: [Tags.getLip(id)],
  });
}
