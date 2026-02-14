// app/admin/dashboard/page.tsx
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStatistik } from "@/lib/apps-script";
import Link from "next/link";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Users, MessageSquare, BookOpen, Star } from "lucide-react";

async function StatistikCards() {
  const stat = await getStatistik();

  console.log("🏠 RENDER DASHBOARD dengan stat:", stat);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
              <Users className="w-4 h-4" /> Total Survey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {stat.totalSurvey}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Total Aduan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{stat.totalAduan}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Total Tamu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {stat.totalTamu}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
              <Star className="w-4 h-4" /> Rata-rata Kepuasan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">
              {stat.rataKepuasan}/5
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/data-survey">
          <Card className="hover:shadow-lg transition cursor-pointer">
            <CardContent className="p-6">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="font-semibold text-lg">Data Survey</h3>
              <p className="text-sm text-gray-500">Lihat semua responden</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/data-aduan">
          <Card className="hover:shadow-lg transition cursor-pointer">
            <CardContent className="p-6">
              <div className="text-4xl mb-4">📢</div>
              <h3 className="font-semibold text-lg">Data Aduan</h3>
              <p className="text-sm text-gray-500">Kelola aduan masyarakat</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/data-tamu">
          <Card className="hover:shadow-lg transition cursor-pointer">
            <CardContent className="p-6">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="font-semibold text-lg">Data Tamu</h3>
              <p className="text-sm text-gray-500">Daftar buku tamu</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>

      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-100">
            <LoadingSpinner />
          </div>
        }
      >
        <StatistikCards />
      </Suspense>
    </div>
  );
}
