import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "token";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      sub: string;
      email: string;
    };
    return NextResponse.json(
      { authenticated: true, user: { id: payload.sub, email: payload.email } },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}
