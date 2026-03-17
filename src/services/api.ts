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
  isServerError,
  serverErrorSchema,
} from "@/services/helpers";
import * as Sentry from "@sentry/nextjs";
import chalk from "chalk";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {z, ZodRawShape} from "zod";

async function authorizationHeader() {
  const authCookie = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  return authCookie ? {Authorization: `Bearer ${authCookie}`} : undefined;
}

async function deleteAuthCookie() {
  const cookiesStore = await cookies();
  const authCookie = cookiesStore.get(AUTH_COOKIE_NAME);

  if (!authCookie || !authCookie.value) {
    console.log(
      "Ricevuto 401, ma nessun cookie presente. Ritorno l'errore al chiamante.",
    );
    return;
  }

  console.warn(
    chalk.yellow.inverse(
      "Ricevuto 401 con cookie presente. Il cookie è invalido o scaduto. Eseguo redirect al logout.",
    ),
  );

  redirect("/logout");
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
  revalidateTags?: Tag[];
  provideTags?: Tag[];
}
export async function apiCall<ResponsePayloadShape extends ZodRawShape>(
  method: "GET" | "POST" | "PUT" | "PATCH",
  url: `/${string}`,
  {
    payloadShape,
    data,
    searchParams,
    revalidateTags,
    provideTags,
  }: ApiCallOptions<ResponsePayloadShape>,
): Promise<
  | z.infer<typeof serverSuccessSchema>
  | z.infer<typeof serverErrorSchema>
  | undefined
> {
  const payloadShapeOrDefault = payloadShape ?? ({} as ResponsePayloadShape);
  const body = data instanceof FormData ? data : JSON.stringify(data);
  const searchParamsString = searchParams
    ? "?" + new URLSearchParams(searchParams).toString()
    : "";
  const serverSuccessSchema = createServerSuccessSchema(payloadShapeOrDefault);
  const headers =
    data instanceof FormData
      ? {
          ...(await authorizationHeader()),
          ...acceptJsonHeader,
        }
      : {
          ...(await authorizationHeader()),
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
      ...(provideTags ? {tags: provideTags} : {}),
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

    Sentry.withScope((scope) => {
      scope.setContext("Errore di rete", {
        fetch: "apiCall",
        readableError: "Errore di rete",
        method,
        url: apiUrl + url + searchParamsString,
        data: JSON.stringify(unrollFetchData(data)),
        response: JSON.stringify(errors[ErrorCodes.FETCH_ERROR]),
      });
      Sentry.captureException(e);
    });

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

    Sentry.withScope((scope) => {
      scope.setContext("Errore di parsing del JSON della risposta del server", {
        fetch: "apiCall",
        readableError: "Errore di parsing del JSON della risposta del server",
        method,
        url: apiUrl + url + searchParamsString,
        "response.url": response.url,
        "response.status": response.status,
        text,
        data: JSON.stringify(unrollFetchData(data)),
        response: JSON.stringify(errors[ErrorCodes.INVALID_JSON]),
      });
      Sentry.captureException(e);
    });

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
    const text = await response.text();
    console.error(text);

    Sentry.withScope((scope) => {
      scope.setContext(
        "Errore di parsing dello schema della risposta del server",
        {
          fetch: "apiCall",
          readableError:
            "Errore di parsing dello schema della risposta del server",
          method,
          url: apiUrl + url + searchParamsString,
          "response.url": response.url,
          "response.status": response.status,
          text,
          data: JSON.stringify(unrollFetchData(data)),
          response: JSON.stringify(errors[ErrorCodes.INVALID_SCHEMA]),
        },
      );
      Sentry.captureException(e);
    });

    return errors[ErrorCodes.INVALID_SCHEMA] as z.infer<
      typeof serverErrorSchema
    >;
  }

  if (isServerError(serverResponseJson)) {
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

    Sentry.withScope((scope) => {
      scope.setContext("Errore nella risposta del server", {
        fetch: "apiCall",
        readableError:
          "Errore nella risposta del server" +
          (serverResponseJson.responseStatus === 401
            ? " (Chiamata non autorizzata, logout)"
            : ""),
        method,
        url: apiUrl + url + searchParamsString,
        "response.url": response.url,
        "response.status": response.status,
        data: JSON.stringify(unrollFetchData(data)),
        response: JSON.stringify(serverResponseJson),
      });
    });

    if (serverResponseJson.responseStatus === 401) {
      await deleteAuthCookie();

      return errors[ErrorCodes.UNAUTHORIZED] as z.infer<
        typeof serverErrorSchema
      >;
    }
  }

  revalidateTags?.map((tag) => invalidateTag(tag));

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
