import { NextRequest } from "next/server";

export async function fetchUser(req: NextRequest) {
  const cookie = req.headers.get("cookie");

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/me`, {
      headers: {
        cookie: cookie || "",
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    return await res.json();
  } catch (error) {
    return null;
  }
}
