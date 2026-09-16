import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({ password: "" }));
  const expected = (process.env as unknown as { ADMIN_PASSWORD?: string }).ADMIN_PASSWORD;
  if (!expected || password !== expected) return NextResponse.json({ ok: false }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set("stahle_admin", "authenticated", { httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 8, path: "/" });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("stahle_admin");
  return response;
}
