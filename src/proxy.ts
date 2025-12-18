import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ROLE_PATHS = {
  admin: "/admin/dashboard",
  reseller: "/reseller/panel",
  user: "/dashboard",
};

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/me",
  "/api/auth/token-login",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role as keyof typeof ROLE_PATHS;

    if (role === "admin" && !pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL(ROLE_PATHS.admin, request.url));
    }
    if (role === "reseller" && !pathname.startsWith("/reseller")) {
      return NextResponse.redirect(new URL(ROLE_PATHS.reseller, request.url));
    }
    if (role === "user" && !pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL(ROLE_PATHS.user, request.url));
    }

    return NextResponse.next();
  } catch (error) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
