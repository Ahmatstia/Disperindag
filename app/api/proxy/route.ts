// app/api/proxy/route.ts
import { NextResponse } from "next/server";

// 3 URL dari .env
const APPS_SCRIPT_URL_SURVEY = process.env.NEXT_PUBLIC_APPS_SCRIPT_SURVEY;
const APPS_SCRIPT_URL_ADUAN = process.env.NEXT_PUBLIC_APPS_SCRIPT_ADUAN;
const APPS_SCRIPT_URL_TAMU = process.env.NEXT_PUBLIC_APPS_SCRIPT_TAMU;

export async function GET(request: Request) {
  try {
    console.log("📡 [GET] Proxy dipanggil");

    // Ambil parameter type dari URL
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "survey";

    // Pilih URL berdasarkan type
    let APPS_SCRIPT_URL;
    switch (type) {
      case "aduan":
        APPS_SCRIPT_URL = APPS_SCRIPT_URL_ADUAN;
        break;
      case "tamu":
        APPS_SCRIPT_URL = APPS_SCRIPT_URL_TAMU;
        break;
      default:
        APPS_SCRIPT_URL = APPS_SCRIPT_URL_SURVEY;
    }

    // Validasi URL
    if (!APPS_SCRIPT_URL) {
      console.error(`❌ URL untuk ${type} tidak ditemukan di .env`);
      return NextResponse.json(
        { error: `URL for ${type} not configured` },
        { status: 500 },
      );
    }

    console.log(
      `📡 Fetching ke ${type}:`,
      APPS_SCRIPT_URL.substring(0, 50) + "...",
    );

    const response = await fetch(APPS_SCRIPT_URL, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error(`❌ Response error: ${response.status}`);
      return NextResponse.json(
        { error: `HTTP ${response.status}` },
        { status: response.status },
      );
    }

    const text = await response.text();
    console.log(`📡 Response length: ${text.length}`);

    // Coba parse sebagai JSON langsung
    try {
      const jsonData = JSON.parse(text);
      return NextResponse.json(jsonData);
    } catch (e) {
      // Bukan JSON, lanjut cek JSONP
    }

    // Parse sebagai JSONP (callback({...}))
    const jsonMatch = text.match(/callback\(([\s\S]*)\)/);
    if (!jsonMatch) {
      console.error("❌ Invalid response format:", text.substring(0, 100));
      return NextResponse.json(
        { error: "Invalid response format" },
        { status: 500 },
      );
    }

    const data = JSON.parse(jsonMatch[1]);
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ [GET] Proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log("📡 [POST] Proxy dipanggil");

    const body = await request.json();
    console.log("📤 [POST] Request body:", body);

    // Tentukan URL berdasarkan sheetName
    let APPS_SCRIPT_URL;
    switch (body.sheetName) {
      case "aduan":
        APPS_SCRIPT_URL = APPS_SCRIPT_URL_ADUAN;
        break;
      case "tamu":
        APPS_SCRIPT_URL = APPS_SCRIPT_URL_TAMU;
        break;
      default:
        APPS_SCRIPT_URL = APPS_SCRIPT_URL_SURVEY;
    }

    if (!APPS_SCRIPT_URL) {
      return NextResponse.json(
        { error: `URL for ${body.sheetName} not configured` },
        { status: 500 },
      );
    }

    // Tambahkan callback parameter
    const url = new URL(APPS_SCRIPT_URL);
    url.searchParams.set("callback", "callback");

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await response.text();

    if (!text || text.trim() === "") {
      console.error("❌ Response kosong");
      return NextResponse.json({ error: "Empty response" }, { status: 500 });
    }

    // Parse JSONP
    const jsonMatch = text.match(/^([a-zA-Z0-9_]+)\((.*)\)$/);
    if (!jsonMatch) {
      console.error("❌ Bukan format JSONP:", text.substring(0, 100));
      return NextResponse.json(
        { error: "Invalid response format" },
        { status: 500 },
      );
    }

    const data = JSON.parse(jsonMatch[2]);
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ [POST] Proxy error:", error);
    return NextResponse.json({ error: "Failed to post" }, { status: 500 });
  }
}
