import {AUTH_COOKIE_NAME} from "@/app/(no-menu)/(auth)/const";
import {apiUrl, contentJsonHeader} from "@/services/const";
import {cookies} from "next/headers";

function authorizationHeader() {
  const authCookie = cookies().get(AUTH_COOKIE_NAME)?.value;
  return authCookie ? {Authorization: `Bearer ${authCookie}`} : undefined;
}
export async function GET(
  request: Request,
  {params}: {params: {url: string[]}},
) {
  return await fetch(`${apiUrl}/${params.url.join("/")}`, {
    headers: {
      ...contentJsonHeader,
      ...authorizationHeader(),
    },
    method: "GET",
    credentials: "include",
  });
}
