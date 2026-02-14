// lib/apps-script.ts
const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL!;

// Fungsi fetch yang aman untuk server
async function fetchFromProxyServer() {
  try {
    console.log("📡 [SERVER] Fetching dari proxy...");

    const response = await fetch(APPS_SCRIPT_URL, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    const text = await response.text();

    // Parse JSONP
    const jsonMatch = text.match(/callback\((.*)\)/);
    if (!jsonMatch) return null;

    return JSON.parse(jsonMatch[1]);
  } catch (error) {
    console.error("❌ [SERVER] Error:", error);
    return null;
  }
}

// Fungsi fetch untuk client (via proxy)
async function fetchFromProxyClient() {
  try {
    console.log("📡 [CLIENT] Fetching dari proxy...");

    const response = await fetch("/api/proxy", {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    console.error("❌ [CLIENT] Error:", error);
    return null;
  }
}

// Deteksi environment
const isServer = typeof window === "undefined";

// Wrapper function
async function fetchFromProxy() {
  if (isServer) {
    console.log("🖥️ Running on SERVER");
    return await fetchFromProxyServer();
  } else {
    console.log("🌐 Running on CLIENT");
    return await fetchFromProxyClient();
  }
}

// ============================================
// FORMAT DATA SURVEY
// ============================================
export async function getSurveyData() {
  try {
    const data = await fetchFromProxy();
    if (!data || !data.survey) return [];

    return data.survey.map((item: any) => {
      return {
        // Identitas
        Timestamp: item["Timestamp"] || "",
        Nama: item["Nama"] || "",
        Pekerjaan: item["Pekerjaan "]?.trim() || item["Pekerjaan"] || "",
        "Jenis Kelamin": item["Jenis Kelamin"] || "",
        "Rentang Usia": item["Rentang Usia :"] || "",
        Layanan: item["Layanan yang didapatkan"] || "",

        // Kualitas Layanan
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

        // Kompetensi Petugas
        Penguasaan: item["Penguasaan Petugas"] || "",
        Komunikasi: item["Komunikasi Petugas"] || "",
        "Komunikasi Online": item["Komunikasi Online"] || "",
        Sikap: item["Sikap Petugas"] || "",
        Kerapian: item["Kerapian Petugas"] || "",

        // Pengaduan
        "Keberadaan Pengaduan": item["Keberadaan Pengaduan"] || "",
        "Tata Cara Pengaduan": item["Tata Cara Pengaduan"] || "",
        "Pengaduan Online": item["Pengaduan Online"] || "",
        Keberlanjutan: item["Keberlanjutan Pengaduan"] || "",

        // Sarana Prasarana
        "Sarana Kelengkapan": item["Sarana Penunjang Kelengkapan"] || "",
        "Sarana Kelayakan": item["Sarana Penunjang Kelayakan"] || "",
        "Sarana Toilet": item["Sarana Toilet"] || "",
        Kebersihan: item["Kebersihan Sarana"] || "",

        // Pelayanan
        "Front Officer": item["Front Officer"] || "",
        "Ketersediaan Informasi": item["Ketersediaan Informasi"] || "",
        "Kemanfaatan Online": item["Kemanfaatan Online"] || "",

        // Kepuasan Keseluruhan
        Kepuasan: item["Kepuasan Layanan"] || "",
      };
    });
  } catch (error) {
    console.error("❌ Error getSurveyData:", error);
    return [];
  }
}

// ============================================
// FORMAT DATA ADUAN
// ============================================
export async function getAduanData() {
  try {
    const data = await fetchFromProxy();
    if (!data || !data.aduan) return [];

    return data.aduan.map((item: any) => {
      return {
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
        Status: item["Status"] || "pending",
      };
    });
  } catch (error) {
    console.error("❌ Error getAduanData:", error);
    return [];
  }
}

// ============================================
// FORMAT DATA TAMU
// ============================================
export async function getTamuData() {
  try {
    const data = await fetchFromProxy();
    if (!data || !data.tamu) return [];

    return data.tamu.map((item: any) => {
      return {
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
          item["Bidang yang Dituju:"]?.trim() ||
          item["Bidang yang Dituju"] ||
          "",
        Tujuan: item["Tujuan"] || "",
      };
    });
  } catch (error) {
    console.error("❌ Error getTamuData:", error);
    return [];
  }
}

// ============================================
// FUNGSI PAGINATION
// ============================================
export async function getSurveyDataPaginated(page = 1, limit = 50) {
  const data = await getSurveyData();
  const total = data.length;
  const start = (page - 1) * limit;
  const end = page * limit;
  const paginatedData = data.slice(start, end);
  const totalPages = Math.ceil(total / limit);

  return { data: paginatedData, total, page, totalPages, limit };
}

export async function getAduanDataPaginated(page = 1, limit = 50) {
  const data = await getAduanData();
  const total = data.length;
  const start = (page - 1) * limit;
  const end = page * limit;
  const paginatedData = data.slice(start, end);
  const totalPages = Math.ceil(total / limit);

  return { data: paginatedData, total, page, totalPages, limit };
}

export async function getTamuDataPaginated(page = 1, limit = 50) {
  const data = await getTamuData();
  const total = data.length;
  const start = (page - 1) * limit;
  const end = page * limit;
  const paginatedData = data.slice(start, end);
  const totalPages = Math.ceil(total / limit);

  return { data: paginatedData, total, page, totalPages, limit };
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

    // Hitung rata-rata kepuasan
    let totalNilai = 0;
    let jumlahData = 0;

    survey.forEach((item: any) => {
      const kepuasan = item.Kepuasan || "";
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
      totalSurvey: survey.length,
      totalAduan: aduan.length,
      totalTamu: tamu.length,
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
