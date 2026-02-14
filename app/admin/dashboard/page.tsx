// app/admin/dashboard/page.tsx
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStatistik, getSurveyData, getAduanData } from "@/lib/apps-script";
import Link from "next/link";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Users,
  MessageSquare,
  BookOpen,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Calendar,
  BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Komponen Statistik Card dengan Icon
function StatCard({
  title,
  value,
  icon,
  color,
  trend,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
  subtitle?: string;
}) {
  return (
    <Card className="border-l-4" style={{ borderLeftColor: color }}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <p className="text-3xl font-bold" style={{ color }}>
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
          <div
            className={`p-3 rounded-full`}
            style={{ backgroundColor: `${color}20` }}
          >
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
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <Link href={href}>
      <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-100">
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
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Komponen Aktivitas Terbaru
async function RecentActivities() {
  const surveyData = await getSurveyData();
  const aduanData = await getAduanData();

  const recentSurveys = surveyData.slice(-5).reverse();
  const recentAduan = aduanData.slice(-5).reverse();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Aktivitas Terbaru
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Survey Terbaru */}
          {recentSurveys.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
            >
              <div className="p-2 bg-white rounded-full">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {item.Nama || "Anonymous"} mengisi survey
                </p>
                <p className="text-xs text-gray-500">
                  {item.Timestamp
                    ? new Date(item.Timestamp).toLocaleString("id-ID")
                    : "-"}
                </p>
              </div>
              <Badge variant="outline" className="bg-white">
                {item.Kepuasan ? `${item.Kepuasan}/5` : "-"}
              </Badge>
            </div>
          ))}

          {/* Aduan Terbaru */}
          {recentAduan.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-red-50 rounded-lg"
            >
              <div className="p-2 bg-white rounded-full">
                <MessageSquare className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {item.Nama || "Anonymous"} mengirim aduan
                </p>
                <p className="text-xs text-gray-500 line-clamp-1">
                  {item["Isi Aduan"]?.substring(0, 50)}...
                </p>
              </div>
              <Badge
                className={
                  item.Status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : item.Status === "diproses"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                }
              >
                {item.Status || "pending"}
              </Badge>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <Link href="/admin/data-aduan">
            <Button variant="link" className="text-sm">
              Lihat semua aktivitas
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Komponen Statistik Detail
async function DetailStats() {
  const stat = await getStatistik();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          Statistik Detail
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Tingkat Kepuasan</span>
            <span className="font-medium">{stat.rataKepuasan}/5</span>
          </div>
          <Progress
            value={parseFloat(stat.rataKepuasan) * 20}
            className="h-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <CheckCircle className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">
              {stat.totalSurvey}
            </p>
            <p className="text-xs text-gray-600">Total Survey</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{stat.totalAduan}</p>
            <p className="text-xs text-gray-600">Total Aduan</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">
              {stat.totalTamu}
            </p>
            <p className="text-xs text-gray-600">Total Tamu</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Star className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">
              {stat.rataKepuasan}
            </p>
            <p className="text-xs text-gray-600">Rata-rata</p>
          </div>
        </div>
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
          trend="+12%"
          subtitle="responden"
        />
        <StatCard
          title="Total Aduan"
          value={stat.totalAduan}
          icon={<MessageSquare className="w-6 h-6" />}
          color="#ef4444"
          trend="+5%"
          subtitle="masuk"
        />
        <StatCard
          title="Total Tamu"
          value={stat.totalTamu}
          icon={<BookOpen className="w-6 h-6" />}
          color="#10b981"
          trend="+8%"
          subtitle="kunjungan"
        />
        <StatCard
          title="Rata-rata Kepuasan"
          value={`${stat.rataKepuasan}/5`}
          icon={<Star className="w-6 h-6" />}
          color="#8b5cf6"
          subtitle="dari 5"
        />
      </div>

      {/* Quick Access & Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Links - 2 kolom */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Akses Cepat
          </h2>
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

        {/* Detail Stats - 1 kolom */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Ringkasan
          </h2>
          <Suspense fallback={<LoadingSpinner />}>
            <DetailStats />
          </Suspense>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 gap-6">
        <h2 className="text-lg font-semibold text-gray-700">
          Aktivitas Terkini
        </h2>
        <Suspense fallback={<LoadingSpinner />}>
          <RecentActivities />
        </Suspense>
      </div>
    </>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header dengan Welcome Message */}
      <div className="flex justify-between items-center">
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
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        }
      >
        <StatistikCards />
      </Suspense>
    </div>
  );
}
