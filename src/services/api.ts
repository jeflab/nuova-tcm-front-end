"use server";

import {AUTH_COOKIE_NAME} from "@/app/(no-menu)/(auth)/const";
import {ErrorCodes, errors} from "@/helpers/errors";
import {logFetchInfo} from "@/helpers/fetchDebug";
import {apiUrl, contentJsonHeader} from "@/services/const";
import {serverErrorSchema} from "@/services/helpers";
import chalk from "chalk";
import {cookies} from "next/headers";
import {z, ZodRawShape} from "zod";

export const authorizationHeader = () => {
  const authCookie = cookies().get(AUTH_COOKIE_NAME)?.value;
  return authCookie ? {Authorization: `Bearer ${authCookie}`} : undefined;
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
      ...contentJsonHeader,
      ...authorizationHeader(),
    },
    method: "GET",
    credentials: "include",
  });

  void logFetchInfo(response);

  let responseJson;
  try {
    responseJson = await response.clone().json();
  } catch (e) {
    console.error(
      chalk.red.inverse("Errore di parsing del JSON della risposta del server"),
    );
    console.error(chalk.redBright(e));
    console.error(await response.text());
    return errors[ErrorCodes.INVALID_JSON] as z.infer<typeof serverErrorSchema>;
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
    return errors[ErrorCodes.INVALID_SCHEMA] as z.infer<
      typeof serverErrorSchema
    >;
  }

  return serverResponseJson;
}

export async function post<T extends ZodRawShape>(
  url: string,
  zodRowShape: T,
  body?: string,
) {
  const serverSuccessSchema = createServerSuccessSchema(zodRowShape);

  const response = await fetch(apiUrl + url, {
    headers: {
      ...contentJsonHeader,
      ...authorizationHeader(),
    },
    method: "POST",
    credentials: "include",
    body,
  });

  void logFetchInfo(response, body);

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

  return serverResponseJson;
}
