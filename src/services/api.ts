"use server";

import {serverErrorSchema} from "@/services/helpers";
import chalk from "chalk";
import {z, ZodRawShape} from "zod";

const apiUrl = "http://127.0.0.1:8000/api";
const contentJson = {
  "Content-Type": "application/json",
};

const createServerSuccessSchema = <T extends ZodRawShape>(successSchema: T) =>
  z
    .object({
      status: z.literal("success"),
    })
    .extend(successSchema);

function isServerSuccess<T extends ZodRawShape>(
  json: unknown,
  zodRowShape: T,
): json is z.infer<typeof serverSuccessSchema> {
  const serverSuccessSchema = createServerSuccessSchema(zodRowShape);

  return (
    "status" in (json as z.infer<typeof serverErrorSchema>) &&
    (json as z.infer<typeof serverSuccessSchema>).status === "success"
  );
}

export async function get<T extends ZodRawShape>(url: string, zodRowShape: T) {
  const serverSuccessSchema = createServerSuccessSchema(zodRowShape);

  const response = await fetch(apiUrl + url, {
    headers: {
      ...contentJson,
    },
    method: "GET",
    credentials: "include",
  });

  let responseJson;
  try {
    responseJson = await response.clone().json();
  } catch (e) {
    console.error(e);
    console.error(await response.text());
    throw {status: "failed", message: "Errore imprevisto, riprova più tardi"};
  }

  const serverResponseJson = z
    .union([serverSuccessSchema, serverErrorSchema])
    .parse(responseJson);

  if (isServerSuccess(serverResponseJson, zodRowShape)) {
    return serverResponseJson;
  } else {
    throw serverResponseJson;
  }
}

export async function post<T extends ZodRawShape>(
  url: string,
  zodRowShape: T,
  body: string,
) {
  const serverSuccessSchema = createServerSuccessSchema(zodRowShape);

  const response = await fetch(apiUrl + url, {
    headers: {
      ...contentJson,
    },
    method: "POST",
    credentials: "include",
    body,
  });

  let responseJson;
  try {
    responseJson = await response.clone().json();
  } catch (e) {
    console.error(
      chalk.red.inverse("Errore di parsing del JSON della risposta del server"),
    );
    console.error(chalk.redBright(e));
    console.error(await response.text());
    throw {status: "failed", message: "Errore imprevisto, riprova più tardi"};
  }

  let serverResponseJson;
  try {
    serverResponseJson = z
      .union([serverSuccessSchema, serverErrorSchema])
      .parse(responseJson);
  } catch (e) {
    console.error(
      chalk.red.inverse(
        "Errore di parsing dello schema della risposta del server",
      ),
    );
    console.error(chalk.redBright(e));
    console.error(await response.text());
    throw {status: "failed", message: "Errore imprevisto, riprova più tardi"};
  }

  if (isServerSuccess(serverResponseJson, zodRowShape)) {
    return serverResponseJson;
  } else {
    throw serverResponseJson;
  }
}
