// scripts/seed-tamu.js - SEEDER UNTUK 50 DATA TAMU
// Jalankan dengan: node scripts/seed-tamu.js

const https = require("https");
const querystring = require("querystring");

// ============================================
// KONFIGURASI - GANTI DENGAN DATA ANDA!
// ============================================
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyBUfzE-wi986gYo1CyAuKy_JAeESfHy4HgmiNR-vUQaKzuPd4OUnJjg8XTT3EPvkOd/exec"; // GANTI!
const SHEET_NAME = "tamu";

// ============================================
// 50 DATA TAMU DUMMY (LENGKAP)
// ============================================
const tamuData = [
  [
    "2026-02-15 08:30:00",
    "Budi Santoso",
    "Laki-laki",
    "18-28 tahun/Gen Z",
    "081234567890",
    "PT Maju Jaya",
    "Staff",
    "Jl. Sudirman No. 123 Padang",
    "Kepala Dinas",
    "Konsultasi Perizinan",
  ],
  [
    "2026-02-15 08:45:00",
    "Siti Aminah",
    "Perempuan",
    "29-44 tahun/Milenial",
    "082345678901",
    "CV Karya Mandiri",
    "Manager",
    "Jl. Khatib Sulaiman No. 45 Padang",
    "Sekretariat",
    "Pengajuan Dokumen",
  ],
  [
    "2026-02-15 09:00:00",
    "Ahmad Fauzi",
    "Laki-laki",
    "45-60 tahun/Gen X",
    "083456789012",
    "PT Industri Maju",
    "Direktur",
    "Jl. By Pass No. 78 Padang",
    "Perdagangan",
    "Koordinasi Program",
  ],
  [
    "2026-02-15 09:15:00",
    "Rina Wati",
    "Perempuan",
    "18-28 tahun/Gen Z",
    "084567890123",
    "UD Berkah",
    "Bendahara",
    "Jl. Gajah Mada No. 56 Padang",
    "PKTN",
    "Ambil Dokumen",
  ],
  [
    "2026-02-15 09:30:00",
    "Hendra Gunawan",
    "Laki-laki",
    "29-44 tahun/Milenial",
    "085678901234",
    "PT Agro Industry",
    "Supervisor",
    "Jl. Diponegoro No. 34 Padang",
    "Industri Agro",
    "Konsultasi Teknis",
  ],
  [
    "2026-02-15 09:45:00",
    "Dewi Lestari",
    "Perempuan",
    "61-79 tahun/Baby Boomers",
    "086789012345",
    "CV Niaga Utama",
    "Owner",
    "Jl. Pemuda No. 12 Padang",
    "Industri Non Agro",
    "Pengajuan Izin",
  ],
  [
    "2026-02-15 10:00:00",
    "Rudi Hartono",
    "Laki-laki",
    "29-44 tahun/Milenial",
    "087890123456",
    "PT Logam Jaya",
    "Staff",
    "Jl. Proklamasi No. 67 Padang",
    "UPTD Logam",
    "Koordinasi Program",
  ],
  [
    "2026-02-15 10:15:00",
    "Maya Sari",
    "Perempuan",
    "18-28 tahun/Gen Z",
    "088901234567",
    "CV Minyak Atsiri",
    "Admin",
    "Jl. Merdeka No. 89 Padang",
    "UPTD Minyak Atsiri",
    "Konsultasi Ekspor",
  ],
  [
    "2026-02-15 10:30:00",
    "Joko Widodo",
    "Laki-laki",
    "45-60 tahun/Gen X",
    "089012345678",
    "PT Perdagangan Nusantara",
    "Manager",
    "Jl. Veteran No. 23 Padang",
    "Perdagangan",
    "Ambil Dokumen",
  ],
  [
    "2026-02-15 10:45:00",
    "Indah Permata",
    "Perempuan",
    "29-44 tahun/Milenial",
    "081112223334",
    "CV Berkat Usaha",
    "Staff",
    "Jl. Sudirman No. 45 Padang",
    "Sekretariat",
    "Pengajuan Surat",
  ],
  [
    "2026-02-15 11:00:00",
    "Agus Salim",
    "Laki-laki",
    "45-60 tahun/Gen X",
    "081223334445",
    "PT Agro Lestari",
    "Direktur",
    "Jl. Khatib Sulaiman No. 67 Padang",
    "Industri Agro",
    "Konsultasi Perizinan",
  ],
  [
    "2026-02-15 11:15:00",
    "Fitri Handayani",
    "Perempuan",
    "18-28 tahun/Gen Z",
    "081334445556",
    "CV Niaga Jaya",
    "Admin",
    "Jl. By Pass No. 89 Padang",
    "PKTN",
    "Pengajuan Dokumen",
  ],
  [
    "2026-02-15 11:30:00",
    "Bambang Hermanto",
    "Laki-laki",
    "29-44 tahun/Milenial",
    "081445556667",
    "PT Metal Industry",
    "Supervisor",
    "Jl. Gajah Mada No. 12 Padang",
    "UPTD Logam",
    "Koordinasi Program",
  ],
  [
    "2026-02-15 11:45:00",
    "Sri Wahyuni",
    "Perempuan",
    "61-79 tahun/Baby Boomers",
    "081556667778",
    "UD Berkat",
    "Bendahara",
    "Jl. Diponegoro No. 34 Padang",
    "Kepala Dinas",
    "Konsultasi",
  ],
  [
    "2026-02-15 12:00:00",
    "Eko Prasetyo",
    "Laki-laki",
    "29-44 tahun/Milenial",
    "081667778889",
    "PT Minyak Atsiri",
    "Manager",
    "Jl. Pemuda No. 56 Padang",
    "UPTD Minyak Atsiri",
    "Pengajuan Izin",
  ],
  [
    "2026-02-15 13:00:00",
    "Ratna Dewi",
    "Perempuan",
    "18-28 tahun/Gen Z",
    "081778889900",
    "CV Karya Muda",
    "Staff",
    "Jl. Proklamasi No. 78 Padang",
    "Perdagangan",
    "Ambil Dokumen",
  ],
  [
    "2026-02-15 13:15:00",
    "Heru Susanto",
    "Laki-laki",
    "45-60 tahun/Gen X",
    "081889900011",
    "PT Niaga Utama",
    "Direktur",
    "Jl. Merdeka No. 90 Padang",
    "Sekretariat",
    "Pengajuan Proposal",
  ],
  [
    "2026-02-15 13:30:00",
    "Nurul Aini",
    "Perempuan",
    "29-44 tahun/Milenial",
    "081990011122",
    "CV Agro Indah",
    "Admin",
    "Jl. Veteran No. 12 Padang",
    "Industri Agro",
    "Konsultasi Teknis",
  ],
  [
    "2026-02-15 13:45:00",
    "Slamet Riyadi",
    "Laki-laki",
    "45-60 tahun/Gen X",
    "082101112233",
    "PT Logam Mulia",
    "Supervisor",
    "Jl. Sudirman No. 34 Padang",
    "UPTD Logam",
    "Koordinasi Program",
  ],
  [
    "2026-02-15 14:00:00",
    "Yuni Astuti",
    "Perempuan",
    "18-28 tahun/Gen Z",
    "082112233344",
    "CV Perdagangan Jaya",
    "Staff",
    "Jl. Khatib Sulaiman No. 56 Padang",
    "PKTN",
    "Pengajuan Dokumen",
  ],
  [
    "2026-02-15 14:15:00",
    "Taufik Hidayat",
    "Laki-laki",
    "29-44 tahun/Milenial",
    "082123344455",
    "PT Industri Agro",
    "Manager",
    "Jl. By Pass No. 78 Padang",
    "Industri Agro",
    "Konsultasi Perizinan",
  ],
  [
    "2026-02-15 14:30:00",
    "Lilis Suryani",
    "Perempuan",
    "61-79 tahun/Baby Boomers",
    "082134455566",
    "CV Niaga",
    "Owner",
    "Jl. Gajah Mada No. 90 Padang",
    "Kepala Dinas",
    "Ambil Dokumen",
  ],
  [
    "2026-02-15 14:45:00",
    "Dedi Kurniawan",
    "Laki-laki",
    "29-44 tahun/Milenial",
    "082145566677",
    "PT Agro Lestari",
    "Staff",
    "Jl. Diponegoro No. 12 Padang",
    "Industri Agro",
    "Konsultasi",
  ],
  [
    "2026-02-15 15:00:00",
    "Rini Susanti",
    "Perempuan",
    "18-28 tahun/Gen Z",
    "082156677788",
    "CV Minyak Atsiri",
    "Admin",
    "Jl. Pemuda No. 34 Padang",
    "UPTD Minyak Atsiri",
    "Pengajuan Izin",
  ],
  [
    "2026-02-15 15:15:00",
    "Hari Setiawan",
    "Laki-laki",
    "45-60 tahun/Gen X",
    "082167788899",
    "PT Perdagangan",
    "Manager",
    "Jl. Proklamasi No. 56 Padang",
    "Perdagangan",
    "Koordinasi Program",
  ],
  [
    "2026-02-15 15:30:00",
    "Mega Wati",
    "Perempuan",
    "29-44 tahun/Milenial",
    "082178899900",
    "CV Karya",
    "Staff",
    "Jl. Merdeka No. 78 Padang",
    "Sekretariat",
    "Pengajuan Dokumen",
  ],
  [
    "2026-02-15 15:45:00",
    "Irwan Hakim",
    "Laki-laki",
    "29-44 tahun/Milenial",
    "082189900011",
    "PT Logam",
    "Supervisor",
    "Jl. Veteran No. 90 Padang",
    "UPTD Logam",
    "Koordinasi",
  ],
  [
    "2026-02-15 16:00:00",
    "Nina Karlina",
    "Perempuan",
    "18-28 tahun/Gen Z",
    "082190011122",
    "CV Agro",
    "Admin",
    "Jl. Sudirman No. 12 Padang",
    "Industri Agro",
    "Konsultasi",
  ],
  [
    "2026-02-16 08:30:00",
    "Adi Nugroho",
    "Laki-laki",
    "29-44 tahun/Milenial",
    "082201122233",
    "PT Niaga",
    "Staff",
    "Jl. Khatib Sulaiman No. 34 Padang",
    "PKTN",
    "Ambil Dokumen",
  ],
  [
    "2026-02-16 08:45:00",
    "Lina Marlina",
    "Perempuan",
    "45-60 tahun/Gen X",
    "082212233344",
    "CV Berkat",
    "Manager",
    "Jl. By Pass No. 56 Padang",
    "Perdagangan",
    "Pengajuan Izin",
  ],
  [
    "2026-02-16 09:00:00",
    "Rizki Pratama",
    "Laki-laki",
    "18-28 tahun/Gen Z",
    "082223344455",
    "PT Industry",
    "Staff",
    "Jl. Gajah Mada No. 78 Padang",
    "Industri Non Agro",
    "Konsultasi",
  ],
  [
    "2026-02-16 09:15:00",
    "Sari Indah",
    "Perempuan",
    "29-44 tahun/Milenial",
    "082234455566",
    "CV Maju",
    "Admin",
    "Jl. Diponegoro No. 90 Padang",
    "Kepala Dinas",
    "Koordinasi Program",
  ],
  [
    "2026-02-16 09:30:00",
    "Bambang S",
    "Laki-laki",
    "45-60 tahun/Gen X",
    "082245566677",
    "PT Agro",
    "Direktur",
    "Jl. Pemuda No. 12 Padang",
    "Industri Agro",
    "Konsultasi Perizinan",
  ],
  [
    "2026-02-16 09:45:00",
    "Diah Permatasari",
    "Perempuan",
    "61-79 tahun/Baby Boomers",
    "082256677788",
    "CV Niaga",
    "Owner",
    "Jl. Proklamasi No. 34 Padang",
    "Sekretariat",
    "Pengajuan Dokumen",
  ],
  [
    "2026-02-16 10:00:00",
    "Fajar Nugraha",
    "Laki-laki",
    "29-44 tahun/Milenial",
    "082267788899",
    "PT Minyak",
    "Manager",
    "Jl. Merdeka No. 56 Padang",
    "UPTD Minyak Atsiri",
    "Konsultasi Ekspor",
  ],
  [
    "2026-02-16 10:15:00",
    "Rosa Melati",
    "Perempuan",
    "18-28 tahun/Gen Z",
    "082278899900",
    "CV Logam",
    "Staff",
    "Jl. Veteran No. 78 Padang",
    "UPTD Logam",
    "Koordinasi",
  ],
  [
    "2026-02-16 10:30:00",
    "Hendra Saputra",
    "Laki-laki",
    "45-60 tahun/Gen X",
    "082289900011",
    "PT Perdagangan",
    "Supervisor",
    "Jl. Sudirman No. 90 Padang",
    "Perdagangan",
    "Ambil Dokumen",
  ],
  [
    "2026-02-16 10:45:00",
    "Lestari Dewi",
    "Perempuan",
    "29-44 tahun/Milenial",
    "082290011122",
    "CV Karya",
    "Admin",
    "Jl. Khatib Sulaiman No. 12 Padang",
    "PKTN",
    "Pengajuan",
  ],
  [
    "2026-02-16 11:00:00",
    "I Made Yoga",
    "Laki-laki",
    "29-44 tahun/Milenial",
    "082301122233",
    "PT Agro Indah",
    "Staff",
    "Jl. By Pass No. 34 Padang",
    "Industri Agro",
    "Konsultasi Teknis",
  ],
  [
    "2026-02-16 11:15:00",
    "Komang Ayu",
    "Perempuan",
    "18-28 tahun/Gen Z",
    "082312233344",
    "CV Niaga Jaya",
    "Admin",
    "Jl. Gajah Mada No. 56 Padang",
    "Sekretariat",
    "Pengajuan Surat",
  ],
  [
    "2026-02-16 11:30:00",
    "Wayan Budi",
    "Laki-laki",
    "45-60 tahun/Gen X",
    "082323344455",
    "PT Logam",
    "Manager",
    "Jl. Diponegoro No. 78 Padang",
    "UPTD Logam",
    "Koordinasi Program",
  ],
  [
    "2026-02-16 11:45:00",
    "Putu Sari",
    "Perempuan",
    "29-44 tahun/Milenial",
    "082334455566",
    "CV Minyak",
    "Staff",
    "Jl. Pemuda No. 90 Padang",
    "UPTD Minyak Atsiri",
    "Konsultasi",
  ],
  [
    "2026-02-16 12:00:00",
    "Ketut Jaya",
    "Laki-laki",
    "61-79 tahun/Baby Boomers",
    "082345566677",
    "PT Niaga",
    "Direktur",
    "Jl. Proklamasi No. 12 Padang",
    "Kepala Dinas",
    "Koordinasi",
  ],
  [
    "2026-02-16 13:00:00",
    "Nyoman Ratih",
    "Perempuan",
    "18-28 tahun/Gen Z",
    "082356677788",
    "CV Agro",
    "Admin",
    "Jl. Merdeka No. 34 Padang",
    "Industri Agro",
    "Pengajuan Izin",
  ],
  [
    "2026-02-16 13:15:00",
    "Gede Putra",
    "Laki-laki",
    "29-44 tahun/Milenial",
    "082367788899",
    "PT Perdagangan",
    "Staff",
    "Jl. Veteran No. 56 Padang",
    "Perdagangan",
    "Ambil Dokumen",
  ],
  [
    "2026-02-16 13:30:00",
    "Komang Trisna",
    "Perempuan",
    "45-60 tahun/Gen X",
    "082378899900",
    "CV Karya",
    "Manager",
    "Jl. Sudirman No. 78 Padang",
    "PKTN",
    "Konsultasi",
  ],
  [
    "2026-02-16 13:45:00",
    "Wayan Sunita",
    "Perempuan",
    "29-44 tahun/Milenial",
    "082389900011",
    "PT Industry",
    "Supervisor",
    "Jl. Khatib Sulaiman No. 90 Padang",
    "Industri Non Agro",
    "Koordinasi",
  ],
  [
    "2026-02-16 14:00:00",
    "Made Darmawan",
    "Laki-laki",
    "18-28 tahun/Gen Z",
    "082390011122",
    "CV Maju Jaya",
    "Staff",
    "Jl. By Pass No. 12 Padang",
    "Sekretariat",
    "Pengajuan Dokumen",
  ],
  [
    "2026-02-16 14:15:00",
    "Putu Indah",
    "Perempuan",
    "29-44 tahun/Milenial",
    "082401122233",
    "PT Agro Lestari",
    "Admin",
    "Jl. Gajah Mada No. 34 Padang",
    "Industri Agro",
    "Konsultasi Perizinan",
  ],
];

