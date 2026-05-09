import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookie = req.headers.get("cookie");

  const res = await fetch(`${process.env.BASE_URL}/api/auth/me`, {
    headers: {
      cookie: cookie || "",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json(null, { status: 401 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
