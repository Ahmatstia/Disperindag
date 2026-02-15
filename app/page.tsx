// app/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ClipboardList,
  Megaphone,
  BookOpen,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  CheckCircle,
  TrendingUp,
  Calendar,
  ChevronRight,
  Building2,
  Target,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

// Data Services
const services = [
  {
    icon: ClipboardList,
    title: "Survey Kepuasan",
    description: "Bantu kami meningkatkan kualitas pelayanan",
    detail:
      "Isi survey singkat tentang pengalaman Anda menggunakan layanan kami. Setiap masukan berarti untuk kemajuan bersama.",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSfN54kIxcdIRQj6-FSg2DxkFl_3bFhaJIJb505a31qB3SIPWg/viewform?usp=dialog",
    cta: "Isi Survey",
    color: "blue",
    stats: "250+ Survey Terisi",
  },
  {
    icon: Megaphone,
    title: "Layanan Aduan",
    description: "Sampaikan keluhan dan aspirasi Anda",
    detail:
      "Laporkan masalah atau berikan saran untuk perbaikan layanan. Setiap aduan akan kami tindaklanjuti maksimal 3x24 jam.",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSerslTr9GDsfkfF4W8CTSdiT-8L8_Aq5zFsCUATYpmEX7TT0Q/viewform?usp=dialog",
    cta: "Buat Aduan",
    color: "red",
    stats: "50 Aduan Ditindaklanjuti",
  },
  {
    icon: BookOpen,
    title: "Buku Tamu Digital",
    description: "Isi daftar hadir kunjungan Anda",
    detail:
      "Tinggalkan jejak kunjungan Anda di kantor kami. Ini membantu kami mencatat dan meningkatkan kualitas pelayanan.",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSc5-NHq3-rzJQ6tgufRjtpbwhayOLpHJNvxIRMLHkbALgINQQ/viewform?usp=publish-editor",
    cta: "Isi Buku Tamu",
    color: "teal",
    stats: "500+ Pengunjung",
  },
];

// Data Berita
const news = [
  {
    title: "Bimtek Peningkatan Kapasitas UMKM",
    date: "15 Februari 2026",
    category: "Kegiatan",
    image: "/kota.png",
    excerpt:
      "Dinas Perindustrian dan Perdagangan mengadakan bimbingan teknis bagi pelaku UMKM di Sumatera Barat.",
  },
  {
    title: "Pengumuman Libur Pelayanan",
    date: "10 Februari 2026",
    category: "Pengumuman",
    image: "/kota.png",
    excerpt:
      "Sehubungan dengan hari libur nasional, pelayanan akan ditutup sementara pada tanggal 17 Februari 2026.",
  },
  {
    title: "Pameran Produk Unggulan Daerah",
    date: "5 Februari 2026",
    category: "Event",
    image: "/kota.png",
    excerpt:
      "DISPERINDAG akan mengadakan pameran produk unggulan daerah di Padang. Ajak keluarga dan teman Anda!",
  },
  {
    title: "Sosialisasi Izin Usaha Industri",
    date: "1 Februari 2026",
    category: "Sosialisasi",
    image: "/kota.png",
    excerpt:
      "Sosialisasi perizinan usaha industri melalui OSS akan dilaksanakan secara daring dan luring.",
  },
];

// Data Galeri
const gallery = [
  { src: "/kota.png", title: "Pelayanan Publik", category: "Kegiatan" },
  { src: "/kota.png", title: "Kunjungan Lapangan", category: "Kegiatan" },
  { src: "/kota.png", title: "Sosialisasi", category: "Event" },
  { src: "/kota.png", title: "Rapat Koordinasi", category: "Rapat" },
  { src: "/kota.png", title: "Pameran Produk", category: "Event" },
  { src: "/kota.png", title: "Tim DISPERINDAG", category: "Profil" },
];

// Data FAQ
const faqs = [
  {
    question: "Bagaimana cara mengisi survey kepuasan?",
    answer:
      "Anda dapat mengisi survey dengan mengklik tombol 'Isi Survey' pada kartu layanan. Survey hanya membutuhkan waktu 2-3 menit.",
  },
  {
    question: "Apakah aduan saya dirahasiakan?",
    answer:
      "Ya, identitas pelapor akan kami rahasiakan sesuai dengan UU Pelayanan Publik. Namun, untuk tindak lanjut, kami mungkin memerlukan kontak yang bisa dihubungi.",
  },
  {
    question: "Berapa lama aduan diproses?",
    answer:
      "Setiap aduan akan kami proses maksimal 3x24 jam. Untuk aduan yang memerlukan koordinasi lebih lanjut, akan kami informasikan perkembangannya.",
  },
  {
    question: "Apakah buku tamu bisa diisi dari rumah?",
    answer:
      "Buku tamu digital ditujukan untuk pengunjung yang datang ke kantor. Namun, Anda tetap bisa mengisi sebagai bentuk partisipasi.",
  },
];