// ============================================
// FUNGSI UNTUK MENGIRIM DATA KE APPS SCRIPT
// ============================================
function sendDataToSheet(data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      action: "seed",
      sheetName: SHEET_NAME,
      data: data,
    });

    const url = new URL(APPS_SCRIPT_URL);

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        console.log(`✅ Response: ${responseData.substring(0, 100)}...`);
        resolve(responseData);
      });
    });

    req.on("error", (error) => {
      console.error("❌ Error:", error);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// ============================================
// FUNGSI UTAMA UNTUK SEEDING
// ============================================
async function runSeeder() {
  console.log("🚀 ===== SEEDER DATA TAMU DIMULAI =====");
  console.log(`📊 Total data: ${tamuData.length}`);
  console.log(`📌 Sheet target: ${SHEET_NAME}`);
  console.log(`🔗 Apps Script URL: ${APPS_SCRIPT_URL}`);
  console.log("----------------------------------------");

  let success = 0;
  let failed = 0;

  for (let i = 0; i < tamuData.length; i++) {
    const data = tamuData[i];
    console.log(`📤 [${i + 1}/${tamuData.length}] Mengirim: ${data[1]}...`);

    try {
      await sendDataToSheet(data);
      success++;

      // Delay 500ms antar pengiriman (agar tidak overload)
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Gagal mengirim data ke-${i + 1}:`, error);
      failed++;
    }
  }

  console.log("----------------------------------------");
  console.log("🎉 ===== SEEDER SELESAI =====");
  console.log(`✅ Berhasil: ${success} data`);
  console.log(`❌ Gagal: ${failed} data`);
}

// ============================================
// JALANKAN SEEDER
// ============================================
if (require.main === module) {
  // Tanya konfirmasi dulu
  console.log("⚠️  PERINGATAN: Ini akan menambahkan 50 data ke sheet TAMU!");
  console.log("Pastikan APPS_SCRIPT_URL sudah benar:");
  console.log(APPS_SCRIPT_URL);
  console.log("");
  console.log(
    "Tekan Ctrl+C untuk membatalkan, atau tunggu 5 detik untuk melanjutkan...",
  );

  setTimeout(() => {
    runSeeder();
  }, 5000);
}
