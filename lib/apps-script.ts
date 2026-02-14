// lib/apps-script.ts
const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL!;

// Fungsi untuk fetch di server (tidak bisa JSONP, harus pakai proxy)
export async function getAllData() {
  try {
    console.log("📡 Fetching dari Apps Script via proxy...");

    // Pakai proxy API internal
    const response = await fetch("/api/proxy", {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Data berhasil diambil:", data);

    return data;
  } catch (error) {
    console.error("❌ Gagal ambil data:", error);
    return {
      survey: [],
      aduan: [],
      tamu: [],
      statistik: {
        totalSurvey: 0,
        totalAduan: 0,
        totalTamu: 0,
        rataKepuasan: 0,
      },
    };
  }
}

// Format data survey
export async function getSurveyData() {
  const data = await getAllData();

  return (data.survey || []).map((item: any) => ({
    Timestamp: item.Timestamp || "",
    Nama: item.Nama || "",
    Pekerjaan: item["Pekerjaan "]?.trim() || item.Pekerjaan || "",
    "Jenis Kelamin": item["Jenis Kelamin"] || "",
    Kepuasan: item["Tingkat Kepuasan "]?.toString() || item.Kepuasan || "0",
  }));
}

// Format data aduan
export async function getAduanData() {
  const data = await getAllData();

  return (data.aduan || []).map((item: any) => ({
    Timestamp: item.Timestamp || "",
    Nama: item["Nama Lengkap"] || "",
    "No HP": item["Nomor HP"]?.toString() || "",
    Kategori: item["Kategori Aduan"] || "",
    "Isi Aduan": item["Isi Aduan"] || "",
    Status: item.Status || "pending",
  }));
}

// Format data tamu
export async function getTamuData() {
  const data = await getAllData();

  return (data.tamu || []).map((item: any) => ({
    Timestamp: item.Timestamp || "",
    Nama: item.Nama || "",
    Instansi: item["Instansi/perusahaan"] || "",
    Keperluan: item.Keperluan || "",
    "Bertemu Dengan": item["Bertemu dg"] || "",
  }));
}

// Hitung statistik
export async function getStatistik() {
  const data = await getAllData();

  let totalKepuasan = 0;
  let jumlahData = 0;

  data.survey?.forEach((item: any) => {
    const nilai = parseInt(item["Tingkat Kepuasan "] || item.Kepuasan || "0");
    if (!isNaN(nilai) && nilai > 0) {
      totalKepuasan += nilai;
      jumlahData++;
    }
  });

  const rataKepuasan =
    jumlahData > 0 ? (totalKepuasan / jumlahData).toFixed(1) : 0;

  return {
    totalSurvey: data.survey?.length || 0,
    totalAduan: data.aduan?.length || 0,
    totalTamu: data.tamu?.length || 0,
    rataKepuasan: rataKepuasan,
  };
}
