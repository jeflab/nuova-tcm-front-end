import {AUTH_COOKIE_NAME} from "@/app/(no-menu)/(auth)/const";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {type NextRequest} from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const next = searchParams.get("next");

  cookies().delete(AUTH_COOKIE_NAME);

  if (next) {
    return redirect(next);
  }

  return redirect("/");
}
