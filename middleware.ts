import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  // Only the public catalog and its stored image files may be read without
  // the admin session. Customer, quote, and mutation endpoints stay private.
  const publicCatalogRead = request.method === "GET" && (path === "/api/admin/products" || path.startsWith("/api/admin/images/"));
  if (path.startsWith("/api/admin") && path !== "/api/admin/auth" && !publicCatalogRead) {
    if (request.cookies.get("stahle_admin")?.value !== "authenticated") return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
