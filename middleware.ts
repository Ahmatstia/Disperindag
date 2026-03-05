// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("admin-token")?.value;
  
  let isLoggedIn = false;
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret");
      await jwtVerify(token, secret);
      console.log("✅ Token verified in middleware");
      isLoggedIn = true;
    } catch (err) {
      console.error("❌ Token verification failed in middleware:", err);
      isLoggedIn = false;
    }
  }

  // Halaman publik - selalu izinkan
  if (path === "/" || path === "/login") {
    // Jika sudah login dan ke halaman login, redirect ke dashboard
    if (path === "/login" && isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Halaman admin - harus login
  if (path.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/"],
};
