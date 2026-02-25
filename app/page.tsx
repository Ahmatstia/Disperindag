"use client";

import {
  ArrowRight, MapPin, Phone, Mail, Users, TrendingUp,
  Building2, Target, Facebook, Twitter, Instagram,
  Youtube, Linkedin, X, BookOpen,
  CheckCircle, MessageSquare, ChevronUp, ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

// ─── TOKENS ──────────────────────────────────────────────────
const C = {
  navy:      "#081529",
  navyMid:   "#0d2144",
  gold:      "#c9973a",
  goldLight: "#e8b85c",
  cream:     "#faf6ef",
  slate:     "#64748b",
  slateLight:"#94a3b8",
  border:    "rgba(201,151,58,0.2)",
  borderSub: "rgba(255,255,255,0.07)",
};

// ─── DATA ────────────────────────────────────────────────────
const services = [
  {
    icon: BookOpen,
    title: "Buku Tamu Digital",
    description: "Isi daftar hadir kunjungan Anda ke kantor DISPERINDAG untuk meningkatkan kualitas pelayanan kami.",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSfB4cGs_j2MTDAA9FFFERyXX0cNrWY2T678xdMxGh2t8Z8XBg/viewform?usp=preview",
    cta: "Isi Buku Tamu",
    accent: "#059669",
    accentBg: "#f0fdf4",
    tag: "Kunjungan",
  },
  {
    icon: CheckCircle,
    title: "Survey Kepuasan",
    description: "Bantu kami meningkatkan kualitas layanan. Setiap masukan Anda sangat berarti untuk kemajuan bersama.",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSccRtaHeM4Wzqe9G-u8yrllRiWQLb93F8uZxSG2U2QerITcOQ/viewform?usp=dialog",
    cta: "Isi Survey",
    accent: "#2563eb",
    accentBg: "#eff6ff",
    tag: "Evaluasi",
  },
  {
    icon: MessageSquare,
    title: "Layanan Aduan",
    description: "Sampaikan keluhan dan aspirasi Anda. Setiap aduan ditindaklanjuti maksimal 3×24 jam kerja.",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSdVWAC0gTPT-mQUbXe5o9Hba_yPX7W_N5_uEwHo1MKbZp_b5w/viewform?usp=dialog",
    cta: "Buat Aduan",
    accent: "#dc2626",
    accentBg: "#fff1f2",
    tag: "Pengaduan",
  },
];

const additionalServices = [
  { icon: Building2,  title: "Izin Usaha",         desc: "Panduan perizinan usaha industri" },
  { icon: TrendingUp, title: "Informasi Pasar",    desc: "Update harga komoditas terkini" },
  { icon: Users,      title: "Pendampingan UMKM",  desc: "Bimbingan teknis pelaku UMKM" },
  { icon: Target,     title: "Program Unggulan",   desc: "Pengembangan industri & perdagangan" },
];

const faqs = [
  { q: "Bagaimana cara mengakses layanan DISPERINDAG secara online?",   a: "Anda dapat mengakses layanan melalui portal ini. Tersedia layanan buku tamu digital, survey kepuasan, dan pengaduan masyarakat yang dapat diakses kapan saja melalui tautan di halaman Layanan." },
  { q: "Berapa lama waktu penyelesaian pengaduan masyarakat?",          a: "Setiap pengaduan yang masuk akan ditindaklanjuti maksimal 3×24 jam kerja. Anda akan mendapatkan konfirmasi penerimaan dan informasi perkembangan penanganan melalui email yang Anda daftarkan." },
  { q: "Apa saja syarat untuk mendapatkan pendampingan UMKM?",          a: "Pendampingan UMKM terbuka untuk pelaku usaha di Provinsi Sumatera Barat. Persyaratan: memiliki NIK, usaha terdaftar atau dalam proses pendaftaran, dan mengikuti sesi orientasi yang dijadwalkan." },
  { q: "Bagaimana cara mendapatkan informasi harga komoditas terkini?", a: "Informasi harga komoditas diperbarui berkala melalui kanal informasi resmi DISPERINDAG. Hubungi kantor kami langsung atau ikuti akun media sosial resmi kami." },
  { q: "Jam operasional kantor DISPERINDAG Sumatera Barat?",            a: "Kantor kami melayani Senin–Jumat pukul 08.00–16.00 WIB. Layanan online portal tersedia 24 jam setiap hari." },
];

// ─── ANIMATED WAVES ──────────────────────────────────────────
function HeroWaves() {
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, pointerEvents: "none", lineHeight: 0 }}>
      <motion.svg viewBox="0 0 1440 170" preserveAspectRatio="none"
        style={{ width: "200%", position: "absolute", bottom: 36, left: "-50%" }}
        animate={{ x: ["0%", "25%", "0%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M0,85 C200,155 400,15 600,85 C800,155 1000,15 1200,85 C1320,120 1380,95 1440,85 L1440,170 L0,170 Z" fill="rgba(201,151,58,0.07)" />
      </motion.svg>

      <motion.svg viewBox="0 0 1440 130" preserveAspectRatio="none"
        style={{ width: "200%", position: "absolute", bottom: 20, left: "-25%" }}
        animate={{ x: ["0%", "-20%", "0%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M0,65 C240,120 480,10 720,65 C960,120 1200,10 1440,65 L1440,130 L0,130 Z" fill="rgba(201,151,58,0.05)" />
      </motion.svg>

      <motion.svg viewBox="0 0 1440 100" preserveAspectRatio="none"
        style={{ width: "200%", position: "absolute", bottom: 6, left: "-10%" }}
        animate={{ x: ["0%", "15%", "0%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M0,50 C180,90 360,10 540,50 C720,90 900,10 1080,50 C1260,90 1350,30 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,0.05)" />
      </motion.svg>

      {/* Hard white bottom edge */}
      <svg viewBox="0 0 1440 56" preserveAspectRatio="none" style={{ width: "100%", display: "block" }}>
        <path d="M0,28 C360,56 1080,0 1440,28 L1440,56 L0,56 Z" fill="white" />
      </svg>
    </div>
  );
}

// ─── FLOATING ORBS ───────────────────────────────────────────
function FloatingOrbs() {
  const orbs = [
    { size: 480, cx: "65%", cy: "30%", delay: 0,   dur: 9  },
    { size: 280, cx: "85%", cy: "65%", delay: 2,   dur: 11 },
    { size: 180, cx: "12%", cy: "72%", delay: 1,   dur: 7  },
    { size: 140, cx: "38%", cy: "18%", delay: 3.5, dur: 8  },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {orbs.map((o, i) => (
        <motion.div key={i}
          animate={{ y: [0, -20, 0], x: [0, 10, 0], scale: [1, 1.07, 1] }}
          transition={{ duration: o.dur, delay: o.delay, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", left: o.cx, top: o.cy,
            width: o.size, height: o.size, borderRadius: "50%",
            background: "radial-gradient(circle at 40% 40%, rgba(201,151,58,0.13), transparent 68%)",
            transform: "translate(-50%,-50%)", filter: "blur(2px)",
          }}
        />
      ))}
    </div>
  );
}

// ─── DIAGONAL LINES ──────────────────────────────────────────
function DiagonalLines() {
  return (
    <svg style={{ position: "absolute", right: 0, top: 0, height: "100%", width: "38%", pointerEvents: "none", opacity: 0.055 }} viewBox="0 0 400 900" preserveAspectRatio="none">
      {Array.from({ length: 14 }).map((_, i) => (
        <line key={i} x1={i * 35 - 80} y1="0" x2={i * 35 + 220} y2="900" stroke={C.gold} strokeWidth="1" />
      ))}
    </svg>
  );
}

// ─── GRID ────────────────────────────────────────────────────
function HeroGrid() {
  return (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      backgroundImage: `linear-gradient(rgba(201,151,58,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(201,151,58,0.05) 1px, transparent 1px)`,
      backgroundSize: "72px 72px",
      maskImage: "radial-gradient(ellipse 65% 75% at 72% 50%, black 15%, transparent 78%)",
      WebkitMaskImage: "radial-gradient(ellipse 65% 75% at 72% 50%, black 15%, transparent 78%)",
    }} />
  );
}

// ─── SECTION LABEL ───────────────────────────────────────────
function SectionLabel({ children, light = false, center = false }: { children: React.ReactNode; light?: boolean; center?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.75rem", justifyContent: center ? "center" : "flex-start" }}>
      <div style={{ width: 18, height: 1.5, background: C.gold, borderRadius: 2, flexShrink: 0 }} />
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: light ? C.goldLight : C.gold }}>
        {children}
      </span>
      {center && <div style={{ width: 18, height: 1.5, background: C.gold, borderRadius: 2, flexShrink: 0 }} />}
    </div>
  );
}

// ─── FAQ ITEM ────────────────────────────────────────────────
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      viewport={{ once: true }}
      style={{ border: `1px solid ${open ? C.gold : "rgba(8,21,41,0.1)"}`, borderRadius: 16, overflow: "hidden", background: open ? "rgba(201,151,58,0.02)" : "#fff", transition: "border-color 0.25s, background 0.25s" }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", gap: "0.75rem", minHeight: 56 }}
      >
        <span style={{ fontSize: "0.88rem", fontWeight: 600, color: C.navy, flex: 1, lineHeight: 1.5 }}>{q}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0, background: open ? C.gold : "rgba(8,21,41,0.07)" }}
          transition={{ duration: 0.25 }}
          style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
        >
          <ChevronDown size={14} color={open ? C.navy : C.slate} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="body" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }} style={{ overflow: "hidden" }}>
            <div style={{ padding: "0 1.25rem 1.25rem" }}>
              <p style={{ fontSize: "0.855rem", color: C.slate, lineHeight: 1.75, fontWeight: 300 }}>{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────
export default function Home() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showTop,    setShowTop]    = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroBgY     = useTransform(scrollYProgress, [0, 1], ["0%", "24%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  useEffect(() => {
    const fn = () => { setScrolled(window.scrollY > 48); setShowTop(window.scrollY > 400); };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navLinks = ["Beranda", "Layanan", "Profil", "FAQ", "Kontak"];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#fff", color: C.navy, overflowX: "hidden" }}>

      {/* ══════════════════════ NAV ══════════════════════ */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: scrolled ? "rgba(8,21,41,0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "none",
          transition: "all 0.4s ease",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62 }}>
          <a href="#hero" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <div style={{ width: 42, height: 42, position: "relative", flexShrink: 0 }}>
              <Image src="/logo3.png" alt="Logo DISPERINDAG" fill className="object-contain" />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase", lineHeight: 1.2 }}>DISPERINDAG</div>
              <div style={{ fontSize: 9, color: C.goldLight, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.8 }}>Sumatera Barat</div>
            </div>
          </a>

          {/* Desktop */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: "2rem" }}>
            {navLinks.map(item => (
              <motion.a key={item} href={`#${item === "Beranda" ? "hero" : item.toLowerCase()}`}
                whileHover={{ y: -1, color: C.gold }}
                style={{ textDecoration: "none", color: "rgba(255,255,255,0.72)", fontSize: 12, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", transition: "color 0.2s" }}
              >{item}</motion.a>
            ))}
            <motion.a href="#layanan" whileHover={{ boxShadow: "0 6px 20px rgba(201,151,58,0.35)", y: -1 }}
              style={{ padding: "8px 18px", background: C.gold, color: C.navy, borderRadius: 8, fontWeight: 700, fontSize: 12, textDecoration: "none", transition: "all 0.2s" }}
            >Portal Layanan</motion.a>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(true)} className="flex md:hidden"
            aria-label="Buka menu"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex", flexDirection: "column", gap: 4.5, alignItems: "flex-end", minWidth: 44, minHeight: 44, justifyContent: "center" }}
          >
            <span style={{ width: 22, height: 2, background: "#fff", borderRadius: 2 }} />
            <span style={{ width: 15, height: 2, background: C.gold, borderRadius: 2 }} />
            <span style={{ width: 22, height: 2, background: "#fff", borderRadius: 2 }} />
          </button>
        </div>
      </motion.nav>

      {/* ──── MOBILE MENU ──── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: C.navy, display: "flex", flexDirection: "column", overflow: "hidden" }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 1.25rem", borderBottom: `1px solid ${C.borderSub}`, flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", border: `1.5px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono', monospace", fontSize: 7.5, color: C.gold, fontWeight: 700 }}>DPRD</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" }}>DISPERINDAG</div>
                  <div style={{ fontSize: 9, color: C.goldLight, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.75 }}>Sumatera Barat</div>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)}
                style={{ width: 40, height: 40, border: `1px solid rgba(255,255,255,0.15)`, borderRadius: "50%", background: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              ><X size={17} /></button>
            </div>

            {/* Nav links */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1.25rem 0" }}>
              {navLinks.map((item, i) => (
                <motion.a key={item}
                  href={`#${item === "Beranda" ? "hero" : item.toLowerCase()}`}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 + 0.1 }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "1rem 0.875rem", borderRadius: 12, textDecoration: "none",
                    color: "#fff", fontSize: "1rem", fontWeight: 500,
                    borderBottom: i < navLinks.length - 1 ? `1px solid ${C.borderSub}` : "none",
                    transition: "background 0.15s",
                  }}
                  onTouchStart={e => (e.currentTarget.style.background = "rgba(201,151,58,0.08)")}
                  onTouchEnd={e => (e.currentTarget.style.background = "transparent")}
                >
                  <span>{item}</span>
                  <ArrowRight size={15} color={C.gold} />
                </motion.a>
              ))}
            </div>

            {/* Bottom CTA */}
            <div style={{ padding: "1.25rem", flexShrink: 0 }}>
              <motion.a href="#layanan" onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                whileTap={{ scale: 0.97 }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "0.975rem", background: C.gold, color: C.navy, borderRadius: 14, fontWeight: 700, fontSize: "0.95rem", textDecoration: "none", letterSpacing: "0.04em" }}
              >
                Akses Portal Layanan <ArrowRight size={17} />
              </motion.a>
              <p style={{ textAlign: "center", fontSize: 10.5, color: "rgba(255,255,255,0.28)", marginTop: "0.875rem", letterSpacing: "0.06em" }}>
                © 2026 DISPERINDAG Sumatera Barat
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section id="hero" ref={heroRef}
        style={{ minHeight: "100svh", background: C.navy, position: "relative", overflow: "hidden", display: "flex", alignItems: "center" }}
      >
        {/* Background image parallax */}
        <motion.div style={{ position: "absolute", inset: 0, y: heroBgY }}>
          <Image src="/home.png" alt="Kota Padang" fill priority className="object-cover object-center" style={{ opacity: 0.14 }} />
        </motion.div>

        <HeroGrid />
        <DiagonalLines />
        <FloatingOrbs />

        {/* Spinning ring — desktop only subtle deco */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute", right: "-18vw", top: "50%",
            width: "72vw", height: "72vw", maxWidth: 720, maxHeight: 720,
            borderRadius: "50%", border: "1px dashed rgba(201,151,58,0.13)",
            transform: "translateY(-50%)", pointerEvents: "none",
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute", right: "calc(-18vw + 65px)", top: "50%",
            width: "calc(72vw - 130px)", height: "calc(72vw - 130px)",
            maxWidth: 590, maxHeight: 590,
            borderRadius: "50%", border: "1px solid rgba(201,151,58,0.07)",
            transform: "translateY(-50%)", pointerEvents: "none",
          }}
        />

        {/* Horizontal accent line */}
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1.6, delay: 0.9, ease: [0.23, 1, 0.32, 1] }}
          style={{ position: "absolute", left: 0, top: "50%", width: "32%", height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, opacity: 0.22, transformOrigin: "left", pointerEvents: "none" }}
        />

        {/* Content */}
        <motion.div style={{ opacity: heroOpacity, position: "relative", zIndex: 10, width: "100%" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(90px, 14vw, 140px) 1.5rem clamp(140px, 18vw, 200px)" }}>

            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px 5px 8px", border: `1px solid ${C.border}`, borderRadius: 100, marginBottom: "1.75rem", fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: C.goldLight, background: "rgba(201,151,58,0.08)" }}
            >
              <motion.span
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.6, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: "50%", background: C.gold, boxShadow: `0 0 10px ${C.gold}`, display: "block", flexShrink: 0 }}
              />
              Portal Layanan Publik Resmi
            </motion.div>

            {/* Heading — large, editorial */}
            <motion.h1
              initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.8rem, 8vw, 5.8rem)", fontWeight: 600, lineHeight: 1.05, color: "#fff", marginBottom: "1.25rem", maxWidth: 860 }}
            >
              Dinas<br />
              <em style={{ fontStyle: "italic", color: C.goldLight }}>Perindustrian</em><br />
              &amp; Perdagangan
            </motion.h1>

            {/* Sub-label */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.22 }}
              style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.25rem" }}
            >
              <div style={{ width: 36, height: 1.5, background: C.gold, borderRadius: 2 }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: C.goldLight, letterSpacing: "0.14em", textTransform: "uppercase" }}>Provinsi Sumatera Barat</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{ fontSize: "clamp(0.875rem, 2.4vw, 1.05rem)", lineHeight: 1.78, color: "rgba(255,255,255,0.56)", maxWidth: 480, marginBottom: "2.5rem", fontWeight: 300 }}
            >
              Mewujudkan industri yang tangguh, perdagangan yang adil, dan UMKM yang berdaya saing melalui pelayanan prima berbasis digital.
            </motion.p>

            {/* CTAs */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
              style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}
            >
              <motion.a href="#layanan"
                whileHover={{ y: -2, boxShadow: "0 10px 30px rgba(201,151,58,0.38)" }}
                whileTap={{ scale: 0.97 }}
                style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "clamp(11px,2vw,14px) clamp(20px,3vw,28px)", background: C.gold, color: C.navy, borderRadius: 10, fontWeight: 700, fontSize: "clamp(13px,2vw,15px)", textDecoration: "none", letterSpacing: "0.04em" }}
              >
                Akses Layanan
                <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
                  <ArrowRight size={16} />
                </motion.span>
              </motion.a>
              <motion.a href="#profil"
                whileHover={{ borderColor: C.gold, color: C.gold, background: "rgba(201,151,58,0.08)" }}
                whileTap={{ scale: 0.97 }}
                style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "clamp(11px,2vw,14px) clamp(20px,3vw,28px)", background: "transparent", color: "#fff", borderRadius: 10, border: "1px solid rgba(255,255,255,0.2)", fontWeight: 500, fontSize: "clamp(13px,2vw,15px)", textDecoration: "none", transition: "all 0.25s" }}
              >
                Tentang Kami
              </motion.a>
            </motion.div>
          </div>
        </motion.div>

        {/* Animated waves */}
        <HeroWaves />

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
          style={{ position: "absolute", bottom: 70, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, color: "rgba(255,255,255,0.25)", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase" }}
        >
          <span>scroll</span>
          <motion.div animate={{ y: [0, 7, 0], opacity: [0.25, 0.7, 0.25] }} transition={{ duration: 2, repeat: Infinity }}>
            <ChevronDown size={15} color="rgba(201,151,58,0.55)" />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════ LAYANAN ══════════════════════ */}
      <section id="layanan" style={{ padding: "clamp(60px,10vw,100px) 1.25rem", background: "#faf6ef", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, opacity: 0.25 }} />

        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: "2.25rem" }}>
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <SectionLabel>Layanan Kami</SectionLabel>
            </motion.div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
              <motion.h2 initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.9rem, 5vw, 3.2rem)", fontWeight: 600, lineHeight: 1.15, color: C.navy }}
              >
                Apa yang dapat <em style={{ fontStyle: "italic", color: C.gold }}>kami bantu</em>?
              </motion.h2>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.16 }}
                style={{ fontSize: "0.875rem", color: C.slate, lineHeight: 1.72, fontWeight: 300, maxWidth: 360 }}
              >
                Portal layanan terpadu untuk kebutuhan masyarakat dan pelaku usaha Sumatera Barat.
              </motion.p>
            </div>
          </div>

          {/* Service cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 290px), 1fr))", gap: "1rem" }}>
            {services.map((svc, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                whileHover={{ y: -6, boxShadow: "0 20px 52px rgba(8,21,41,0.1)" }}
                style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(8,21,41,0.07)", overflow: "hidden", display: "flex", flexDirection: "column" }}
              >
                <div style={{ height: 4, background: svc.accent }} />
                <div style={{ padding: "1.4rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  {/* Icon + tag */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <div style={{ width: 46, height: 46, borderRadius: 12, background: svc.accentBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svc.icon size={21} color={svc.accent} strokeWidth={1.8} />
                    </div>
                    <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 100, background: svc.accentBg, color: svc.accent, fontFamily: "'Space Mono', monospace" }}>
                      {svc.tag}
                    </span>
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.35rem", fontWeight: 600, color: C.navy, lineHeight: 1.25 }}>{svc.title}</div>
                  <div style={{ fontSize: "0.84rem", color: C.slate, lineHeight: 1.68, flex: 1 }}>{svc.description}</div>
                  <motion.a href={svc.href} target="_blank" rel="noopener noreferrer"
                    whileHover={{ background: svc.accent, color: "#fff", borderColor: svc.accent }}
                    whileTap={{ scale: 0.97 }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "0.875rem 1rem", borderRadius: 10, border: "1px solid rgba(8,21,41,0.11)", fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", textDecoration: "none", color: C.navy, background: "transparent", transition: "all 0.2s", minHeight: 48 }}
                  >
                    {svc.cta} <ArrowRight size={14} />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional services */}
          <div style={{ marginTop: "1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,160px), 1fr))", gap: "0.875rem" }}>
            {additionalServices.map((svc, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4, background: C.navy, borderColor: C.gold }}
                whileTap={{ scale: 0.97 }}
                style={{ padding: "1.15rem 1rem", background: "#fff", border: "1px solid rgba(8,21,41,0.07)", borderRadius: 14, textAlign: "center", cursor: "default", transition: "all 0.28s" }}
                onMouseEnter={e => { const el = e.currentTarget; el.querySelectorAll<HTMLElement>("[data-t]").forEach(x => x.style.color = "#fff"); el.querySelectorAll<HTMLElement>("[data-d]").forEach(x => x.style.color = "rgba(255,255,255,0.5)"); el.querySelectorAll<HTMLElement>("[data-ic]").forEach(x => x.style.background = "rgba(201,151,58,0.15)"); }}
                onMouseLeave={e => { const el = e.currentTarget; el.querySelectorAll<HTMLElement>("[data-t]").forEach(x => x.style.color = C.navy); el.querySelectorAll<HTMLElement>("[data-d]").forEach(x => x.style.color = C.slateLight); el.querySelectorAll<HTMLElement>("[data-ic]").forEach(x => x.style.background = "#faf6ef"); }}
              >
                <div data-ic="" style={{ width: 40, height: 40, borderRadius: 10, background: "#faf6ef", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.75rem", transition: "background 0.28s" }}>
                  <svc.icon size={18} color={C.navy} strokeWidth={1.7} />
                </div>
                <div data-t="" style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 3, transition: "color 0.28s" }}>{svc.title}</div>
                <div data-d="" style={{ fontSize: 11.5, color: C.slateLight, lineHeight: 1.5, transition: "color 0.28s" }}>{svc.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ PROFIL ══════════════════════ */}
      <section id="profil" style={{ background: C.navy, padding: "clamp(60px,10vw,100px) 1.25rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: "60%", height: "100%", background: "radial-gradient(ellipse at right center, rgba(201,151,58,0.07) 0%, transparent 62%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "clamp(2rem,5vw,4rem)", alignItems: "center", position: "relative" }}>
          <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <SectionLabel light>Tentang Kami</SectionLabel>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.9rem, 5vw, 3.2rem)", fontWeight: 600, lineHeight: 1.15, color: "#fff", marginBottom: "1.25rem" }}>
              Pimpinan &amp; <em style={{ fontStyle: "italic", color: C.goldLight }}>Tim DISPERINDAG</em>
            </h2>
            <p style={{ fontSize: "0.92rem", lineHeight: 1.8, color: "rgba(255,255,255,0.56)", fontWeight: 300, marginBottom: "0.875rem" }}>
              Dinas Perindustrian dan Perdagangan Provinsi Sumatera Barat berkomitmen mewujudkan industri yang tangguh, berdaya saing, dan berkelanjutan melalui pelayanan prima dan inovasi digital.
            </p>
            <p style={{ fontSize: "0.92rem", lineHeight: 1.8, color: "rgba(255,255,255,0.56)", fontWeight: 300, marginBottom: "1.75rem" }}>
              Kami mendorong produk lokal Sumatera Barat go international melalui kebijakan perdagangan yang berpihak pada masyarakat.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {["Pelayanan Prima", "Inovasi Digital", "UMKM Berdaya Saing", "Go International", "Transparansi Publik"].map(p => (
                <span key={p} style={{ padding: "5px 12px", border: `1px solid ${C.border}`, borderRadius: 100, fontSize: 11, color: C.goldLight, background: "rgba(201,151,58,0.08)", letterSpacing: "0.04em" }}>{p}</span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.14 }}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}
          >
            <motion.div whileHover={{ scale: 1.02 }} style={{ gridRow: "span 2", borderRadius: 14, overflow: "hidden", position: "relative", border: `1px solid ${C.borderSub}`, minHeight: 220 }}>
              <Image src="/1.jpeg" alt="Kegiatan 1" fill className="object-cover" style={{ opacity: 0.88 }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,21,41,0.4), transparent)" }} />
            </motion.div>
            {["/2.jpeg", "/3.jpeg"].map((src, i) => (
              <motion.div key={i} whileHover={{ scale: 1.02 }} style={{ borderRadius: 14, overflow: "hidden", position: "relative", aspectRatio: "4/3", border: `1px solid ${C.borderSub}` }}>
                <Image src={src} alt={`Kegiatan ${i + 2}`} fill className="object-cover" style={{ opacity: 0.88 }} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════ FAQ ══════════════════════ */}
      <section id="faq" style={{ padding: "clamp(60px,10vw,100px) 1.25rem", background: "#fff" }}>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: "2.75rem" }}>
            <SectionLabel center>Pertanyaan Umum</SectionLabel>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.85rem, 5vw, 3rem)", fontWeight: 600, color: C.navy, lineHeight: 1.2, marginTop: "0.25rem" }}>
              Pertanyaan yang <em style={{ fontStyle: "italic", color: C.gold }}>Sering Diajukan</em>
            </h2>
          </motion.div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {faqs.map((item, i) => <FaqItem key={i} q={item.q} a={item.a} index={i} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════ KONTAK ══════════════════════ */}
      <section id="kontak" style={{ padding: "clamp(60px,10vw,100px) 1.25rem", background: "#faf6ef" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))", gap: "clamp(2rem,5vw,4rem)", alignItems: "start" }}>
          <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <SectionLabel>Hubungi Kami</SectionLabel>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.9rem, 5vw, 3.2rem)", fontWeight: 600, color: C.navy, marginBottom: "2rem" }}>
              Lokasi &amp; <em style={{ fontStyle: "italic", color: C.gold }}>Kontak</em>
            </h2>
            {[
              { icon: MapPin, label: "Alamat",  val: "Jl. Aur No.1, Padang Pasir,\nKec. Padang Barat, Kota Padang" },
              { icon: Phone,  label: "Telepon", val: "+62 821 7101 9451" },
              { icon: Mail,   label: "Email",   val: "disperindang@sumbarprov.go.id" },
            ].map(({ icon: Icon, label, val }, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "1.5rem" }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 10, background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={17} color={C.gold} strokeWidth={1.8} />
                </div>
                <div>
                  <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.slateLight, marginBottom: 4, fontFamily: "'Space Mono', monospace" }}>{label}</div>
                  <div style={{ fontSize: "0.88rem", color: C.navy, fontWeight: 500, whiteSpace: "pre-line", lineHeight: 1.55 }}>{val}</div>
                </div>
              </motion.div>
            ))}
            <div style={{ display: "flex", gap: "0.625rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
              {[Facebook, Twitter, Instagram, Youtube, Linkedin].map((Icon, i) => (
                <motion.a key={i} href="#" whileHover={{ background: C.navy, borderColor: C.navy, y: -2 }} whileTap={{ scale: 0.9 }}
                  style={{ width: 44, height: 44, borderRadius: 10, background: "#fff", border: "1px solid rgba(8,21,41,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: C.slate, transition: "all 0.2s", textDecoration: "none" }}
                ><Icon size={16} /></motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.14 }}
            style={{ borderRadius: 18, overflow: "hidden", border: "1px solid rgba(8,21,41,0.09)", boxShadow: "0 8px 32px rgba(8,21,41,0.07)", aspectRatio: "4/3", minHeight: 260 }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.2793680888847!2d100.354123!3d-0.955789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwNTcnMjAuOCJTIDEwMMKwMjEnMTQuOSJF!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid"
              width="100%" height="100%" style={{ border: 0, display: "block" }}
              allowFullScreen loading="lazy" title="Peta Lokasi DISPERINDAG"
            />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════ FOOTER ══════════════════════ */}
      <footer style={{ background: C.navy, padding: "3.5rem 1.25rem 2rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 190px), 1fr))", gap: "2.25rem", paddingBottom: "2.25rem", borderBottom: `1px solid ${C.borderSub}` }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.875rem" }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", border: `1.5px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono', monospace", fontSize: 7.5, color: C.gold, fontWeight: 700 }}>DPRD</div>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" }}>DISPERINDAG SUMBAR</span>
              </div>
              <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.38)", lineHeight: 1.7, fontWeight: 300 }}>Portal Layanan Publik Dinas Perindustrian dan Perdagangan Provinsi Sumatera Barat.</p>
            </div>
            {[
              { title: "Layanan", items: ["Buku Tamu Digital", "Survey Kepuasan", "Layanan Aduan", "Izin Usaha"] },
              { title: "Tautan",  items: ["Beranda", "Profil Dinas", "FAQ", "Hubungi Kami"] },
              { title: "Kontak",  items: ["disperindang@sumbarprov.go.id", "+62 821 7101 9451", "Jl. Aur No.1, Padang Barat"] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.gold, marginBottom: "1rem", fontFamily: "'Space Mono', monospace" }}>{col.title}</div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {col.items.map(l => <li key={l} style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{l}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ paddingTop: "1.75rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", fontSize: 11, color: "rgba(255,255,255,0.27)" }}>
            <span>© 2026 DISPERINDAG Provinsi Sumatera Barat. All rights reserved.</span>
            <span>Dibuat dengan ❤ untuk masyarakat Sumatera Barat</span>
          </div>
        </div>
      </footer>

      {/* ══════════════════════ BACK TO TOP ══════════════════════ */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ y: -3, boxShadow: "0 10px 30px rgba(201,151,58,0.45)" }}
            whileTap={{ scale: 0.92 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Kembali ke atas"
            style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", width: 48, height: 48, borderRadius: 14, background: C.gold, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(201,151,58,0.4)", zIndex: 90 }}
          >
            <ChevronUp size={20} color={C.navy} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}