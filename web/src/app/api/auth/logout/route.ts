import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const redirect = new URL("/", request.url);

  return NextResponse.redirect(redirect, {
    headers: {
      "Set-Cookie": `token=; Path=/; max-age=0`,
    },
  });
}
