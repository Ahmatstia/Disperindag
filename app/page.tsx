// app/page.tsx (VERSI USER - TANPA DATA)
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      {/* Header dengan Logo */}
      <header className="bg-blue-900 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <span className="text-3xl">🏭</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">DISPERINDAG</h1>
                <p className="text-blue-200">Provinsi Sumatera Barat</p>
              </div>
            </div>
            <div className="text-sm bg-blue-800 px-4 py-2 rounded-full">
              ✨ Pelayanan Publik Prima 2026
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Selamat Datang di Portal Layanan
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Dinas Perindustrian dan Perdagangan Provinsi Sumatera Barat
          berkomitmen memberikan pelayanan terbaik untuk masyarakat.
        </p>
      </section>

      {/* Layanan Cards */}
      <section className="container mx-auto px-4 pb-16">
        <h3 className="text-2xl font-semibold text-center mb-8">
          Layanan Kami
        </h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Survey Card */}
          <Card className="hover:shadow-xl transition-shadow border-t-4 border-t-blue-500">
            <CardHeader>
              <div className="text-5xl mb-2">📋</div>
              <CardTitle>Survey Kepuasan</CardTitle>
              <CardDescription>
                Bantu kami meningkatkan kualitas pelayanan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Isi survey singkat tentang pengalaman Anda menggunakan layanan
                kami.
              </p>
            </CardContent>
            <CardFooter>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSfN54kIxcdIRQj6-FSg2DxkFl_3bFhaJIJb505a31qB3SIPWg/viewform?usp=dialog"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Isi Survey →
                </Button>
              </a>
            </CardFooter>
          </Card>

          {/* Aduan Card */}
          <Card className="hover:shadow-xl transition-shadow border-t-4 border-t-red-500">
            <CardHeader>
              <div className="text-5xl mb-2">📢</div>
              <CardTitle>Layanan Aduan</CardTitle>
              <CardDescription>
                Sampaikan keluhan dan aspirasi Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Laporkan masalah atau berikan saran untuk perbaikan layanan.
              </p>
            </CardContent>
            <CardFooter>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSerslTr9GDsfkfF4W8CTSdiT-8L8_Aq5zFsCUATYpmEX7TT0Q/viewform?usp=dialog"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Buat Aduan →
                </Button>
              </a>
            </CardFooter>
          </Card>

          {/* Tamu Card */}
          <Card className="hover:shadow-xl transition-shadow border-t-4 border-t-green-500">
            <CardHeader>
              <div className="text-5xl mb-2">📖</div>
              <CardTitle>Buku Tamu Digital</CardTitle>
              <CardDescription>Isi daftar hadir kunjungan Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Tinggalkan jejak kunjungan Anda di kantor kami.
              </p>
            </CardContent>
            <CardFooter>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSc5-NHq3-rzJQ6tgufRjtpbwhayOLpHJNvxIRMLHkbALgINQQ/viewform?usp=publish-editor"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Isi Buku Tamu →
                </Button>
              </a>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">
            Dinas Perindustrian dan Perdagangan Provinsi Sumatera Barat
          </p>
          <p className="text-sm text-gray-400">
            Jl. Sudirman No. 1, Padang - Sumatera Barat
          </p>
          <p className="text-sm text-gray-400 mt-4">
            © 2026 All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
