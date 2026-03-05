// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const cookieStore = await cookies();

    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const jwtSecret = process.env.JWT_SECRET || "default-secret";

    if (password === adminPassword) {
      // Create JWT token using jose (Edge compatible)
      const secret = new TextEncoder().encode(jwtSecret);
      const token = await new SignJWT({ role: "admin", authenticated: true })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(secret);

      // Set cookie dengan JWT
      cookieStore.set({
        name: "admin-token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24,
        path: "/",
        sameSite: "lax",
      });

      return NextResponse.json({
        success: true,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Password salah",
      },
      { status: 401 },
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 },
    );
  }
}
