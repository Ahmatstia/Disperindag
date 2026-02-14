// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  // Hapus cookie
  cookieStore.delete("admin-token");

  // Set cookie expired (alternatif)
  cookieStore.set({
    name: "admin-token",
    value: "",
    maxAge: 0,
    path: "/",
  });

  return NextResponse.json({ success: true });
}
