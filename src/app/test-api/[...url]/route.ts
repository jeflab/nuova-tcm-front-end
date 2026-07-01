import {AUTH_COOKIE_NAME} from "@/app/(no-menu)/(auth)/const";
import {acceptJsonHeader, apiUrl, contentJsonHeader} from "@/services/const";
import {cookies} from "next/headers";
import {NextRequest, NextResponse} from "next/server";

async function authorizationHeader() {
  const authCookie = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  return authCookie ? {Authorization: `Bearer ${authCookie}`} : undefined;
}

export async function GET(
  request: NextRequest,
  props: {params: Promise<{url: string[]}>},
) {
  const params = await props.params;
  console.time("test-api response time");
  const queryParams = new URLSearchParams(request.nextUrl.searchParams);
  const queryParamsString = queryParams.toString()
    ? `?${queryParams.toString()}`
    : "";

  const response = await fetch(
    `${apiUrl}/${params.url.join("/")}${queryParamsString}`,
    {
      headers: {
        ...contentJsonHeader,
        ...acceptJsonHeader,
        ...(await authorizationHeader()),
        "cache-control": "no-transform",
      },
      method: "GET",
      credentials: "include",
    },
  );

  console.timeEnd("test-api response time");

  // Node.js fetch decomprime il body automaticamente ma lascia
  // Content-Encoding nell'header → il browser tenta di decomprimere
  // di nuovo e fallisce. Rimuoviamo gli header legati alla compressione.
  const headers = new Headers(response.headers);
  headers.delete("content-encoding");
  headers.delete("content-length"); // non più valido dopo la decompressione

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
