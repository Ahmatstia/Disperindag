// lib/auth.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "rahasia-sementara";

// Buat token JWT
export function createToken() {
  return jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "1d" });
}

// Verifikasi token
export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch {
    return null;
  }
}

// Untuk sementara, kita pakai cookie sederhana
// Fungsi ini bisa dikosongkan dulu
export async function hashPassword(password: string) {
  return password;
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return password === "admin123";
}
