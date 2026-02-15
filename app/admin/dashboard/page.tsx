import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getStatistik,
  getSurveyData,
  getAduanData,
  getTamuData,
} from "@/lib/apps-script";
import Link from "next/link";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Users,
  MessageSquare,
  BookOpen,
  Star,
  TrendingUp,
  Clock,
  AlertCircle,
  Calendar,
  BarChart3,
  Download,
  FileText,
  Bell,
  UserPlus,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Komponen Statistik Card dengan Icon dan Trend
function StatCard({
  title,
  value,
  icon,
  color,
  trend,
  subtitle,
  bgColor,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgColor?: string;
  trend?: string;
  subtitle?: string;
}) {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className={`absolute inset-0 bg-linear-to-br ${color} opacity-5`} />
      <CardContent className="p-6 relative">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <p className="text-3xl font-bold" style={{ color }}>
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${bgColor || "bg-gray-100"}`}>
            <div style={{ color }}>{icon}</div>
          </div>
        </div>
        {trend && (
          <div className="mt-3 flex items-center text-xs">
            <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">{trend}</span>
            <span className="text-gray-400 ml-1">dari bulan lalu</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Komponen Quick Access Card
function QuickAccessCard({
  href,
  icon,
  title,
  desc,
  color,
  badge,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
  badge?: string;
}) {
  return (
    <Link href={href}>
      <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-100 h-full">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl`}
                style={{ backgroundColor: `${color}15` }}
              >
                <div style={{ color }}>{icon}</div>
              </div>
              <div>
                <h3 className="font-semibold text-lg group-hover:text-blue-600 transition">
                  {title}
                </h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            </div>
            {badge && (
              <Badge className="bg-red-100 text-red-800">{badge}</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

interface SurveyItem {
  Nama: string;
  Timestamp: string;
  Kepuasan?: string;
}

interface AduanItem {
  Nama: string;
  Timestamp: string;
  Status: string;
}

interface TamuItem {
  Nama: string;
  Timestamp: string;
}

// Komponen Aktivitas Terbaru
async function RecentActivities() {
  const [surveyData, aduanData, tamuData] = await Promise.all([
    getSurveyData(),
    getAduanData(),
    getTamuData(),
  ]);

  // Gabung dan urutkan semua aktivitas
  const allActivities = [
    ...surveyData.slice(-5).map((item: SurveyItem) => ({
      type: "survey",
      name: item.Nama,
      time: item.Timestamp,
      detail: "mengisi survey kepuasan",
      icon: <Users className="w-4 h-4" />,
      color: "blue",
    })),
    ...aduanData.slice(-5).map((item: AduanItem) => ({
      type: "aduan",
      name: item.Nama,
      time: item.Timestamp,
      detail: "mengirim aduan",
      status: item.Status,
      icon: <MessageSquare className="w-4 h-4" />,
      color: "red",
    })),
    ...tamuData.slice(-5).map((item: TamuItem) => ({
      type: "tamu",
      name: item.Nama,
      time: item.Timestamp,
      detail: "berkunjung",
      icon: <BookOpen className="w-4 h-4" />,
      color: "green",
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 8);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Aktivitas Terbaru
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allActivities.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <Avatar className={`w-8 h-8 bg-${item.color}-100`}>
                <AvatarFallback
                  className={`text-${item.color}-600 bg-${item.color}-100`}
                >
                  {item.icon}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">{item.detail}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(item.time).toLocaleString("id-ID")}
                </p>
              </div>
              {item.type === "aduan" && (
                <Badge
                  className={
                    item.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : item.status === "diproses"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                  }
                >
                  {item.status || "pending"}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Komponen Statistik Detail
async function DetailStats() {
  const [surveyData, aduanData] = await Promise.all([
    getSurveyData(),
    getAduanData(),
  ]);

  // Hitung distribusi kepuasan
  const kepuasanCount = {
    sangatPuas: surveyData.filter((d: SurveyItem) =>
      d.Kepuasan?.includes("Sangat"),
    ).length,
    puas: surveyData.filter((d: SurveyItem) => d.Kepuasan?.includes("Puas"))
      .length,
    cukup: surveyData.filter((d: SurveyItem) => d.Kepuasan?.includes("Cukup"))
      .length,
    kurang: surveyData.filter((d: SurveyItem) => d.Kepuasan?.includes("Kurang"))
      .length,
    tidak: surveyData.filter((d: SurveyItem) => d.Kepuasan?.includes("Tidak"))
      .length,
  };

  const totalKepuasan = surveyData.length || 1;

  // Hitung status aduan
  const aduanStatus = {
    pending: aduanData.filter((d: AduanItem) => d.Status === "pending").length,
    diproses: aduanData.filter((d: AduanItem) => d.Status === "diproses")
      .length,
    selesai: aduanData.filter((d: AduanItem) => d.Status === "selesai").length,
  };

  return (
    <div className="space-y-6">
      {/* Grafik Kepuasan Sederhana */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Distribusi Kepuasan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Sangat Puas</span>
              <span className="font-medium">{kepuasanCount.sangatPuas}</span>
            </div>
            <Progress
              value={(kepuasanCount.sangatPuas / totalKepuasan) * 100}
              className="h-2 bg-gray-200"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Puas</span>
              <span className="font-medium">{kepuasanCount.puas}</span>
            </div>
            <Progress
              value={(kepuasanCount.puas / totalKepuasan) * 100}
              className="h-2 bg-gray-200"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Cukup</span>
              <span className="font-medium">{kepuasanCount.cukup}</span>
            </div>
            <Progress
              value={(kepuasanCount.cukup / totalKepuasan) * 100}
              className="h-2 bg-gray-200"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Kurang</span>
              <span className="font-medium">{kepuasanCount.kurang}</span>
            </div>
            <Progress
              value={(kepuasanCount.kurang / totalKepuasan) * 100}
              className="h-2 bg-gray-200"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tidak Puas</span>
              <span className="font-medium">{kepuasanCount.tidak}</span>
            </div>
            <Progress
              value={(kepuasanCount.tidak / totalKepuasan) * 100}
              className="h-2 bg-gray-200"
            />
          </div>
        </CardContent>
      </Card>

      {/* Status Aduan */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            Status Aduan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                <span className="text-sm">Pending</span>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">
                {aduanStatus.pending}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full" />
                <span className="text-sm">Diproses</span>
              </div>
              <Badge className="bg-blue-100 text-blue-800">
                {aduanStatus.diproses}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full" />
                <span className="text-sm">Selesai</span>
              </div>
              <Badge className="bg-green-100 text-green-800">
                {aduanStatus.selesai}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Komponen Aksi Cepat
function QuickActions() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-green-600" />
          Aksi Cepat
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button className="w-full justify-start gap-2" variant="outline">
          <Download className="w-4 h-4" /> Export Laporan Bulanan
        </Button>
        <Button className="w-full justify-start gap-2" variant="outline">
          <FileText className="w-4 h-4" /> Cetak PDF Rekapitulasi
        </Button>
        <Button className="w-full justify-start gap-2" variant="outline">
          <Bell className="w-4 h-4" /> Kirim Notifikasi
        </Button>
        <Button className="w-full justify-start gap-2" variant="outline">
          <UserPlus className="w-4 h-4" /> Tambah Admin
        </Button>
      </CardContent>
    </Card>
  );
}

// Komponen Statistik Cards Utama
async function StatistikCards() {
  const stat = await getStatistik();

  return (
    <>
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Survey"
          value={stat.totalSurvey}
          icon={<Users className="w-6 h-6" />}
          color="#3b82f6"
          bgColor="bg-blue-50"
          trend="+12%"
          subtitle="responden"
        />
        <StatCard
          title="Total Aduan"
          value={stat.totalAduan}
          icon={<MessageSquare className="w-6 h-6" />}
          color="#ef4444"
          bgColor="bg-red-50"
          trend="+5%"
          subtitle="masuk"
        />
        <StatCard
          title="Total Tamu"
          value={stat.totalTamu}
          icon={<BookOpen className="w-6 h-6" />}
          color="#10b981"
          bgColor="bg-green-50"
          trend="+8%"
          subtitle="kunjungan"
        />
        <StatCard
          title="Rata-rata Kepuasan"
          value={`${stat.rataKepuasan}/5`}
          icon={<Star className="w-6 h-6" />}
          color="#8b5cf6"
          bgColor="bg-purple-50"
          subtitle="dari 5"
        />
      </div>

      {/* Quick Access & Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Links - 2 kolom */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">Akses Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuickAccessCard
              href="/admin/data-survey"
              icon={<Users className="w-6 h-6" />}
              title="Data Survey"
              desc="Lihat dan kelola data survey"
              color="#3b82f6"
            />
            <QuickAccessCard
              href="/admin/data-aduan"
              icon={<MessageSquare className="w-6 h-6" />}
              title="Data Aduan"
              desc="Monitor dan tindak lanjuti aduan"
              color="#ef4444"
              badge={
                stat.totalAduan > 0 ? stat.totalAduan.toString() : undefined
              }
            />
            <QuickAccessCard
              href="/admin/data-tamu"
              icon={<BookOpen className="w-6 h-6" />}
              title="Buku Tamu"
              desc="Rekam jejak kunjungan"
              color="#10b981"
            />
            <QuickAccessCard
              href="/admin/laporan"
              icon={<BarChart3 className="w-6 h-6" />}
              title="Laporan"
              desc="Generate laporan bulanan"
              color="#8b5cf6"
            />
          </div>
        </div>

        {/* Quick Actions - 1 kolom */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Aksi Cepat
          </h2>
          <QuickActions />
        </div>
      </div>

      {/* Recent Activities & Detail Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities - 2 kolom */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Aktivitas Terkini
          </h2>
          <Suspense fallback={<LoadingSpinner />}>
            <RecentActivities />
          </Suspense>
        </div>

        {/* Detail Stats - 1 kolom */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Statistik Detail
          </h2>
          <Suspense fallback={<LoadingSpinner />}>
            <DetailStats />
          </Suspense>
        </div>
      </div>
    </>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header dengan Welcome Message */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>
          <p className="text-gray-500 mt-1">
            Selamat datang kembali! Berikut ringkasan layanan Disperindag.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span className="text-sm text-gray-600">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Main Content dengan Suspense */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-96">
            <LoadingSpinner />
          </div>
        }
      >
        <StatistikCards />
      </Suspense>
    </div>
  );
}
