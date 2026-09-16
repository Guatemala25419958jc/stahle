import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
    if (path === "/api/admin/auth" || request.cookies.get("stahle_admin")?.value === "authenticated") return NextResponse.next();
    if (path.startsWith("/api/admin")) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
