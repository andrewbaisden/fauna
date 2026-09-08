import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/my-fauna")) {
    return NextResponse.next();
  }

  const session = request.cookies.get("better-auth.session_token");
  if (!session) {
    const url = new URL("/sign-in", request.url);
    url.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/my-fauna/:path*"],
};
