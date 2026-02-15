// lib/apps-script.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

// Cache untuk menyimpan data mentah
let dataCache: {
  survey: any[];
  aduan: any[];
  tamu: any[];
  timestamp: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 menit

// Deteksi environment
const isServer = typeof window === "undefined";

// ============================================
// FUNGSI FETCH UNTUK SERVER
// ============================================
async function fetchFromServer() {
  try {
    console.log("🖥️ [SERVER] Fetching data...");

    // Di server, kita perlu base URL dari environment atau relative
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const url = `${baseUrl}/api/proxy`;

    const response = await fetch(url, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ [SERVER] Error fetching:", error);
    throw error;
  }
}

// ============================================
// FUNGSI FETCH UNTUK CLIENT
// ============================================
async function fetchFromClient() {
  try {
    console.log("🌐 [CLIENT] Fetching data...");

    const response = await fetch("/api/proxy", {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ [CLIENT] Error fetching:", error);
    throw error;
  }
}

// ============================================
// FUNGSI FETCH DENGAN AUTO-DETECT
// ============================================
async function fetchFromProxy(forceRefresh = false) {
  try {
    if (
      !forceRefresh &&
      dataCache &&
      Date.now() - dataCache.timestamp < CACHE_DURATION
    ) {
      console.log("📦 Menggunakan data dari cache");
      return dataCache;
    }

    // Pilih method berdasarkan environment
    const data = isServer ? await fetchFromServer() : await fetchFromClient();

    dataCache = {
      survey: data.survey || [],
      aduan: data.aduan || [],
      tamu: data.tamu || [],
      timestamp: Date.now(),
    };

    return dataCache;
  } catch (error) {
    console.error("❌ Error fetching:", error);
    throw error;
  }
}

// ============================================
// FUNGSI DELETE UNTUK CLIENT
// ============================================
export async function deleteData(sheetName: string, rowIndex: number) {
  // Delete hanya bisa di client
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
      clearCache();
    }

    return data;
  } catch (error) {
    console.error("❌ Delete error:", error);
    throw error;
  }
}

// ============================================
// FORMAT DATA SURVEY (OPTIMIZED)
// ============================================
export async function getSurveyDataOptimized(
  page = 1,
  limit = 50,
  forceRefresh = false,
) {
  try {
    const data = await fetchFromProxy(forceRefresh);
    if (!data || !data.survey)
      return { data: [], total: 0, page, totalPages: 0, hasMore: false };

    const formatted = data.survey.map((item: any) => ({
      Timestamp: item["Timestamp"] || "",
      Nama: item["Nama"] || "",
      Pekerjaan: item["Pekerjaan "]?.trim() || item["Pekerjaan"] || "",
      "Jenis Kelamin": item["Jenis Kelamin"] || "",
      "Rentang Usia": item["Rentang Usia :"] || "",
      Layanan: item["Layanan yang didapatkan"] || "",
      Persyaratan:
        item["Persyaratan Layanan "]?.trim() ||
        item["Persyaratan Layanan"] ||
        "",
      Prosedur: item["Prosedur Pelayanan"] || "",
      "Waktu Proses Berkas": item["Waktu Proses Berkas"] || "",
      "Waktu Selesai Aduan": item["Waktu Selesai Aduan"] || "",
      "Waktu Aduan Online": item["Waktu Aduan Online"] || "",
      "Waktu Respon Online": item["Waktu Respon Online"] || "",
      Biaya: item["Biaya/Tarif"] || "",
      Kesesuaian: item["Kesesuaian Hasil"] || "",
      Penguasaan: item["Penguasaan Petugas"] || "",
      Komunikasi: item["Komunikasi Petugas"] || "",
      "Komunikasi Online": item["Komunikasi Online"] || "",
      Sikap: item["Sikap Petugas"] || "",
      Kerapian: item["Kerapian Petugas"] || "",
      "Keberadaan Pengaduan": item["Keberadaan Pengaduan"] || "",
      "Tata Cara Pengaduan": item["Tata Cara Pengaduan"] || "",
      "Pengaduan Online": item["Pengaduan Online"] || "",
      Keberlanjutan: item["Keberlanjutan Pengaduan"] || "",
      "Sarana Kelengkapan": item["Sarana Penunjang Kelengkapan"] || "",
      "Sarana Kelayakan": item["Sarana Penunjang Kelayakan"] || "",
      "Sarana Toilet": item["Sarana Toilet"] || "",
      Kebersihan: item["Kebersihan Sarana"] || "",
      "Front Officer": item["Front Officer"] || "",
      "Ketersediaan Informasi": item["Ketersediaan Informasi"] || "",
      "Kemanfaatan Online": item["Kemanfaatan Online"] || "",
      Kepuasan: item["Kepuasan Layanan"] || "",
    }));

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
// FORMAT DATA ADUAN (OPTIMIZED)
// ============================================
export async function getAduanDataOptimized(
  page = 1,
  limit = 50,
  forceRefresh = false,
) {
  try {
    const data = await fetchFromProxy(forceRefresh);
    if (!data || !data.aduan)
      return { data: [], total: 0, page, totalPages: 0, hasMore: false };

    const formatted = data.aduan.map((item: any) => ({
      Timestamp: item["Timestamp"] || "",
      Nama: item["Nama"] || "",
      Pekerjaan: item["Pekerjaan"] || "",
      Instansi: item["Instansi/Perusahaan"] || "",
      "Jenis Kelamin": item["Jenis Kelamin"] || "",
      "Rentang Usia": item["Rentang Usia"] || "",
      "Hal Peristiwa": item["Hal/Peristiwa"] || "",
      "Lokasi Peristiwa": item["Lokasi Peristiwa"] || "",
      "Tanggal Kejadian": item["Tanggal Kejadian"] || "",
      "Tindak Lanjut": item["Tindak Lanjut yang Diharapkan"] || "",
    }));

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
    console.error("❌ Error getAduanDataOptimized:", error);
    return { data: [], total: 0, page, totalPages: 0, hasMore: false };
  }
}

// ============================================
// FORMAT DATA TAMU (OPTIMIZED)
// ============================================
export async function getTamuDataOptimized(
  page = 1,
  limit = 50,
  forceRefresh = false,
) {
  try {
    const data = await fetchFromProxy(forceRefresh);
    if (!data || !data.tamu)
      return { data: [], total: 0, page, totalPages: 0, hasMore: false };

    const formatted = data.tamu.map((item: any) => ({
      Timestamp: item["Timestamp"] || "",
      Nama: item["Nama"] || "",
      "Jenis Kelamin":
        item["Jenis Kelamin:"]?.trim() || item["Jenis Kelamin"] || "",
      "Rentang Usia":
        item["Rentang Usia:"]?.trim() || item["Rentang Usia"] || "",
      "No HP": item["Nomor Handphone"] || "",
      Instansi: item["Instansi/Perusahaan"] || "",
      Jabatan: item["Jabatan"] || "",
      Alamat: item["Alamat Instansi/Perusahaan"] || "",
      "Bidang Dituju":
        item["Bidang yang Dituju:"]?.trim() || item["Bidang yang Dituju"] || "",
      Tujuan: item["Tujuan"] || "",
    }));

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
    console.error("❌ Error getTamuDataOptimized:", error);
    return { data: [], total: 0, page, totalPages: 0, hasMore: false };
  }
}

// ============================================
// FUNGSI UNTUK REFRESH CACHE
// ============================================
export function clearCache() {
  dataCache = null;
}

// ============================================
// FUNGSI BACKWARD COMPATIBILITY
// ============================================
export async function getSurveyData() {
  const data = await fetchFromProxy();
  return data?.survey || [];
}

export async function getAduanData() {
  const data = await fetchFromProxy();
  return data?.aduan || [];
}

export async function getTamuData() {
  const data = await fetchFromProxy();
  return data?.tamu || [];
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
// STATISTIK
// ============================================
export async function getStatistik() {
  try {
    const data = await fetchFromProxy();

    let totalNilai = 0;
    let jumlahData = 0;

    data.survey.forEach((item: any) => {
      const kepuasan = item["Kepuasan Layanan"] || "";
      if (
        kepuasan.includes("Sangat Puas") ||
        kepuasan.includes("Sangat Baik")
      ) {
        totalNilai += 5;
        jumlahData++;
      } else if (kepuasan.includes("Puas") || kepuasan.includes("Baik")) {
        totalNilai += 4;
        jumlahData++;
      } else if (kepuasan.includes("Cukup")) {
        totalNilai += 3;
        jumlahData++;
      } else if (kepuasan.includes("Kurang")) {
        totalNilai += 2;
        jumlahData++;
      } else if (kepuasan.includes("Tidak")) {
        totalNilai += 1;
        jumlahData++;
      }
    });

    const rataKepuasan =
      jumlahData > 0 ? (totalNilai / jumlahData).toFixed(1) : "0.0";

    return {
      totalSurvey: data.survey.length,
      totalAduan: data.aduan.length,
      totalTamu: data.tamu.length,
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
