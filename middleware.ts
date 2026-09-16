import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path.startsWith("/api/admin") && path !== "/api/admin/auth") {
    if (request.cookies.get("stahle_admin")?.value !== "authenticated") return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
