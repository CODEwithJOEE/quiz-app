// middleware.ts (project root)
import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static/internal paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_not-found") ||
    pathname === "/favicon.ico" ||
    pathname === "/manifest.json" ||
    pathname === "/sw.js" ||
    pathname.startsWith("/icons")
  ) {
    return NextResponse.next();
  }

  // ✅ CRITICAL: Skip logout route — huwag i-refresh yung session
  if (pathname === "/api/auth/logout") {
    return NextResponse.next();
  }

  // Run supabase session update FIRST
  const { response: supabaseResponse, user } = await updateSession(request);

  // Run intl middleware
  const intlResponse = intlMiddleware(request);

  if (intlResponse.status >= 300 && intlResponse.status < 400) {
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      intlResponse.cookies.set(cookie.name, cookie.value);
    });
    return intlResponse;
  }

  intlResponse.cookies.getAll().forEach((cookie) => {
    supabaseResponse.cookies.set(cookie.name, cookie.value);
  });

  supabaseResponse.headers.set(
    "Cache-Control",
    "private, no-cache, no-store, must-revalidate",
  );
  supabaseResponse.headers.set("Vary", "Accept-Language, Cookie");

  const localeMatch = pathname.match(/^\/(en|tl)(?=\/|$)/);
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;

  const pathnameWithoutLocale =
    pathname.replace(/^\/(en|tl)(?=\/|$)/, "") || "/";
  const isAuthPage = pathnameWithoutLocale.startsWith("/login");

  if (!user && !isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/home`;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|_not-found|favicon.ico|manifest.json|sw.js|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
