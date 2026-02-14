// app/api/proxy/route.ts
import { NextResponse } from "next/server";

const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL!;

export async function GET() {
  try {
    console.log("📡 Proxy: Fetching dari Apps Script...");

    const response = await fetch(APPS_SCRIPT_URL, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const text = await response.text();

    // Parse JSONP response (callback({...}))
    const jsonMatch = text.match(/callback\((.*)\)/);
    if (!jsonMatch) {
      throw new Error("Invalid JSONP response");
    }

    const data = JSON.parse(jsonMatch[1]);
    console.log("✅ Proxy: Data berhasil diambil");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}
