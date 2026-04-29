import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { fetchUser } from "./utils/api";

const AUTH_ROUTES = ["/", "/signin", "/signup"];

// const USER_AUTH_ROUTES = ["/", "/signin", "/signup"];

// const ADMIN_AUTH_ROUTES = ["/signin/admin"];

export async function proxy(request: NextRequest) {
  let pathname = request.nextUrl.pathname;

  let user = await fetchUser(request);

  if (AUTH_ROUTES.includes(pathname) && user?.roles?.includes("user")) {
    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  }

  if (pathname.includes("/user/dashboard") && !user?.roles?.includes("user")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    AUTH_ROUTES.includes(pathname) &&
    (user?.roles?.includes("admin") || user?.roles?.includes("super_admin"))
  ) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (
    pathname.includes("/admin/dashboard") &&
    !(user?.roles?.includes("admin") || user?.roles?.includes("super_admin"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    // "/signin",
    // "/signup",
    // "/signin/admin",
    "/user/dashboard/:path*",
    "/admin/dashboard/:path*",
  ],
};