// Data Layanan Tambahan
const additionalServices = [
  {
    icon: Building2,
    title: "Izin Usaha",
    description: "Informasi dan panduan perizinan usaha industri",
  },
  {
    icon: TrendingUp,
    title: "Informasi Pasar",
    description: "Update harga komoditas dan pasar terkini",
  },
  {
    icon: Users,
    title: "Pendampingan UMKM",
    description: "Bimbingan teknis untuk pelaku UMKM",
  },
  {
    icon: Target,
    title: "Program Unggulan",
    description: "Program pengembangan industri dan perdagangan",
  },
];

// Data Tim Struktural
const leadership = [
  {
    name: "Dr. Hendra Saputra, M.Si",
    position: "Kepala Dinas",
    image: "/logo.png",
  },
  { name: "Ir. Maya Sari, MT", position: "Sekretaris", image: "/logo.png" },
  {
    name: "Doni Permana, SE",
    position: "Kabid Perindustrian",
    image: "/logo.png",
  },
  {
    name: "Rina Wulandari, SH",
    position: "Kabid Perdagangan",
    image: "/logo.png",
  },
];

// Animasi Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

// Component Mobile Menu
const MobileMenu = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 p-6"
          >
            <button onClick={onClose} className="absolute right-4 top-4">
              <X className="w-6 h-6" />
            </button>
            <div className="mt-12 space-y-4">
              <a
                href="#home"
                className="block py-2 text-lg font-medium hover:text-blue-600"
              >
                Beranda
              </a>
              <a
                href="#profil"
                className="block py-2 text-lg font-medium hover:text-blue-600"
              >
                Profil
              </a>
              <a
                href="#layanan"
                className="block py-2 text-lg font-medium hover:text-blue-600"
              >
                Layanan
              </a>
              <a
                href="#berita"
                className="block py-2 text-lg font-medium hover:text-blue-600"
              >
                Berita
              </a>
              <a
                href="#galeri"
                className="block py-2 text-lg font-medium hover:text-blue-600"
              >
                Galeri
              </a>
              <a
                href="#kontak"
                className="block py-2 text-lg font-medium hover:text-blue-600"
              >
                Kontak
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      {/* Floating Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-lg py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src="/logo.png"
                  alt="Logo DISPERINDAG"
                  width={scrolled ? 45 : 50}
                  height={scrolled ? 45 : 50}
                  className="object-contain transition-all duration-300"
                />
              </motion.div>
              <div>
                <h1
                  className={`font-bold transition-all duration-300 ${scrolled ? "text-xl text-gray-900" : "text-2xl text-white"}`}
                >
                  DISPERINDAG
                </h1>
                <p
                  className={`text-sm transition-all duration-300 ${scrolled ? "text-gray-500" : "text-white/70"}`}
                >
                  Provinsi Sumatera Barat
                </p>
              </div>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-8">
              {[
                "Beranda",
                "Profil",
                "Layanan",
                "Berita",
                "Galeri",
                "Kontak",
              ].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  whileHover={{ y: -2 }}
                  className={`font-medium transition-colors ${
                    scrolled
                      ? "text-gray-700 hover:text-blue-600"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {item}
                </motion.a>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                scrolled ? "hover:bg-gray-100" : "hover:bg-white/10"
              }`}
            >
              <Menu
                className={`w-6 h-6 ${scrolled ? "text-gray-900" : "text-white"}`}
              />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Hero Section with Parallax */}
      <section
        id="home"
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        {/* Background dengan efek parallax */}
        <motion.div
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <Image
            src="/kota.png"
            alt="Hero"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#0f1d3a]/95 via-[#0f1d3a]/85 to-transparent" />
        </motion.div>

        {/* Static decorative elements - ganti partikel animasi */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Static dots - tidak perlu animasi */}
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/10 rounded-full" />
          <div className="absolute top-3/4 left-1/2 w-1.5 h-1.5 bg-white/10 rounded-full" />
          <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-white/10 rounded-full" />
          <div className="absolute top-2/3 left-1/3 w-2 h-2 bg-white/5 rounded-full" />
          <div className="absolute top-1/5 left-2/3 w-1.5 h-1.5 bg-white/10 rounded-full" />
          <div className="absolute top-4/5 left-1/5 w-1 h-1 bg-white/10 rounded-full" />

          {/* Garis-garis dekoratif */}
          <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight"
            >
              Selamat Datang di
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-amber-200">
                Portal Layanan
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl"
            >
              Dinas Perindustrian dan Perdagangan Provinsi Sumatera Barat
              berkomitmen memberikan pelayanan terbaik untuk masyarakat.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                className="bg-amber-400 hover:bg-amber-500 text-gray-900 text-lg px-8 py-6 rounded-2xl shadow-lg shadow-amber-400/30"
              >
                Lihat Layanan
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 text-lg px-8 py-6 rounded-2xl"
              >
                Hubungi Kami
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Wave */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
        >
          <path
            d="M0,100 C360,200 1080,0 1440,120 L1440,200 L0,200 Z"
            fill="white"
            opacity="0.1"
          />
          <path
            d="M0,120 C360,180 1080,40 1440,100 L1440,200 L0,200 Z"
            fill="white"
          />
        </svg>
      </section>

      {/* Profil Singkat */}
      <section
        id="profil"
        className="py-20 bg-linear-to-b from-white to-slate-50"
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-2 block">
                Profil Dinas
              </span>
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                Dinas Perindustrian dan Perdagangan Provinsi Sumatera Barat
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                DISPERINDAG Provinsi Sumatera Barat hadir untuk mendorong
                pertumbuhan industri dan perdagangan yang berkelanjutan. Kami
                berkomitmen menciptakan iklim usaha yang kondusif, melindungi
                konsumen, dan meningkatkan daya saing produk lokal.
              </p>
              <div className="space-y-4">
                {[
                  "Mewujudkan industri yang tangguh dan berdaya saing",
                  "Meningkatkan efisiensi perdagangan dalam dan luar negeri",
                  "Memberikan pelayanan prima kepada masyarakat dan pelaku usaha",
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl" />
              <Image
                src="/kota.png"
                alt="Gedung DISPERINDAG"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl relative z-10"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Layanan Unggulan */}
      <section id="layanan" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-2 block">
              Layanan Kami
            </span>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Apa yang bisa kami bantu?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kami menyediakan berbagai layanan untuk memenuhi kebutuhan Anda.
              Pilih layanan yang sesuai dan sampaikan kebutuhan Anda.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
          >
            {services.map((service, index) => {
              const colors = {
                blue: {
                  bg: "bg-blue-50",
                  text: "text-blue-600",
                  border: "border-blue-500",
                  btn: "bg-blue-600 hover:bg-blue-700",
                  light: "bg-blue-100",
                },
                red: {
                  bg: "bg-red-50",
                  text: "text-red-600",
                  border: "border-red-500",
                  btn: "bg-red-600 hover:bg-red-700",
                  light: "bg-red-100",
                },
                teal: {
                  bg: "bg-teal-50",
                  text: "text-teal-600",
                  border: "border-teal-500",
                  btn: "bg-teal-600 hover:bg-teal-700",
                  light: "bg-teal-100",
                },
              };
              const color = colors[service.color as keyof typeof colors];

              return (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="group h-full flex flex-col overflow-hidden hover:shadow-2xl transition-all duration-500">
                    <div
                      className={`h-2 w-full bg-linear-to-r from-${service.color}-500 to-${service.color}-400`}
                    />
                    <CardHeader>
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className={`w-16 h-16 rounded-2xl ${color.light} flex items-center justify-center mb-4`}
                      >
                        <service.icon className={`w-8 h-8 ${color.text}`} />
                      </motion.div>
                      <CardTitle className="text-2xl">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-gray-600 leading-relaxed">
                        {service.detail}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        <span>{service.stats}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <a
                        href={service.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <Button
                          className={`w-full ${color.btn} text-white font-semibold group/btn py-6 text-base rounded-xl`}
                        >
                          {service.cta}
                          <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </a>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Layanan Tambahan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <h4 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Layanan Lainnya
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {additionalServices.map((service, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="p-6 bg-slate-50 rounded-xl text-center group cursor-pointer hover:bg-blue-50 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <service.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h5 className="font-semibold text-gray-900 mb-1">
                    {service.title}
                  </h5>
                  <p className="text-xs text-gray-500">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Berita & Pengumuman */}
      <section id="berita" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-end mb-12"
          >
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-2 block">
                Update Terkini
              </span>
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                Berita & Pengumuman
              </h3>
            </div>
            <Button
              variant="ghost"
              className="hidden md:flex items-center gap-2"
            >
              Lihat Semua
              <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {news.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <Card className="overflow-hidden h-full">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.excerpt}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Button variant="outline" className="w-full">
              Lihat Semua Berita
            </Button>
          </div>
        </div>
      </section>

      {/* Struktur Organisasi */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-2 block">
              Struktur Organisasi
            </span>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Pimpinan DISPERINDAG
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tim yang berdedikasi untuk memberikan pelayanan terbaik bagi
              masyarakat Sumatera Barat
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {leadership.map((leader, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="text-center"
              >
                <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-white shadow-xl">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{leader.name}</h4>
                <p className="text-sm text-blue-600 font-medium">
                  {leader.position}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Galeri */}
      <section id="galeri" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-2 block">
              Galeri Kegiatan
            </span>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Dokumentasi Kegiatan
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Momen dan kegiatan terbaru di lingkungan DISPERINDAG
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="relative group cursor-pointer overflow-hidden rounded-xl aspect-square"
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-white/70">{item.category}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-2 block">
                FAQ
              </span>
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                Pertanyaan Umum
              </h3>
              <p className="text-gray-600">
                Temukan jawaban atas pertanyaan yang sering diajukan
              </p>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setActiveFaq(activeFaq === index ? null : index)
                    }
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900">
                      {faq.question}
                    </span>
                    <ChevronRight
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        activeFaq === index ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {activeFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-4"
                      >
                        <p className="text-gray-600">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lokasi & Kontak */}
      <section id="kontak" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-2 block">
                Hubungi Kami
              </span>
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
                Lokasi & Kontak
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Alamat</h4>
                    <p className="text-gray-600">
                      Jl. Sudirman No. 1, Padang - Sumatera Barat 25111
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Telepon
                    </h4>
                    <p className="text-gray-600">(0751) 123-456</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600">
                      info@disperindag.sumbar.go.id
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Jam Operasional
                    </h4>
                    <p className="text-gray-600">
                      Senin - Jumat, 08.00 - 16.00 WIB
                    </p>
                    <p className="text-gray-500 text-sm">
                      Sabtu, Minggu & Libur Nasional Tutup
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-8">
                <h4 className="font-semibold text-gray-900 mb-4">Ikuti Kami</h4>
                <div className="flex gap-3">
                  {[
                    { icon: Facebook, color: "bg-blue-600", href: "#" },
                    { icon: Twitter, color: "bg-sky-500", href: "#" },
                    { icon: Instagram, color: "bg-pink-600", href: "#" },
                    { icon: Youtube, color: "bg-red-600", href: "#" },
                    { icon: Linkedin, color: "bg-blue-700", href: "#" },
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      whileHover={{ y: -3 }}
                      className={`w-10 h-10 ${social.color} rounded-lg flex items-center justify-center text-white hover:shadow-lg transition-all`}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden shadow-xl h-screen max-h-96"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.2793680888847!2d100.354123!3d-0.955789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwNTcnMjAuOCJTIDEwMMKwMjEnMTQuOSJF!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/logo.png"
                  alt="Logo DISPERINDAG"
                  width={50}
                  height={50}
                  className="object-contain"
                />
                <div>
                  <p className="font-bold text-lg">DISPERINDAG</p>
                  <p className="text-white/50 text-sm">
                    Provinsi Sumatera Barat
                  </p>
                </div>
              </div>
              <p className="text-white/40 text-sm leading-relaxed">
                Berkomitmen untuk pelayanan publik yang transparan, akuntabel,
                dan berintegritas.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2 text-white/50 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Survey Kepuasan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Layanan Aduan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Buku Tamu Digital
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Informasi Izin Usaha
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Tautan</h4>
              <ul className="space-y-2 text-white/50 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Berita
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Galeri
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Kebijakan Privasi
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <p className="text-white/40 text-sm mb-3">
                Dapatkan update terbaru dari DISPERINDAG
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email Anda"
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-l-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-lg transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/30 text-sm text-center md:text-left">
                © 2026 Dinas Perindustrian dan Perdagangan Provinsi Sumatera
                Barat. All Rights Reserved.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-white/30 hover:text-white transition-colors text-sm"
                >
                  Kebijakan Privasi
                </a>
                <a
                  href="#"
                  className="text-white/30 hover:text-white transition-colors text-sm"
                >
                  Syarat & Ketentuan
                </a>
                <a
                  href="#"
                  className="text-white/30 hover:text-white transition-colors text-sm"
                >
                  Sitemap
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:bg-blue-700 transition-colors"
          >
            <ArrowRight className="w-5 h-5 -rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
