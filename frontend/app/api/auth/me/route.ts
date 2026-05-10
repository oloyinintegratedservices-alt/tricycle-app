import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Get token from cookies
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Call backend API
    const backendRes = await fetch(`${process.env.BASE_URL}/api/auth/me`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!backendRes.ok) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await backendRes.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
