import { apis } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  const redirectTo = request.cookies.get("redirectTo")?.value;

  const registerResponse = await apis.post("/register", {
    code,
  });

  const { token } = registerResponse.data;

  const redirect = redirectTo ?? new URL("/", request.url);

  const cookieExpiresInSeconds = 60 * 60 * 24 * 30;
  return NextResponse.redirect(redirect, {
    headers: {
      "Set-Cookie": `token=${token}; Path=/; max-age=${cookieExpiresInSeconds}`,
    },
  });
}
