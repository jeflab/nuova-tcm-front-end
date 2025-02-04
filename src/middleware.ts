import {AUTH_COOKIE_NAME} from "@/app/(no-menu)/(auth)/const";
import {jwtSchema} from "@/models/jwt";
import {NextRequest, NextResponse} from "next/server";
import jwt from "jsonwebtoken";

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
  const isRootPath = path === "/";
  const isLoginPage = path === "/login";
  const searchParams = request.nextUrl.searchParams;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isUserLoggedIn = !!token;
  let userPermissions: string[] = [];

  if (token) {
    try {
      const decodedToken = jwt.decode(token);
      const parsedToken = jwtSchema.parse(decodedToken);

      userPermissions = Object.values(parsedToken.permissions ?? []);
    } catch (error) {
      console.error("Impossibile leggere il token JWT:", error);
      console.error("Token:", token);

      if (!isLoginPage) {
        searchParams.set("next", path ?? "");
        const redirectUrl = new URL(
          `/login?${searchParams.toString()}`,
          request.url,
        );

        const response = NextResponse.redirect(redirectUrl);
        response.cookies.delete(AUTH_COOKIE_NAME);
        return response;
      }
      const response = NextResponse.next();
      response.cookies.delete(AUTH_COOKIE_NAME);
      return response;
    }
  }

  if (isRootPath) {
    if (isUserLoggedIn) {
      if (userPermissions?.some((permission) => permission === "create-lip")) {
        return NextResponse.redirect(new URL("/lips", request.url));
      } else if (
        userPermissions?.some(
          (permission) => permission === "contractor-read-lip",
        )
      ) {
        return NextResponse.redirect(new URL("/contractorLips", request.url));
      } else {
        return NextResponse.redirect(new URL("/profile", request.url));
      }
    }

    return NextResponse.redirect(new URL("/login", request.url));
  }

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
