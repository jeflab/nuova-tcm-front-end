import {AUTH_COOKIE_NAME} from "@/app/(no-menu)/(auth)/const";
import {NextRequest, NextResponse} from "next/server";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|_not-found|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

const publicRoutes = [
  "/activate-account",
  "/forgotPassword",
  "/login",
  "/logout",
  "/maintenance",
  "/password-reset",
  "/public-quoter",
];

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);
  const isLoginPage = path === "/login";
  const isUserLoggedIn = request.cookies.has(AUTH_COOKIE_NAME);
  const searchParams = request.nextUrl.searchParams;

  // TODO: Manage root path

  if (!isPublicRoute && !isUserLoggedIn) {
    searchParams.set("next", path ?? "");
    const redirectUrl = new URL(
      `/login?${searchParams.toString()}`,
      request.url,
    );

    return NextResponse.redirect(redirectUrl);
  }

  if (isLoginPage && isUserLoggedIn) {
    const next = searchParams.get("next") ?? "/";
    searchParams.delete("next");
    const redirectUrl = new URL(next, request.url);
    redirectUrl.search = searchParams.toString();

    return NextResponse.redirect(redirectUrl);
  }
}
