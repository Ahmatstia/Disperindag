const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL!;

// Tipe data untuk TypeScript
type SurveyData = {
  Timestamp?: string;
  Nama?: string;
  Pekerjaan?: string;
  "Jenis Kelamin"?: string;
  Kepuasan?: string;
  [key: string]: any;
};

type AduanData = {
  Timestamp?: string;
  Nama?: string;
  "No HP"?: string;
  Kategori?: string;
  "Isi Aduan"?: string;
  Status?: string;
  [key: string]: any;
};

type TamuData = {
  Timestamp?: string;
  Nama?: string;
  Instansi?: string;
  Keperluan?: string;
  "Bertemu Dengan"?: string;
  [key: string]: any;
};

// Ambil semua data dari Apps Script
export async function getAllData() {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Gagal ambil data:", error);
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

// Ambil data survey saja
export async function getSurveyData(): Promise<SurveyData[]> {
  const data = await getAllData();
  return data.survey || [];
}

// Ambil data aduan saja
export async function getAduanData(): Promise<AduanData[]> {
  const data = await getAllData();
  return data.aduan || [];
}

// Ambil data tamu saja
export async function getTamuData(): Promise<TamuData[]> {
  const data = await getAllData();
  return data.tamu || [];
}

// Ambil statistik saja
export async function getStatistik() {
  const data = await getAllData();
  return (
    data.statistik || {
      totalSurvey: 0,
      totalAduan: 0,
      totalTamu: 0,
      rataKepuasan: 0,
    }
  );
}
