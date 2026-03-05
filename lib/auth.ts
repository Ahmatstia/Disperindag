// lib/auth.ts
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret";

// Buat token JWT
export async function createToken() {
  const secret = new TextEncoder().encode(JWT_SECRET);
  return await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secret);
}

// Verifikasi token
export async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

// Untuk sementara, kita pakai cookie sederhana
// Fungsi ini bisa dikosongkan dulu
export async function hashPassword(password: string) {
  return password;
}

export async function verifyPassword(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  return password === adminPassword;
}
