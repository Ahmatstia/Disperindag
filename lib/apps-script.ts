// lib/apps-script.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

// ============================================
// KONFIGURASI URL PER LAYANAN
// ============================================
// process.env.NEXT_PUBLIC_APPS_SCRIPT_SURVEY;
// process.env.NEXT_PUBLIC_APPS_SCRIPT_ADUAN;
// process.env.NEXT_PUBLIC_APPS_SCRIPT_TAMU;

// Cache untuk menyimpan data mentah
// let dataCache: {
//   survey: any[];
//   aduan: any[];
//   tamu: any[];
//   timestamp: number;
// } | null = null;

// const CACHE_DURATION = 5 * 60 * 1000; // 5 menit

// Deteksi environment
const isServer = typeof window === "undefined";

// ============================================
// FUNGSI FETCH UNTUK SERVER
// ============================================
async function fetchFromServer(type = "survey") {
  try {
    console.log(`🖥️ [SERVER] Fetching ${type} data...`);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const url = `${baseUrl}/api/proxy?type=${type}`;

    const response = await fetch(url, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ [SERVER] Error fetching ${type}:`, error);
    throw error;
  }
}

// ============================================
// FUNGSI FETCH UNTUK CLIENT
// ============================================
async function fetchFromClient(type = "survey") {
  try {
    console.log(`🌐 [CLIENT] Fetching ${type} data...`);

    const response = await fetch(`/api/proxy?type=${type}`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ [CLIENT] Error fetching ${type}:`, error);
    throw error;
  }
}

// ============================================
// FUNGSI FETCH DENGAN AUTO-DETECT
// ============================================
async function fetchFromProxy(type = "survey") {
  try {
    const data = isServer
      ? await fetchFromServer(type)
      : await fetchFromClient(type);

    return data;
  } catch (error) {
    console.error(`❌ Error fetching ${type}:`, error);
    throw error;
  }
}

// ============================================
// FUNGSI DELETE UNTUK CLIENT
// ============================================
export async function deleteData(sheetName: string, rowIndex: number) {
  if (isServer) {
    throw new Error("Delete hanya bisa dilakukan di client");
  }

  try {
    const response = await fetch("/api/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "delete",
        sheetName,
        rowIndex,
      }),
    });

    const data = await response.json();

    if (data.success) {
      // clearCache();
    }

    return data;
  } catch (error) {
    console.error("❌ Delete error:", error);
    throw error;
  }
}

// ============================================
// FORMAT DATA SURVEY (OPTIMIZED) - FIELD SUDAH COCOK
// ============================================
export async function getSurveyDataOptimized(
  page = 1,
  limit = 50,
) {
  try {
    console.log(`🔍 [SurveyPage Debug] Fetching page ${page}, limit ${limit}`);

    const data = await fetchFromProxy("survey");

    if (!data || !data.survey) {
      return { data: [], total: 0, page, totalPages: 0, hasMore: false };
    }

    const surveyArray = data.survey;

    if (surveyArray.length === 0) {
      return { data: [], total: 0, page, totalPages: 0, hasMore: false };
    }

    // Format data - field sudah sesuai dengan spreadsheet
    const formatted = surveyArray.map((item: any) => {
      return {
        Timestamp: item["Timestamp"] || item["Timestemp"] || "",
        Nama: item["Nama"] || "",
        Pekerjaan: item["Pekerjaan"] || "",
        "Jenis Kelamin": item["Jenis Kelamin"] || "",
        "Rentang Usia": item["Rentang Usia"] || "",
        Layanan: item["Layanan"] || "",
        Persyaratan: item["Persyaratan"] || "",
        Prosedur: item["Prosedur"] || "",
        "Waktu Proses Berkas": item["Waktu Proses Berkas"] || "",
        "Waktu Selesai Aduan": item["Waktu Selesai Aduan"] || "",
        "Waktu Aduan Online": item["Waktu Aduan Online"] || "",
        "Waktu Respon Online": item["Waktu Respon Online"] || "",
        Biaya: item["Biaya"] || "",
        Kesesuaian: item["Kesesuaian"] || "",
        Penguasaan: item["Penguasaan"] || "",
        Komunikasi: item["Komunikasi"] || "",
        "Komunikasi Online": item["Komunikasi Online"] || "",
        Sikap: item["Sikap"] || "",
        Kerapian: item["Kerapian"] || "",
        "Keberadaan Pengaduan": item["Keberadaan Pengaduan"] || "",
        "Tata Cara Pengaduan": item["Tata Cara Pengaduan"] || "",
        "Tata Cara Pengaduan (2)": item["Tata Cara Pengaduan (2)"] || "",
        "Pengaduan Online": item["Pengaduan Online"] || "",
        Keberlanjutan: item["Keberlanjutan"] || "",
        "Sarana Kelengkapan": item["Sarana Kelengkapan"] || "",
        "Sarana Kelayakan": item["Sarana Kelayakan"] || "",
        "Sarana Toilet": item["Sarana Toilet"] || "",
        Kebersihan: item["Kebersihan"] || "",
        "Front Officer": item["Front Officer"] || "",
        "Ketersediaan Informasi": item["Ketersediaan Informasi"] || "",
        "Kemanfaatan Online": item["Kemanfaatan Online"] || "",
        Kepuasan: item["Kepuasan"] || "",
      };
    });

    const total = formatted.length;
    const start = (page - 1) * limit;
    const end = page * limit;
    const paginatedData = formatted.slice(start, end);
    const totalPages = Math.ceil(total / limit);

    return {
      data: paginatedData,
      total,
      page,
      totalPages,
      limit,
      hasMore: end < total,
    };
  } catch (error) {
    console.error("❌ Error getSurveyDataOptimized:", error);
    return { data: [], total: 0, page, totalPages: 0, hasMore: false };
  }
}

