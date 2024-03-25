"use server";

import {AUTH_COOKIE_NAME} from "@/app/(no-menu)/(auth)/const";
import {ErrorCodes, errors} from "@/helpers/errors";
import {logFetchInfo} from "@/helpers/fetchDebug";
import {apiUrl, contentJsonHeader} from "@/services/const";
import {createServerSuccessSchema, serverErrorSchema} from "@/services/helpers";
import chalk from "chalk";
import {cookies} from "next/headers";
import {z, ZodRawShape} from "zod";

function authorizationHeader() {
  const authCookie = cookies().get(AUTH_COOKIE_NAME)?.value;
  return authCookie ? {Authorization: `Bearer ${authCookie}`} : undefined;
}

function parseLaravelErrorPage(text: string) {
  let ok = false;
  let noScript = "";
  const noScriptMatch = text.match(/<noscript>(.+)<\/noscript>/gis);
  let title = "";
  const titleMatch = text.match(/<title>(.+)<\/title>/gis);

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

export async function get<T extends ZodRawShape>(
  url: `/${string}`,
  zodRowShape: T,
  {
    searchParams,
    tags,
  }: {searchParams?: Record<string, string>; tags?: string[]} = {},
) {
  const serverSuccessSchema = createServerSuccessSchema(zodRowShape);
  const searchParamsString = searchParams
    ? "?" + new URLSearchParams(searchParams).toString()
    : "";

  const response = await fetch(apiUrl + url + searchParamsString, {
    headers: {
      ...contentJsonHeader,
      ...authorizationHeader(),
    },
    method: "GET",
    credentials: "include",
    ...(tags ? {tags} : {}),
  });

  void logFetchInfo("GET", response);

  let responseJson;
  try {
    responseJson = await response.clone().json();
    responseJson.responseStatus = response.status;
  } catch (e) {
    console.error(
      chalk.red.inverse("Errore di parsing del JSON della risposta del server"),
    );
    console.error(
      chalk.italic.bold("Chiamata API:"),
      chalk.cyanBright("GET"),
      chalk.greenBright(response.url),
      chalk.yellowBright(response.status),
    );
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
      .union([serverSuccessSchema, serverErrorSchema])
      .parse(responseJson);
  } catch (e) {
    console.error(
      chalk.red.inverse(
        "Errore di parsing dello schema della risposta del server",
      ),
    );
    console.error(
      chalk.italic.bold("Chiamata API:"),
      chalk.cyanBright("GET"),
      chalk.greenBright(response.url),
      chalk.yellowBright(response.status),
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
  url: `/${string}`,
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

  void logFetchInfo("POST", response, body);

  let responseJson;
  try {
    responseJson = await response.clone().json();
    responseJson.responseStatus = response.status;
  } catch (e) {
    console.error(
      chalk.red.inverse("Errore di parsing del JSON della risposta del server"),
    );
    console.error(
      chalk.italic.bold("Chiamata API:"),
      chalk.cyanBright("POST"),
      chalk.greenBright(response.url),
      chalk.yellowBright(response.status),
    );
    console.error(body ? JSON.parse(body) : "no data");
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
      .union([serverSuccessSchema, serverErrorSchema])
      .parse(responseJson);
  } catch (e) {
    console.error(
      chalk.red.inverse(
        "Errore di parsing dello schema della risposta del server",
      ),
    );
    console.error(
      chalk.italic.bold("Chiamata API:"),
      chalk.cyanBright("POST"),
      chalk.greenBright(response.url),
      chalk.yellowBright(response.status),
    );
    console.error(body ? JSON.parse(body) : "no data");
    console.error(chalk.redBright(e));
    console.error(await response.text());
    return errors[ErrorCodes.INVALID_SCHEMA] as z.infer<
      typeof serverErrorSchema
    >;
  }

  return serverResponseJson;
}

export async function postFormData<T extends ZodRawShape>(
  url: `/${string}`,
  zodRowShape: T,
  formData?: FormData,
) {
  const serverSuccessSchema = createServerSuccessSchema(zodRowShape);

  const response = await fetch(apiUrl + url, {
    headers: {
      ...authorizationHeader(),
    },
    method: "POST",
    credentials: "include",
    body: formData,
  });

  void logFetchInfo("POST", response, formData);

  let responseJson;
  try {
    responseJson = await response.clone().json();
    responseJson.responseStatus = response.status;
  } catch (e) {
    console.error(
      chalk.red.inverse("Errore di parsing del JSON della risposta del server"),
    );
    console.error(
      chalk.italic.bold("Chiamata API:"),
      chalk.cyanBright("POST"),
      chalk.greenBright(response.url),
      chalk.yellowBright(response.status),
    );
    console.error(
      formData ? Object.fromEntries([...formData.entries()]) : "no data",
    );
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
      .union([serverSuccessSchema, serverErrorSchema])
      .parse(responseJson);
  } catch (e) {
    console.error(
      chalk.red.inverse(
        "Errore di parsing dello schema della risposta del server",
      ),
    );
    console.error(
      chalk.italic.bold("Chiamata API:"),
      chalk.cyanBright("POST"),
      chalk.greenBright(response.url),
      chalk.yellowBright(response.status),
    );
    console.error(
      formData ? Object.fromEntries([...formData.entries()]) : "no data",
    );
    console.error(chalk.redBright(e));
    console.error(await response.text());
    return errors[ErrorCodes.INVALID_SCHEMA] as z.infer<
      typeof serverErrorSchema
    >;
  }

  return serverResponseJson;
}
export async function put<T extends ZodRawShape>(
  url: `/${string}`,
  zodRowShape: T,
  body?: string,
) {
  const serverSuccessSchema = createServerSuccessSchema(zodRowShape);

  const response = await fetch(apiUrl + url, {
    headers: {
      ...contentJsonHeader,
      ...authorizationHeader(),
    },
    method: "PUT",
    credentials: "include",
    body,
  });

  void logFetchInfo("PUT", response, body);

  let responseJson;
  try {
    responseJson = await response.clone().json();
    responseJson.responseStatus = response.status;
  } catch (e) {
    console.error(
      chalk.red.inverse("Errore di parsing del JSON della risposta del server"),
    );
    console.error(
      chalk.italic.bold("Chiamata API:"),
      chalk.cyanBright("PUT"),
      chalk.greenBright(response.url),
      chalk.yellowBright(response.status),
    );
    console.error(body ? JSON.parse(body) : "no data");

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
      .union([serverSuccessSchema, serverErrorSchema])
      .parse(responseJson);
  } catch (e) {
    console.error(
      chalk.red.inverse(
        "Errore di parsing dello schema della risposta del server",
      ),
    );
    console.error(
      chalk.italic.bold("Chiamata API:"),
      chalk.cyanBright("PUT"),
      chalk.greenBright(response.url),
      chalk.yellowBright(response.status),
    );
    console.error(body ? JSON.parse(body) : "no data");

    console.error(chalk.redBright(e));
    console.error(await response.text());
    return errors[ErrorCodes.INVALID_SCHEMA] as z.infer<
      typeof serverErrorSchema
    >;
  }

  return serverResponseJson;
}

export async function patch<T extends ZodRawShape>(
  url: `/${string}`,
  zodRowShape: T,
  body?: string,
) {
  const serverSuccessSchema = createServerSuccessSchema(zodRowShape);

  const response = await fetch(apiUrl + url, {
    headers: {
      ...contentJsonHeader,
      ...authorizationHeader(),
    },
    method: "PATCH",
    credentials: "include",
    body,
  });

  void logFetchInfo("PATCH", response, body);

  let responseJson;
  try {
    responseJson = await response.clone().json();
    responseJson.responseStatus = response.status;
  } catch (e) {
    console.error(
      chalk.red.inverse("Errore di parsing del JSON della risposta del server"),
    );
    console.error(
      chalk.italic.bold("Chiamata API:"),
      chalk.cyanBright("PATCH"),
      chalk.greenBright(response.url),
      chalk.yellowBright(response.status),
    );
    console.error(body ? JSON.parse(body) : "no data");

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
      .union([serverSuccessSchema, serverErrorSchema])
      .parse(responseJson);
  } catch (e) {
    console.error(
      chalk.red.inverse(
        "Errore di parsing dello schema della risposta del server",
      ),
    );
    console.error(
      chalk.italic.bold("Chiamata API:"),
      chalk.cyanBright("PATCH"),
      chalk.greenBright(response.url),
      chalk.yellowBright(response.status),
    );
    console.error(body ? JSON.parse(body) : "no data");

    console.error(chalk.redBright(e));
    console.error(await response.text());
    return errors[ErrorCodes.INVALID_SCHEMA] as z.infer<
      typeof serverErrorSchema
    >;
  }

  return serverResponseJson;
}
