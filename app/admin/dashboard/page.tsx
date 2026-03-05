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
  BarChart3,
  ChevronRight,
  TrendingUp,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DashboardData {
  Timestamp: string;
  Nama?: string;
  [key: string]: string | number | undefined;
}

interface TamuItem extends DashboardData {
  Instansi?: string;
}

interface AduanItem extends DashboardData {
  Status?: string;
  Kategori?: string;
}

interface SurveyItem extends DashboardData {
  Pekerjaan?: string;
  Kepuasan?: string;
}

// ==================== HEADER ====================
function DashboardHeader() {
  return (
    <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-gradient-to-r from-blue-700 to-indigo-800 p-8 rounded-3xl shadow-xl shadow-blue-100 relative overflow-hidden">
      {/* Efek Cahaya Dekoratif */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl -ml-10 -mb-10" />
      
      <div className="relative z-10">
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
          DISPERINDAG <span className="text-blue-200">PORTAL</span>
        </h1>
        <div className="flex items-center gap-2 mt-2">
           <Badge className="bg-blue-400/20 text-blue-100 hover:bg-blue-400/30 border-none shadow-none font-bold">SUMATERA BARAT</Badge>
           <span className="text-xs text-blue-200/60 font-medium">Control Tower • Real-time Monitoring</span>
        </div>
      </div>
      
      <div className="relative z-10 hidden md:block text-right">
         <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-[.25em] mb-1">
            <TrendingUp className="w-3 h-3" />
            System Live
         </div>
         <p className="text-white text-lg font-bold">READY TO MONITOR</p>
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <Card className="border-none shadow-sm bg-white overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-24 mt-2" />
          </div>
          <Skeleton className="h-12 w-12 rounded-2xl" />
        </div>
      </CardContent>
    </Card>
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
    <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white overflow-hidden group">
      <div 
        className="absolute top-0 left-0 w-1 h-full" 
        style={{ backgroundColor: color }}
      />
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              {title}
            </p>
            <p className="text-3xl font-extrabold text-gray-900 group-hover:scale-105 transition-transform origin-left">
              {value}
            </p>
            {subtitle && (
              <div className="flex items-center gap-1 mt-2">
                <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                  {subtitle}
                </span>
                <TrendingUp className="w-3 h-3 text-green-500" />
              </div>
            )}
          </div>
          <div
            className="p-4 rounded-2xl transition-colors duration-300 group-hover:bg-opacity-20"
            style={{ backgroundColor: `${color}10` }}
          >
            <div style={{ color }} className="group-hover:scale-110 transition-transform">
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== DATA TAMU ====================
function DataTamu({ tamuData }: { tamuData: TamuItem[] }) {
  const recentTamu = tamuData.slice(0, 5);

  return (
    <Card className="border-none shadow-sm h-full overflow-hidden bg-white">
      <CardHeader className="pb-3 border-b border-gray-50">
        <CardTitle className="text-sm font-bold flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-50 rounded-lg">
              <BookOpen className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-gray-800">Kunjungan Tamu</span>
          </div>
          <Link href="/admin/data-tamu" className="text-xs text-blue-600 hover:underline flex items-center gap-0.5 font-medium">
            Detail <ChevronRight className="w-3 h-3" />
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-50 min-h-[300px]">
          {recentTamu.length > 0 ? (
            recentTamu.map((tamu: TamuItem, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-700 font-bold text-xs">
                    {tamu.Nama?.charAt(0) || "T"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">
                      {tamu.Nama || "-"}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      {tamu.Instansi || "Personal"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-700">
                    {tamu.Timestamp ? new Date(tamu.Timestamp).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' }) : "-"}
                  </p>
                  <p className="text-[10px] text-gray-400">
                     {tamu.Timestamp ? new Date(tamu.Timestamp).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }) : ""}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                <BookOpen className="w-8 h-8 text-gray-200" />
              </div>
              <p className="text-sm font-medium">Tidak ada data tamu</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== DATA ADUAN ====================
function DataAduan({ aduanData }: { aduanData: AduanItem[] }) {
  const recentAduan = aduanData.slice(0, 5);

  return (
    <Card className="border-none shadow-sm h-full overflow-hidden bg-white">
      <CardHeader className="pb-3 border-b border-gray-50">
        <CardTitle className="text-sm font-bold flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-50 rounded-lg">
              <MessageSquare className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-gray-800">Aduan Masuk</span>
          </div>
          <Link href="/admin/data-aduan" className="text-xs text-blue-600 hover:underline flex items-center gap-0.5 font-medium">
            Detail <ChevronRight className="w-3 h-3" />
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-50 min-h-[300px]">
          {recentAduan.length > 0 ? (
            recentAduan.map((aduan: AduanItem, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-700 font-bold text-xs">
                    {aduan.Nama?.charAt(0) || "A"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">
                      {aduan.Nama || "-"}
                    </p>
                    <Badge variant="outline" className="text-[8px] h-4 px-1 leading-none bg-orange-50 border-orange-200 text-orange-700">
                      {aduan.Status || "Baru"}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-700">
                    {aduan.Timestamp ? new Date(aduan.Timestamp).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' }) : "-"}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {aduan.Timestamp ? new Date(aduan.Timestamp).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }) : ""}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                <MessageSquare className="w-8 h-8 text-gray-200" />
              </div>
              <p className="text-sm font-medium">Tidak ada data aduan</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== DATA SURVEY ====================
function DataSurvey({ surveyData }: { surveyData: SurveyItem[] }) {
  // Hitung distribusi kepuasan
  const sangatPuas = surveyData.filter((d: SurveyItem) => d.Kepuasan?.includes("Sangat")).length;
  const puas = surveyData.filter((d: SurveyItem) => d.Kepuasan?.includes("Puas") && !d.Kepuasan?.includes("Sangat")).length;
  const cukup = surveyData.filter((d: SurveyItem) => d.Kepuasan?.includes("Cukup")).length;
  const kurang = surveyData.filter((d: SurveyItem) => d.Kepuasan?.includes("Kurang") || d.Kepuasan?.includes("Tidak")).length;

  // Ambil 5 data terbaru
  const recentSurvey = surveyData.slice(0, 5);

  return (
    <Card className="border-none shadow-sm h-full overflow-hidden bg-white">
      <CardHeader className="pb-3 border-b border-gray-50">
        <CardTitle className="text-sm font-bold flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-gray-800">Survey Terbaru</span>
          </div>
          <Link href="/admin/data-survey" className="text-xs text-blue-600 hover:underline flex items-center gap-0.5 font-medium">
            Detail <ChevronRight className="w-3 h-3" />
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Ringkasan Kepuasan - GRID MODERN */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="text-center">
            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Puas+</p>
            <div className="h-8 w-full bg-green-500 rounded-md flex items-center justify-center text-white text-xs font-bold">
               {sangatPuas}
            </div>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Puas</p>
            <div className="h-8 w-full bg-blue-500 rounded-md flex items-center justify-center text-white text-xs font-bold">
               {puas}
            </div>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Cukup</p>
            <div className="h-8 w-full bg-yellow-500 rounded-md flex items-center justify-center text-white text-xs font-bold">
               {cukup}
            </div>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Kurang</p>
            <div className="h-8 w-full bg-red-500 rounded-md flex items-center justify-center text-white text-xs font-bold">
               {kurang}
            </div>
          </div>
        </div>

        {/* Data Terbaru */}
        <div className="space-y-4 min-h-[170px]">
          {recentSurvey.length > 0 ? (
            recentSurvey.map((survey: SurveyItem, index: number) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xs shadow-sm">
                   {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {survey.Nama || "Anonim"}
                  </p>
                  <p className="text-[11px] text-gray-400 font-medium">
                    {survey.Pekerjaan || "Siswa / Mahasiswa"}
                  </p>
                </div>
                <Badge
                  className={cn(
                    "text-[9px] px-2 py-0 h-5 leading-none shadow-none font-bold uppercase",
                    survey.Kepuasan?.includes("Sangat") ? "bg-green-500 text-white" :
                    survey.Kepuasan?.includes("Puas") ? "bg-blue-500 text-white" :
                    "bg-amber-500 text-white"
                  )}
                >
                  {survey.Kepuasan?.split(" ")[0] || "-"}
                </Badge>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-[170px] text-gray-400">
              <p className="text-sm">Tidak ada data survey</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== ADUAN BERDASARKAN KATEGORI ====================
function AduanBerdasarkanKategori({ aduanData }: { aduanData: AduanItem[] }) {
  const kategoriMap: Record<string, number> = {};

  aduanData.forEach((item: AduanItem) => {
    const kategori = String(item["Hal Peristiwa"] || item.Kategori || "Lainnya");
    // Ambil kata pertama sebagai kategori utama jika terlalu panjang
    const mainKategori = kategori.split(/[/\s,]/)[0].substring(0, 15);
    kategoriMap[mainKategori] = (kategoriMap[mainKategori] || 0) + 1;
  });

  const kategoriData =
    Object.keys(kategoriMap).length > 0
      ? Object.entries(kategoriMap)
          .map(([name, count]) => ({
            name,
            percentage: Math.round((count / aduanData.length) * 100),
            color: getCategoryColor(name),
          }))
          .sort((a, b) => b.percentage - a.percentage)
          .slice(0, 4)
      : [];

  function getCategoryColor(name: string): string {
    const colors: Record<string, string> = {
      Pelayanan: "#3b82f6",
      Fasilitas: "#c9973a",
      Kebersihan: "#10b981",
      Timbangan: "#f59e0b",
      Pasar: "#8b5cf6",
    };
    return colors[name] || "#94a3b8";
  }

  return (
    <Card className="border-none shadow-sm overflow-hidden bg-white">
      <CardHeader className="pb-3 border-b border-gray-50">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-gray-800">
          <div className="p-1.5 bg-purple-50 rounded-lg">
             <BarChart3 className="w-4 h-4 text-purple-600" />
          </div>
          Analisis Kategori Aduan
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {kategoriData.length > 0 ? (
          <div className="space-y-6">
            {kategoriData.map((item, index) => (
              <div key={index} className="group">
                <div className="flex justify-between text-xs mb-2 items-end">
                  <span className="text-gray-500 font-bold uppercase tracking-tight">{item.name}</span>
                  <span className="font-extrabold text-gray-900 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                    {item.percentage}%
                  </span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                     className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                     style={{ 
                       width: `${item.percentage}%`, 
                       backgroundColor: item.color 
                     }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
             <p className="text-sm font-medium">Belum ada kategori aduan</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ==================== RINGKASAN KEPUASAN ====================
function RingkasanKepuasan({ stat }: { stat: { rataKepuasan: string; totalSurvey: number } }) {
  return (
    <Card className="border-none shadow-sm overflow-hidden bg-white">
      <CardHeader className="pb-3 border-b border-gray-50">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-gray-800">
          <div className="p-1.5 bg-yellow-50 rounded-lg">
            <Star className="w-4 h-4 text-yellow-500" />
          </div>
          Indeks Kepuasan
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 text-center">
        <div className="relative inline-flex items-center justify-center mb-6">
          {/* Ring dekoratif */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-100 to-amber-50 animate-pulse" />
          <div className="relative w-32 h-32 rounded-full border-4 border-yellow-400 bg-white flex flex-col items-center justify-center shadow-inner">
             <span className="text-4xl font-extrabold text-gray-900 leading-none">
                {stat.rataKepuasan}
             </span>
             <span className="text-[10px] text-gray-500 font-bold uppercase mt-1 tracking-tighter">
                {Number(stat.rataKepuasan) >= 4 ? "Sangat Baik" : Number(stat.rataKepuasan) >= 3 ? "Baik" : "Cukup"}
             </span>
          </div>
        </div>
        
           <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 col-span-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total Responden</p>
              <p className="text-lg font-extrabold text-gray-800">{stat.totalSurvey}</p>
           </div>
      </CardContent>
    </Card>
  );
}

// ==================== MAIN DASHBOARD CONTENT ====================
async function DashboardContent() {
  // FETCH SEMUA DATA SEKALI SAJA DI TOP-LEVEL
  const [stat, tamuData, aduanData, surveyData] = await Promise.all([
    getStatistik(),
    getTamuData() as Promise<TamuItem[]>,
    getAduanData() as Promise<AduanItem[]>,
    getSurveyData() as Promise<SurveyItem[]>,
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Navigasi Dashboard Modern */}
      <div className="flex items-center p-1 bg-white rounded-2xl shadow-sm border border-gray-100 w-fit">
        <Link
          href="/admin/dashboard"
          className="px-6 py-2.5 rounded-xl font-bold text-sm bg-blue-600 text-white shadow-md shadow-blue-200 transition-all"
        >
          Overview
        </Link>
        <Link
          href="/admin/data-tamu"
          className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-400 hover:text-gray-600 transition-all"
        >
          Tamu
        </Link>
        <Link
          href="/admin/data-aduan"
          className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-400 hover:text-gray-600 transition-all"
        >
          Aduan
        </Link>
        <Link
          href="/admin/data-survey"
          className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-400 hover:text-gray-600 transition-all"
        >
          Survey
        </Link>
      </div>

      {/* Stat Cards - COLORS UPDATED TO BE MORE HARMONIOUS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Survey"
          value={stat.totalSurvey}
          icon={<Users className="w-6 h-6" />}
          color="#3b82f6" 
          subtitle="responden"
        />
        <StatCard
          title="Total Aduan"
          value={stat.totalAduan}
          icon={<MessageSquare className="w-6 h-6" />}
          color="#f43f5e"
          subtitle="masuk"
        />
        <StatCard
          title="Total Tamu"
          value={stat.totalTamu}
          icon={<BookOpen className="w-6 h-6" />}
          color="#10b981"
          subtitle="kunjungan"
        />
        <StatCard
          title="Indeks Kepuasan"
          value={`${stat.rataKepuasan}/5`}
          icon={<Star className="w-6 h-6" />}
          color="#f59e0b"
          subtitle="rata-rata"
        />
      </div>

      {/* Grid Utama untuk Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DataTamu tamuData={tamuData} />
        <DataAduan aduanData={aduanData} />
        <DataSurvey surveyData={surveyData} />
      </div>

      {/* Grid Analisis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AduanBerdasarkanKategori aduanData={aduanData} />
        <RingkasanKepuasan stat={stat} />
      </div>

      {/* Modern Footer */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
           </div>
           <div>
              <p className="text-xs font-extrabold text-gray-800 uppercase tracking-widest">Sistem Informasi Layanan</p>
              <p className="text-[10px] text-gray-400 font-bold">DISPERINDAG Sumatera Barat • Versi 2.0.1</p>
           </div>
        </div>
        <div className="text-right">
           <Badge className="bg-green-50 text-green-700 border-green-100 px-3 py-1 font-bold text-[10px] shadow-none">
              LAST UPDATE: {new Date().toLocaleDateString("id-ID", { day: '2-digit', month: 'long', year: 'numeric' })}
           </Badge>
        </div>
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
