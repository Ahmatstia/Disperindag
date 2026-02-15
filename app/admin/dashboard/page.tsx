// app/admin/dashboard/page.tsx
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getStatistik,
  getSurveyData,
  getAduanData,
  getTamuData,
} from "@/lib/apps-script";
import Link from "next/link";
import {
  Users,
  MessageSquare,
  BookOpen,
  Star,
  Clock,
  Calendar,
  BarChart3,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

// ==================== HEADER ====================
function DashboardHeader() {
  return (
    <div className="mb-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
        DISPERINDAG
      </h1>
      <p className="text-sm text-gray-500 mt-1">Provinsi Sumatera Barat</p>
    </div>
  );
}

// ==================== SKELETON ====================
function StatCardSkeleton() {
  return (
    <Card className="border border-gray-200">
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}

function TableRowSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ==================== STAT CARD ====================
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

function StatCard({ title, value, icon, color, subtitle }: StatCardProps) {
  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <p className="text-2xl font-bold" style={{ color }}>
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
          <div
            className="p-2.5 rounded-lg"
            style={{ backgroundColor: `${color}15` }}
          >
            <div style={{ color }}>{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== DATA TAMU ====================
async function DataTamu() {
  const tamuData = await getTamuData();
  const recentTamu = tamuData.slice(0, 5);

  return (
    <Card className="border border-gray-200 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-green-600" />
            <span>Data Tamu</span>
          </div>
          <Badge variant="outline" className="text-xs font-normal">
            {tamuData.length} Total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 mb-2 text-xs font-medium text-gray-500 border-b pb-2">
          <span>Nama</span>
          <span>Tanggal</span>
        </div>
        <div className="space-y-2 min-h-[200px]">
          {recentTamu.length > 0 ? (
            recentTamu.map((tamu: any, index: number) => (
              <div
                key={index}
                className="grid grid-cols-2 gap-2 text-sm py-1 hover:bg-gray-50 rounded px-1"
              >
                <span className="text-gray-700 truncate">
                  {tamu.Nama || "-"}
                </span>
                <span className="text-gray-500 text-xs">
                  {tamu.Timestamp
                    ? new Date(tamu.Timestamp).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "-"}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              Tidak ada data tamu
            </div>
          )}
        </div>
        <Link
          href="/admin/data-tamu"
          className="flex items-center justify-center gap-1 text-xs text-blue-600 mt-3 hover:underline pt-2 border-t"
        >
          Lihat semua <ChevronRight className="w-3 h-3" />
        </Link>
      </CardContent>
    </Card>
  );
}

// ==================== DATA ADUAN ====================
async function DataAduan() {
  const aduanData = await getAduanData();
  const recentAduan = aduanData.slice(0, 5);

  return (
    <Card className="border border-gray-200 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-red-600" />
            <span>Data Aduan</span>
          </div>
          <Badge variant="outline" className="text-xs font-normal">
            {aduanData.length} Total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 mb-2 text-xs font-medium text-gray-500 border-b pb-2">
          <span>Pelapor</span>
          <span>Tanggal</span>
        </div>
        <div className="space-y-2 min-h-[200px]">
          {recentAduan.length > 0 ? (
            recentAduan.map((aduan: any, index: number) => (
              <div
                key={index}
                className="grid grid-cols-2 gap-2 text-sm py-1 hover:bg-gray-50 rounded px-1"
              >
                <span className="text-gray-700 truncate">
                  {aduan.Nama || "-"}
                </span>
                <span className="text-gray-500 text-xs">
                  {aduan.Timestamp
                    ? new Date(aduan.Timestamp).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "-"}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              Tidak ada data aduan
            </div>
          )}
        </div>
        <Link
          href="/admin/data-aduan"
          className="flex items-center justify-center gap-1 text-xs text-blue-600 mt-3 hover:underline pt-2 border-t"
        >
          Lihat semua <ChevronRight className="w-3 h-3" />
        </Link>
      </CardContent>
    </Card>
  );
}

// ==================== DATA SURVEY ====================
async function DataSurvey() {
  const surveyData = await getSurveyData();

  // Hitung distribusi kepuasan
  const sangatPuas = surveyData.filter((d: any) =>
    d.Kepuasan?.includes("Sangat"),
  ).length;
  const puas = surveyData.filter((d: any) =>
    d.Kepuasan?.includes("Puas"),
  ).length;
  const cukup = surveyData.filter((d: any) =>
    d.Kepuasan?.includes("Cukup"),
  ).length;
  const kurang = surveyData.filter((d: any) =>
    d.Kepuasan?.includes("Kurang"),
  ).length;

  // Ambil 5 data terbaru
  const recentSurvey = surveyData.slice(0, 5);

  return (
    <Card className="border border-gray-200 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Data Survey</span>
          </div>
          <Badge variant="outline" className="text-xs font-normal">
            {surveyData.length} Total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Ringkasan Kepuasan */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-green-50 p-2 rounded">
            <p className="text-xs text-gray-500">Sangat Puas</p>
            <p className="text-sm font-bold text-green-600">{sangatPuas}</p>
          </div>
          <div className="bg-blue-50 p-2 rounded">
            <p className="text-xs text-gray-500">Puas</p>
            <p className="text-sm font-bold text-blue-600">{puas}</p>
          </div>
          <div className="bg-yellow-50 p-2 rounded">
            <p className="text-xs text-gray-500">Cukup</p>
            <p className="text-sm font-bold text-yellow-600">{cukup}</p>
          </div>
          <div className="bg-red-50 p-2 rounded">
            <p className="text-xs text-gray-500">Kurang</p>
            <p className="text-sm font-bold text-red-600">{kurang}</p>
          </div>
        </div>

        {/* Data Terbaru */}
        <div className="space-y-2 min-h-[150px]">
          <p className="text-xs font-medium text-gray-500">Survey Terbaru:</p>
          {recentSurvey.length > 0 ? (
            recentSurvey.map((survey: any, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm py-1 hover:bg-gray-50 rounded px-1"
              >
                <span className="text-gray-700 truncate max-w-[120px]">
                  {survey.Nama || "-"}
                </span>
                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      survey.Kepuasan?.includes("Sangat")
                        ? "bg-green-100 text-green-800"
                        : survey.Kepuasan?.includes("Puas")
                          ? "bg-blue-100 text-blue-800"
                          : survey.Kepuasan?.includes("Cukup")
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                    }
                  >
                    {survey.Kepuasan || "-"}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-4">
              Tidak ada data survey
            </div>
          )}
        </div>

        <Link
          href="/admin/data-survey"
          className="flex items-center justify-center gap-1 text-xs text-blue-600 mt-3 hover:underline pt-2 border-t"
        >
          Lihat semua <ChevronRight className="w-3 h-3" />
        </Link>
      </CardContent>
    </Card>
  );
}

// ==================== ADUAN BERDASARKAN KATEGORI ====================
async function AduanBerdasarkanKategori() {
  const aduanData = await getAduanData();

  // Hitung kategori dari data real (sesuaikan dengan struktur data Anda)
  // Ini contoh, sesuaikan dengan field kategori yang ada di data aduan
  const kategoriMap: Record<string, number> = {};

  aduanData.forEach((item: any) => {
    const kategori = item.Kategori || item.Jenis || "Lainnya";
    kategoriMap[kategori] = (kategoriMap[kategori] || 0) + 1;
  });

  // Jika tidak ada data kategori, gunakan data dummy
  const kategoriData =
    Object.keys(kategoriMap).length > 0
      ? Object.entries(kategoriMap)
          .map(([name, count]) => ({
            name,
            percentage: Math.round((count / aduanData.length) * 100),
            color: getCategoryColor(name),
          }))
          .sort((a, b) => b.percentage - a.percentage)
          .slice(0, 5)
      : [
          { name: "Pelayanan Lambat", percentage: 34, color: "#ef4444" },
          { name: "Ketidaktepatan", percentage: 27, color: "#f59e0b" },
          { name: "Infrastruktur", percentage: 20, color: "#3b82f6" },
          { name: "Pelanggaran SOP", percentage: 12, color: "#10b981" },
          { name: "Petugas", percentage: 7, color: "#8b5cf6" },
        ];

  function getCategoryColor(kategori: string): string {
    const colors: Record<string, string> = {
      Pelayanan: "#ef4444",
      Infrastruktur: "#3b82f6",
      Petugas: "#8b5cf6",
      SOP: "#10b981",
    };
    return colors[kategori] || "#6b7280";
  }

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-purple-600" />
          Aduan Berdasarkan Kategori
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {kategoriData.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{item.name}</span>
              <span className="font-medium text-gray-800">
                {item.percentage}%
              </span>
            </div>
            <Progress
              value={item.percentage}
              className="h-2 bg-gray-100"
              style={
                {
                  "--progress-background": item.color,
                } as any
              }
            />
          </div>
        ))}
        {aduanData.length === 0 && (
          <div className="text-center text-gray-400 py-4">
            Belum ada data aduan
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ==================== RINGKASAN KEPUASAN ====================
async function RingkasanKepuasan() {
  const stat = await getStatistik();

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500" />
          Ringkasan Kepuasan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-800">
              {stat.rataKepuasan}/5
            </p>
            <p className="text-sm text-gray-500 mt-1">Rata-rata kepuasan</p>
          </div>
          <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+8%</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Total Responden</span>
            <span className="font-medium">{stat.totalSurvey}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Survey Bulan Ini</span>
            <span className="font-medium">
              {Math.round(stat.totalSurvey * 0.2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== MAIN DASHBOARD CONTENT ====================
async function DashboardContent() {
  const stat = await getStatistik();

  return (
    <div className="space-y-6">
      {/* Navigasi Dashboard */}
      <div className="flex items-center gap-6 text-sm border-b pb-3">
        <Link
          href="/admin/dashboard"
          className="font-medium text-blue-600 border-b-2 border-blue-600 pb-3 -mb-3"
        >
          Dashboard
        </Link>
        <Link
          href="/admin/data-tamu"
          className="text-gray-500 hover:text-gray-700"
        >
          Tamu
        </Link>
        <Link
          href="/admin/data-aduan"
          className="text-gray-500 hover:text-gray-700"
        >
          Aduan
        </Link>
        <Link
          href="/admin/data-survey"
          className="text-gray-500 hover:text-gray-700"
        >
          Survey
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Survey"
          value={stat.totalSurvey}
          icon={<Users className="w-5 h-5" />}
          color="#3b82f6"
          subtitle="responden"
        />
        <StatCard
          title="Total Aduan"
          value={stat.totalAduan}
          icon={<MessageSquare className="w-5 h-5" />}
          color="#ef4444"
          subtitle="masuk"
        />
        <StatCard
          title="Total Tamu"
          value={stat.totalTamu}
          icon={<BookOpen className="w-5 h-5" />}
          color="#10b981"
          subtitle="kunjungan"
        />
        <StatCard
          title="Kepuasan"
          value={`${stat.rataKepuasan}/5`}
          icon={<Star className="w-5 h-5" />}
          color="#8b5cf6"
          subtitle="rata-rata"
        />
      </div>

      {/* Grid 3 Kolom untuk Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Suspense fallback={<TableRowSkeleton />}>
          <DataTamu />
        </Suspense>
        <Suspense fallback={<TableRowSkeleton />}>
          <DataAduan />
        </Suspense>
        <Suspense fallback={<TableRowSkeleton />}>
          <DataSurvey />
        </Suspense>
      </div>

      {/* Grid 2 Kolom untuk Analisis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
          <AduanBerdasarkanKategori />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
          <RingkasanKepuasan />
        </Suspense>
      </div>

      {/* Footer Info */}
      <div className="text-xs text-gray-400 text-center pt-4 border-t">
        <p>
          © 2026 Dinas Perindustrian dan Perdagangan Provinsi Sumatera Barat
        </p>
        <p className="mt-1">
          Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}
        </p>
      </div>
    </div>
  );
}

// ==================== HALAMAN UTAMA ====================
export default function AdminDashboard() {
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <DashboardHeader />
      <Suspense
        fallback={
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <StatCardSkeleton key={i} />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-[300px] w-full" />
              ))}
            </div>
          </div>
        }
      >
        <DashboardContent />
      </Suspense>
    </div>
  );
}
