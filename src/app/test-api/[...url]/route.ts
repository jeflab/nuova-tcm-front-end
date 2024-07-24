import {AUTH_COOKIE_NAME} from "@/app/(no-menu)/(auth)/const";
import {acceptJsonHeader, apiUrl, contentJsonHeader} from "@/services/const";
import {cookies} from "next/headers";
import {NextRequest} from "next/server";

function authorizationHeader() {
  const authCookie = cookies().get(AUTH_COOKIE_NAME)?.value;
  return authCookie ? {Authorization: `Bearer ${authCookie}`} : undefined;
}
export async function GET(
  request: NextRequest,
  {params}: {params: {url: string[]}},
) {
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
        ...authorizationHeader(),
        "cache-control": "no-transform",
        "accept-encoding": "gzip, br",
      },
      method: "GET",
      credentials: "include",
    },
  );

  console.timeEnd("test-api response time");

  return response;
}
