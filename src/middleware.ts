import {AUTH_COOKIE_NAME} from "@/app/(no-menu)/(auth)/const";
import {jwtSchema} from "@/models/jwt";
import {decodeJwt} from "jose";
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

const MAINTENANCE_BYPASS_COOKIE = "maintenance_bypass";

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const maintenanceToken = process.env.MAINTENANCE_MODE;
  const isMaintenanceActive =
    !!maintenanceToken &&
    maintenanceToken !== "false" &&
    maintenanceToken !== "";
  const isMaintenancePath = path === "/maintenance";
  const isBypassSetupPath = path === "/bypass-maintenance";
  const isPublicRoute = publicRoutes.includes(path);
  const isRootPath = path === "/";
  const isLoginPage = path === "/login";
  const searchParams = request.nextUrl.searchParams;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isUserLoggedIn = !!token;
  let userPermissions: string[] = [];

  if (isMaintenanceActive) {
    // Gestione della route di setup del bypass
    if (isBypassSetupPath) {
      const token = request.nextUrl.searchParams.get("token");
      if (token && token === maintenanceToken) {
        // Token corretto → imposta il cookie e vai alla home
        const response = NextResponse.redirect(new URL("/", request.url));
        response.cookies.set(MAINTENANCE_BYPASS_COOKIE, token, {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24, // 24 ore
        });
        return response;
      }
      // Token assente o errato → mostra la pagina di manutenzione
      return NextResponse.redirect(new URL("/maintenance", request.url));
    }

    // Controlla se l'utente ha il cookie di bypass valido
    const bypassCookie = request.cookies.get(MAINTENANCE_BYPASS_COOKIE)?.value;
    const hasBypass = bypassCookie === maintenanceToken;

    if (!hasBypass) {
      // Nessun bypass → mostra la pagina di manutenzione
      if (!isMaintenancePath) {
        return NextResponse.redirect(new URL("/maintenance", request.url));
      }
      return NextResponse.next();
    }

    // Bypass valido: se l'utente è già sulla pagina di manutenzione, mandalo alla home
    if (isMaintenancePath) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Bypass valido: continua con la normale logica di autenticazione ↓
  } else {
    // Manutenzione spenta: /maintenance e /bypass-maintenance → home
    if (isMaintenancePath || isBypassSetupPath) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (token) {
    try {
      const decodedToken = decodeJwt(token);
      const parsedToken = jwtSchema.parse(decodedToken);

      userPermissions = Object.values(parsedToken.permissions ?? {});
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