// ============================================
// FORMAT DATA ADUAN (OPTIMIZED) - SESUAI RESPONSE ASLI
// ============================================
export async function getAduanDataOptimized(
  page = 1,
  limit = 50,
) {
  try {
    console.log(`🔍 [AduanPage Debug] Fetching page ${page}, limit ${limit}`);

    const data = await fetchFromProxy("aduan");

    console.log(`🔍 [AduanPage Debug] Raw data from proxy:`, data);

    if (!data || !data.aduan) {
      console.log(`🔍 [AduanPage Debug] data.aduan is null/undefined`);
      return { data: [], total: 0, page, totalPages: 0, hasMore: false };
    }

    const aduanArray = data.aduan;
    console.log(`🔍 [AduanPage Debug] aduanArray length:`, aduanArray.length);

    if (aduanArray.length === 0) {
      console.log(`🔍 [AduanPage Debug] aduanArray is empty`);
      return { data: [], total: 0, page, totalPages: 0, hasMore: false };
    }

    // Log sample data pertama untuk melihat struktur
    console.log(`🔍 [AduanPage Debug] Sample item:`, aduanArray[0]);

    // Format data sesuai struktur response asli
    const formatted = aduanArray.map((item: any) => {
      // Menyesuaikan dengan kolom spreadsheet: Timestemp, Nama, Pekerjaan, Jenis Kelamin, Rentang Usia, Instansi/Perusahaan, Hal/Peristiwa, Lokasi Peristiwa, Tanggal Kejadian, Tindak Lanjut yang Diharapkan
      return {
        Timestamp: item["Timestamp"] || item["Timestemp"] || "",
        Nama: item["Nama"] || "",
        Pekerjaan: item["Pekerjaan"] || "",
        Instansi: item["Instansi/Perusahaan"] || item["Instansi"] || "",
        "Jenis Kelamin": item["Jenis Kelamin"] || "",
        "Rentang Usia": item["Rentang Usia"] || "",
        "Hal Peristiwa": item["Hal/Peristiwa"] || item["Hal Peristiwa"] || "",
        "Lokasi Peristiwa": item["Lokasi Peristiwa"] || "",
        "Tanggal Kejadian": item["Tanggal Kejadian"] || "",
        "Tindak Lanjut": item["Tindak Lanjut yang Diharapkan"] || item["Tindak Lanjut"] || "",
        Status: item["Status"] || "Baru",
      };
    });

    console.log(
      `🔍 [AduanPage Debug] Formatted data length:`,
      formatted.length,
    );
    console.log(`🔍 [AduanPage Debug] Formatted sample:`, formatted[0]);

    const total = formatted.length;
    const start = (page - 1) * limit;
    const end = page * limit;
    const paginatedData = formatted.slice(start, end);
    const totalPages = Math.ceil(total / limit);

    console.log(`🔍 [AduanPage Debug] Returning:`, {
      dataLength: paginatedData.length,
      total,
      page,
      totalPages,
    });

    return {
      data: paginatedData,
      total,
      page,
      totalPages,
      limit,
      hasMore: end < total,
    };
  } catch (error) {
    console.error("❌ Error getAduanDataOptimized:", error);
    return { data: [], total: 0, page, totalPages: 0, hasMore: false };
  }
}

