import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const backendRes = await fetch(`${process.env.BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json();

  const response = NextResponse.json(data);

  // Forward backend cookie
  const setCookie = backendRes.headers.get("set-cookie");

  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}
