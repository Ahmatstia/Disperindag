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
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const services = [
  {
    icon: ClipboardList,
    title: "Survey Kepuasan",
    description: "Bantu kami meningkatkan kualitas pelayanan",
    detail:
      "Isi survey singkat tentang pengalaman Anda menggunakan layanan kami.",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSfN54kIxcdIRQj6-FSg2DxkFl_3bFhaJIJb505a31qB3SIPWg/viewform?usp=dialog",
    cta: "Isi Survey",
    btnClass: "bg-blue-600 hover:bg-blue-700",
    iconBg: "bg-blue-100 text-blue-600",
    border: "border-t-blue-500",
  },
  {
    icon: Megaphone,
    title: "Layanan Aduan",
    description: "Sampaikan keluhan dan aspirasi Anda",
    detail: "Laporkan masalah atau berikan saran untuk perbaikan layanan.",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSerslTr9GDsfkfF4W8CTSdiT-8L8_Aq5zFsCUATYpmEX7TT0Q/viewform?usp=dialog",
    cta: "Buat Aduan",
    btnClass: "bg-red-600 hover:bg-red-700",
    iconBg: "bg-red-100 text-red-600",
    border: "border-t-red-500",
  },
  {
    icon: BookOpen,
    title: "Buku Tamu Digital",
    description: "Isi daftar hadir kunjungan Anda",
    detail: "Tinggalkan jejak kunjungan Anda di kantor kami.",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSc5-NHq3-rzJQ6tgufRjtpbwhayOLpHJNvxIRMLHkbALgINQQ/viewform?usp=publish-editor",
    cta: "Isi Buku Tamu",
    btnClass: "bg-teal-600 hover:bg-teal-700",
    iconBg: "bg-teal-100 text-teal-600",
    border: "border-t-teal-500",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function Home() {
  return (
    <div
      className="min-h-screen bg-slate-50"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Header */}
      <header className="bg-[#0f1d3a] text-white relative overflow-hidden">
        {/* Geometric pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
        linear-gradient(30deg, rgba(255,255,255,0.05) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.05) 87.5%),
        linear-gradient(150deg, rgba(255,255,255,0.05) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.05) 87.5%)
      `,
            backgroundSize: "80px 140px",
          }}
        />

        <div className="container mx-auto px-4 py-4 relative z-10">
          <div className="flex items-center justify-between">
            {/* Logo + Text */}
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src="/logo.png"
                  alt="Logo DISPERINDAG"
                  width={60}
                  height={60}
                  className="object-contain transition-transform duration-300 hover:scale-105"
                  priority
                />
              </motion.div>

              <div>
                <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
                  DISPERINDAG
                </h1>
                <p className="text-white/60 text-sm font-medium">
                  Provinsi Sumatera Barat
                </p>
              </div>
            </div>

            {/* Right side (optional nav area) */}
            <div className="hidden md:flex items-center gap-6">
              {/* Tambahkan menu jika diperlukan */}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background */}
        <Image
          src="/kota.png"
          alt="Hero"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-[#0f1d3a]/80" />

        {/* Decorative blur */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl z-10" />
        <div className="absolute -left-20 bottom-10 w-60 h-60 rounded-full bg-teal-400/10 blur-3xl z-10" />

        {/* Content */}
        <div className="container mx-auto px-4 relative z-20 text-center text-white">
          <div className="max-w-3xl mx-auto pt-20 pb-40">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Selamat Datang di
              <span className="block text-amber-400">Portal Layanan</span>
            </h2>

            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              Dinas Perindustrian dan Perdagangan Provinsi Sumatera Barat
              berkomitmen memberikan pelayanan terbaik untuk masyarakat.
            </p>
          </div>
        </div>

        {/* WAVE TINGGI & HALUS */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
        >
          <path
            d="M0,80 C360,180 1080,0 1440,100 L1440,200 L0,200 Z"
            fill="#f8fafc"
          />
        </svg>
      </section>

      {/* Services */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">
            Layanan
          </h3>
          <p className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Apa yang bisa kami bantu?
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
        >
          {services.map((service) => (
            <motion.div key={service.title} variants={itemVariants}>
              <Card
                className={`bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-lg border-t-4 ${service.border} group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col`}
              >
                <CardHeader className="pb-3">
                  <div
                    className={`w-14 h-14 rounded-xl ${service.iconBg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <service.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-xl font-bold">
                    {service.title}
                  </CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {service.detail}
                  </p>
                </CardContent>
                <CardFooter>
                  <a
                    href={service.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button
                      className={`w-full ${service.btnClass} text-white font-semibold group/btn`}
                    >
                      {service.cta}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Side */}
            <div>
              <div className="flex items-center gap-4 mb-4">
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

            {/* Right Side */}
            <div className="md:text-right space-y-2">
              <div className="flex items-center md:justify-end gap-2 text-white/60 text-sm">
                <MapPin className="w-4 h-4" />
                Jl. Sudirman No. 1, Padang - Sumatera Barat
              </div>

              <div className="flex items-center md:justify-end gap-2 text-white/60 text-sm">
                <Phone className="w-4 h-4" />
                (0751) 123-456
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="border-t border-white/10 mt-8 pt-6 text-center text-white/30 text-sm">
            © 2026 Dinas Perindustrian dan Perdagangan Provinsi Sumatera Barat.
            All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