// ============================================
// FORMAT DATA TAMU (OPTIMIZED) - SESUAI RESPONSE ASLI
// ============================================
export async function getTamuDataOptimized(
  page = 1,
  limit = 50,
) {
  try {
    console.log(`🔍 [TamuPage Debug] Fetching page ${page}, limit ${limit}`);

    const data = await fetchFromProxy("tamu");

    console.log(`🔍 [TamuPage Debug] Raw data from proxy:`, data);

    if (!data || !data.tamu) {
      console.log(`🔍 [TamuPage Debug] data.tamu is null/undefined`);
      return { data: [], total: 0, page, totalPages: 0, hasMore: false };
    }

    const tamuArray = data.tamu;
    console.log(`🔍 [TamuPage Debug] tamuArray length:`, tamuArray.length);

    if (tamuArray.length === 0) {
      console.log(`🔍 [TamuPage Debug] tamuArray is empty`);
      return { data: [], total: 0, page, totalPages: 0, hasMore: false };
    }

    // Format data sesuai struktur response asli
    const formatted = tamuArray.map((item: any, index: number) => {
      console.log(`🔍 [TamuPage Debug] Item ${index}:`, item);

      return {
        Timestamp: item["Timestamp"] || item["Timestemp"] || "",
        Nama: item["Nama"] || "",
        "Jenis Kelamin": item["Jenis Kelamin"] || "",
        "Rentang Usia": item["Rentang Usia"] || "",
        // Column 4 diabaikan karena kosong
        "No HP": item["Nomor Handphone"] || "",
        Instansi: item["Instansi/Perusahaan"] || "",
        Jabatan: item["Jabatan"] || "",
        Alamat: item["Alamat Instansi/Perusahaan"] || "",
        "Bidang Dituju": item["Bidang yang Dituju"] || "",
        Tujuan: item["Tujuan"] || "",
      };
    });

    console.log(`🔍 [TamuPage Debug] Formatted data sample:`, formatted[0]);

    const total = formatted.length;
    const start = (page - 1) * limit;
    const end = page * limit;
    const paginatedData = formatted.slice(start, end);
    const totalPages = Math.ceil(total / limit);

    console.log(`🔍 [TamuPage Debug] Returning:`, {
      dataLength: paginatedData.length,
      total,
      page,
      totalPages,
    });

    return {
      data: paginatedData,
      total,
      page,
      totalPages,
      limit,
      hasMore: end < total,
    };
  } catch (error) {
    console.error("❌ Error getTamuDataOptimized:", error);
    return { data: [], total: 0, page, totalPages: 0, hasMore: false };
  }
}

// ============================================
// FUNGSI BACKWARD COMPATIBILITY
// ============================================
export async function getSurveyData() {
  const result = await getSurveyDataOptimized(1, 1000); // Ambil limit besar untuk dashboard
  return result.data;
}

export async function getAduanData() {
  const result = await getAduanDataOptimized(1, 1000);
  return result.data;
}

export async function getTamuData() {
  const result = await getTamuDataOptimized(1, 1000);
  return result.data;
}

export async function getSurveyDataPaginated(page = 1, limit = 50) {
  const result = await getSurveyDataOptimized(page, limit);
  return {
    data: result.data,
    total: result.total,
    page: result.page,
    totalPages: result.totalPages,
    limit: result.limit,
  };
}

export async function getAduanDataPaginated(page = 1, limit = 50) {
  const result = await getAduanDataOptimized(page, limit);
  return {
    data: result.data,
    total: result.total,
    page: result.page,
    totalPages: result.totalPages,
    limit: result.limit,
  };
}

export async function getTamuDataPaginated(page = 1, limit = 50) {
  const result = await getTamuDataOptimized(page, limit);
  return {
    data: result.data,
    total: result.total,
    page: result.page,
    totalPages: result.totalPages,
    limit: result.limit,
  };
}

// ============================================
// FUNGSI CLEAR CACHE
// ============================================
export function clearCache() {
  // dataCache = null;
}

// ============================================
// STATISTIK
// ============================================
export async function getStatistik() {
  try {
    const [survey, aduan, tamu] = await Promise.all([
      getSurveyData(),
      getAduanData(),
      getTamuData(),
    ]);

    // Survey data sudah diformat oleh getSurveyData (via getSurveyDataOptimized)
    const surveyData = (survey || []) as any[];
    
    // Hitung rata-rata kepuasan
    let totalScore = 0;
    let validSurveys = 0;

    surveyData.forEach((item: any) => {
      const satisfaction = item["Kepuasan"] || "";
      let score = 0;
      if (satisfaction.includes("Sangat")) score = 5;
      else if (satisfaction.includes("Puas") || satisfaction.includes("Baik")) score = 4;
      else if (satisfaction.includes("Cukup")) score = 3;
      else if (satisfaction.includes("Kurang")) score = 2;
      else if (satisfaction.includes("Tidak")) score = 1;

      if (score > 0) {
        totalScore += score;
        validSurveys++;
      }
    });

    const rataKepuasan = validSurveys > 0 ? (totalScore / validSurveys).toFixed(1) : "0.0";

    return {
      totalSurvey: surveyData.length,
      totalAduan: aduan?.length || 0,
      totalTamu: tamu?.length || 0,
      rataKepuasan,
    };
  } catch (error) {
    console.error("❌ Error getStatistik:", error);
    return {
      totalSurvey: 0,
      totalAduan: 0,
      totalTamu: 0,
      rataKepuasan: "0.0",
    };
  }
}
