import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/signin", "/signup"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Call INTERNAL Next.js API
  const res = await fetch(`${req.nextUrl.origin}/api/auth/me`, {
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
    credentials: "include",
  });

  if (!res.ok) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const user = await res.json();

  // Role-based protection
  const isUserRoute = pathname.startsWith("/user");
  const isAdminRoute = pathname.startsWith("/admin");

  if (isUserRoute && !user?.roles?.includes("user")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    isAdminRoute &&
    !user?.roles?.some((r: string) =>
      ["admin", "super_admin", "staff"].includes(r),
    )
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*", "/admin/:path*"],
};
