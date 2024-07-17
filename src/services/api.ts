"use server";

import {AUTH_COOKIE_NAME} from "@/app/(no-menu)/(auth)/const";
import {ErrorCodes, errors} from "@/helpers/errors";
import {logFetchInfo, unrollFetchData} from "@/helpers/fetchDebug";
import {
  acceptJsonHeader,
  apiUrl,
  contentJsonHeader,
  Tag,
} from "@/services/const";
import {
  createServerSuccessSchema,
  invalidateTag,
  serverErrorSchema,
} from "@/services/helpers";
import chalk from "chalk";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {z, ZodRawShape} from "zod";

function authorizationHeader() {
  const authCookie = cookies().get(AUTH_COOKIE_NAME)?.value;
  return authCookie ? {Authorization: `Bearer ${authCookie}`} : undefined;
}

function parseLaravelErrorPage(text: string) {
  let ok = false;
  let noScript = "";
  const noScriptMatch = text.match(/<noscript>(.+)<\/noscript>/gi);
  let title = "";
  const titleMatch = text.match(/<title>(.+)<\/title>/gi);

  if (titleMatch) {
    ok = true;
    title = titleMatch[0].trim();
  }
  if (noScriptMatch) {
    ok = true;
    noScript = noScriptMatch[0].trim();
  }

  if (ok) {
    return {noScript, title};
  } else {
    return false;
  }
}

// TODO: se ottengo un 403 ma risulto loggato facciamo logout automatico oppure dobbiamo fare una pagina per scalare i permessi

interface ApiCallOptions<ResponsePayloadShape extends ZodRawShape> {
  payloadShape?: ResponsePayloadShape;
  data?: object | FormData;
  searchParams?: Record<string, string>;
  tags?: Tag[];
}
export async function apiCall<ResponsePayloadShape extends ZodRawShape>(
  method: "GET" | "POST" | "PUT" | "PATCH",
  url: `/${string}`,
  {
    payloadShape,
    data,
    searchParams,
    tags,
  }: ApiCallOptions<ResponsePayloadShape>,
) {
  const payloadShapeOrDefault: ResponsePayloadShape =
    payloadShape ?? ({} as ResponsePayloadShape);
  const body = data instanceof FormData ? data : JSON.stringify(data);
  const searchParamsString = searchParams
    ? "?" + new URLSearchParams(searchParams).toString()
    : "";
  const serverSuccessSchema = createServerSuccessSchema(payloadShapeOrDefault);
  const headers =
    data instanceof FormData
      ? {
          ...authorizationHeader(),
        }
      : {
          ...authorizationHeader(),
          ...acceptJsonHeader,
          ...contentJsonHeader,
        };

  let response: Response;
  try {
    response = await fetch(apiUrl + url + searchParamsString, {
      credentials: "include",
      headers,
      method,
      body,
      ...(tags ? {tags} : {}),
    });

    void logFetchInfo(method, response, data);
  } catch (e) {
    console.error(chalk.red.inverse("Errore di rete"));
    console.error(
      chalk.italic.bold("Chiamata API:"),
      chalk.cyanBright(method),
      chalk.greenBright(apiUrl + url + searchParamsString),
    );
    console.error(unrollFetchData(data));
    console.error(chalk.redBright(e));
    return errors[ErrorCodes.FETCH_ERROR] as z.infer<typeof serverErrorSchema>;
  }

  let responseJson;
  try {
    responseJson = await response.clone().json();
    responseJson.responseStatus = response.status;
    responseJson.status = responseJson.status ?? "failed";
  } catch (e) {
    console.error(
      chalk.red.inverse("Errore di parsing del JSON della risposta del server"),
    );
    console.error(
      chalk.italic.bold("Chiamata API:"),
      chalk.cyanBright(method),
      chalk.greenBright(response.url),
      chalk.yellowBright(response.status),
    );
    console.error(unrollFetchData(data));
    console.error(chalk.redBright(e));
    const text = await response.clone().text();
    if (text.length > 50000) {
      const parsed = parseLaravelErrorPage(text);
      if (parsed === false) {
        console.error(text.slice(0, 50000));
      } else {
        console.error(parsed);
      }
    } else {
      console.error(text);
    }
    return errors[ErrorCodes.INVALID_JSON] as z.infer<typeof serverErrorSchema>;
  }

  let serverResponseJson;
  try {
    serverResponseJson = z
      .discriminatedUnion("status", [serverSuccessSchema, serverErrorSchema])
      .parse(responseJson);
  } catch (e) {
    console.error(
      chalk.red.inverse(
        "Errore di parsing dello schema della risposta del server",
      ),
    );
    console.error(
      chalk.italic.bold("Chiamata API:"),
      chalk.cyanBright(method),
      chalk.greenBright(response.url),
      chalk.yellowBright(response.status),
    );
    console.error(unrollFetchData(data));
    console.error(chalk.redBright(e));
    console.error(await response.text());
    return errors[ErrorCodes.INVALID_SCHEMA] as z.infer<
      typeof serverErrorSchema
    >;
  }

  if (serverResponseJson.status !== "success") {
    console.error(
      chalk.red.inverse("Errore nella risposta del server"),
      chalk.redBright(serverResponseJson.message),
    );
    console.error(
      chalk.italic.bold("Chiamata API:"),
      chalk.cyanBright(method),
      chalk.greenBright(response.url),
      chalk.yellowBright(response.status),
    );
    console.error(unrollFetchData(data));
    console.error(serverResponseJson);

    if (serverResponseJson.responseStatus === 401) {
      console.error("Chiamata non autorizzata, logout");

      redirect("/logout");

      return errors[ErrorCodes.UNAUTHORIZED] as z.infer<
        typeof serverErrorSchema
      >;
    }
  }

  tags?.map((tag) => invalidateTag(tag));

  return serverResponseJson;
}

export async function get<T extends ZodRawShape>(
  url: `/${string}`,
  options: Omit<ApiCallOptions<T>, "data"> = {},
) {
  return apiCall("GET", url, options);
}

export async function post<T extends ZodRawShape>(
  url: `/${string}`,
  options: ApiCallOptions<T> = {},
) {
  return apiCall("POST", url, options);
}

export async function put<T extends ZodRawShape>(
  url: `/${string}`,
  options: ApiCallOptions<T> = {},
) {
  return apiCall("PUT", url, options);
}

export async function patch<T extends ZodRawShape>(
  url: `/${string}`,
  options: ApiCallOptions<T> = {},
) {
  return apiCall("PATCH", url, options);
}
