import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const COOKIE_NAME = "token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect product pages and API routes
  const isProtectedApi =
    pathname.startsWith("/api/products") &&
    ["POST", "PUT", "DELETE"].includes(request.method);
  const isProtectedPages = pathname.startsWith("/products");

  if (!(isProtectedApi || isProtectedPages)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    if (isProtectedPages || isProtectedApi) {
      const url = new URL("/auth/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // In middleware (edge), avoid heavy JWT verification; presence is enough.
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/products",
    "/api/products/:path*",
    "/products",
    "/products/:path*",
  ],
};
