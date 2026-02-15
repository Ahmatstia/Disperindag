// app/api/proxy/route.ts
import { NextResponse } from "next/server";

const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL!;

export async function GET() {
  try {
    console.log("📡 [GET] Proxy dipanggil");

    const response = await fetch(APPS_SCRIPT_URL, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    const text = await response.text();
    // console.log("📥 [GET] Response:", text.substring(0, 200));

    // 1. Coba parse sebagai JSON langsung (siapa tahu format berubah jadi JSON)
    try {
      const jsonData = JSON.parse(text);
      return NextResponse.json(jsonData);
    } catch (e) {
      // Ignore error, lanjut cek JSONP
    }

    // 2. Coba parse sebagai JSONP (callback({...}))
    // Regex diperbaiki untuk handle multiline ([\s\S]*)
    const jsonMatch = text.match(/callback\(([\s\S]*)\)/);
    if (!jsonMatch) {
      console.error("❌ Invalid response format:", text.substring(0, 100));
      return NextResponse.json(
        { error: "Invalid response format", raw: text.substring(0, 100) },
        { status: 500 },
      );
    }

    const data = JSON.parse(jsonMatch[1]);
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ [GET] Proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    console.log("📡 [POST] Proxy dipanggil");

    const body = await request.json();
    console.log("📤 [POST] Request body:", body);

    // Tambahkan callback parameter ke URL
    const url = new URL(APPS_SCRIPT_URL);
    url.searchParams.set("callback", "callback");

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    console.log("📥 [POST] Response text:", text);

    // Cek apakah response kosong
    if (!text || text.trim() === "") {
      console.error("❌ Response kosong dari Apps Script");
      return NextResponse.json(
        {
          error: "Empty response from Apps Script",
        },
        { status: 500 },
      );
    }

    // Parse JSONP response
    const jsonMatch = text.match(/^([a-zA-Z0-9_]+)\((.*)\)$/);
    if (!jsonMatch) {
      console.error("❌ Bukan format JSONP. Response:", text);
      return NextResponse.json(
        {
          error: "Invalid response format",
          raw: text.substring(0, 200),
        },
        { status: 500 },
      );
    }

    const data = JSON.parse(jsonMatch[2]);
    console.log("✅ [POST] Parsed data:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ [POST] Proxy error:", error);
    return NextResponse.json(
      {
        error: "Failed to post",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
