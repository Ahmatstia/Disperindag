"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import {
  ArrowRight, MapPin, Phone, Mail, Users, TrendingUp,
  Building2, Target, BookOpen, CheckCircle, MessageSquare,
  ChevronDown, Home as HomeIcon, Layers, Info, HelpCircle,
  PhoneCall, ExternalLink, X, Facebook, Twitter,
  Instagram, ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

/* ═══════════════════════════════════════════════════════════
   DESIGN TOKENS — shared across both breakpoints
═══════════════════════════════════════════════════════════ */
const C = {
  /* Original desktop palette */
  navy:       "#081529",
  navyMid:    "#0d2144",
  gold:       "#c9973a",
  goldLight:  "#e8b85c",
  cream:      "#faf6ef",
  slate:      "#64748b",
  slateLight: "#94a3b8",
  border:     "rgba(201,151,58,0.2)",
  borderSub:  "rgba(255,255,255,0.07)",
  /* New mobile palette aliases */
  inkDeep:    "#050d18",
  inkMid:     "#0e1f35",
  sand:       "#f9f5ee",
  ash:        "#6b7a8d",
  mist:       "#9aaabb",
  rimDark:    "rgba(255,255,255,0.07)",
  rimLight:   "rgba(7,17,31,0.08)",
  rimGold:    "rgba(201,151,58,0.22)",
  elev1:      "0 1px 4px rgba(7,17,31,0.06), 0 4px 16px rgba(7,17,31,0.07)",
  elev2:      "0 2px 8px rgba(7,17,31,0.08), 0 8px 28px rgba(7,17,31,0.1)",
  r3: "10px", r4: "14px", r5: "18px", rpill: "999px",
};

/* ═══════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════ */
const services = [
  { icon: BookOpen, title: "Buku Tamu Digital", description: "Isi daftar hadir kunjungan Anda ke kantor DISPERINDAG untuk meningkatkan kualitas pelayanan kami.", href: "https://docs.google.com/forms/d/e/1FAIpQLSfB4cGs_j2MTDAA9FFFERyXX0cNrWY2T678xdMxGh2t8Z8XBg/viewform?usp=preview", cta: "Isi Buku Tamu", accent: "#059669", accentBg: "#f0fdf4", tag: "Kunjungan" },
  { icon: CheckCircle, title: "Survey Kepuasan", description: "Bantu kami meningkatkan kualitas layanan. Setiap masukan Anda sangat berarti untuk kemajuan bersama.", href: "https://docs.google.com/forms/d/e/1FAIpQLSccRtaHeM4Wzqe9G-u8yrllRiWQLb93F8uZxSG2U2QerITcOQ/viewform?usp=dialog", cta: "Isi Survey", accent: "#2563eb", accentBg: "#eff6ff", tag: "Evaluasi" },
  { icon: MessageSquare, title: "Layanan Aduan", description: "Sampaikan keluhan dan aspirasi Anda. Setiap aduan ditindaklanjuti maksimal 3×24 jam kerja.", href: "https://docs.google.com/forms/d/e/1FAIpQLSdVWAC0gTPT-mQUbXe5o9Hba_yPX7W_N5_uEwHo1MKbZp_b5w/viewform?usp=dialog", cta: "Buat Aduan", accent: "#dc2626", accentBg: "#fff1f2", tag: "Pengaduan" },
];

const additionalServices = [
  { icon: Building2,  title: "Izin Usaha",        desc: "Panduan perizinan usaha industri" },
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

const NAV = [
  { id: "hero",    Icon: HomeIcon,   label: "Beranda" },
  { id: "layanan", Icon: Layers,     label: "Layanan" },
  { id: "profil",  Icon: Info,       label: "Fasilitas"  },
  { id: "faq",     Icon: HelpCircle, label: "FAQ"     },
  { id: "kontak",  Icon: PhoneCall,  label: "Kontak"  },
];

const navLinks = ["Beranda", "Layanan", "Fasilitas", "FAQ", "Kontak"];

/* ═══════════════════════════════════════════════════════════
   UTILS
═══════════════════════════════════════════════════════════ */
const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

/* ═══════════════════════════════════════════════════════════
   DESKTOP DECORATIONS (original)
═══════════════════════════════════════════════════════════ */
function HeroWaves() {
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, pointerEvents: "none", lineHeight: 0 }}>
      <motion.svg viewBox="0 0 1440 170" preserveAspectRatio="none"
        style={{ width: "200%", position: "absolute", bottom: 36, left: "-50%" }}
        animate={{ x: ["0%", "25%", "0%"] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}>
        <path d="M0,85 C200,155 400,15 600,85 C800,155 1000,15 1200,85 C1320,120 1380,95 1440,85 L1440,170 L0,170 Z" fill="rgba(201,151,58,0.07)" />
      </motion.svg>
      <motion.svg viewBox="0 0 1440 130" preserveAspectRatio="none"
        style={{ width: "200%", position: "absolute", bottom: 20, left: "-25%" }}
        animate={{ x: ["0%", "-20%", "0%"] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>
        <path d="M0,65 C240,120 480,10 720,65 C960,120 1200,10 1440,65 L1440,130 L0,130 Z" fill="rgba(201,151,58,0.05)" />
      </motion.svg>
      <motion.svg viewBox="0 0 1440 100" preserveAspectRatio="none"
        style={{ width: "200%", position: "absolute", bottom: 6, left: "-10%" }}
        animate={{ x: ["0%", "15%", "0%"] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
        <path d="M0,50 C180,90 360,10 540,50 C720,90 900,10 1080,50 C1260,90 1350,30 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,0.05)" />
      </motion.svg>
      <svg viewBox="0 0 1440 56" preserveAspectRatio="none" style={{ width: "100%", display: "block" }}>
        <path d="M0,28 C360,56 1080,0 1440,28 L1440,56 L0,56 Z" fill={C.cream} />
      </svg>
    </div>
  );
}

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
          style={{ position: "absolute", left: o.cx, top: o.cy, width: o.size, height: o.size, borderRadius: "50%", background: "radial-gradient(circle at 40% 40%, rgba(201,151,58,0.13), transparent 68%)", transform: "translate(-50%,-50%)", filter: "blur(2px)" }}
        />
      ))}
    </div>
  );
}

function DiagonalLines() {
  return (
    <svg style={{ position: "absolute", right: 0, top: 0, height: "100%", width: "38%", pointerEvents: "none", opacity: 0.055 }} viewBox="0 0 400 900" preserveAspectRatio="none">
      {Array.from({ length: 14 }).map((_, i) => (
        <line key={i} x1={i * 35 - 80} y1="0" x2={i * 35 + 220} y2="900" stroke={C.gold} strokeWidth="1" />
      ))}
    </svg>
  );
}

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

/* ═══════════════════════════════════════════════════════════
   SHARED ATOMS
═══════════════════════════════════════════════════════════ */
/* Mobile eyebrow */
const Eyebrow = ({ text, light }: { text: string; light?: boolean }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
    <div style={{ width: 20, height: 1.5, background: C.gold, borderRadius: 2 }} />
    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: light ? C.goldLight : C.gold }}>{text}</span>
  </div>
);

/* Desktop section label (original) */
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

/* ═══════════════════════════════════════════════════════════
   FAQ ITEM — works on both breakpoints
═══════════════════════════════════════════════════════════ */
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07 }} viewport={{ once: true }}
      style={{ border: `1px solid ${open ? C.gold : "rgba(8,21,41,0.1)"}`, borderRadius: 16, overflow: "hidden", background: open ? "rgba(201,151,58,0.02)" : "#fff", transition: "border-color 0.25s, background 0.25s" }}
    >
      <button onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", gap: "0.75rem", minHeight: 56 }}>
        <span style={{ fontSize: "0.88rem", fontWeight: 600, color: C.navy, flex: 1, lineHeight: 1.5 }}>{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0, background: open ? C.gold : "rgba(8,21,41,0.07)" }} transition={{ duration: 0.25 }}
          style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
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

/* ═══════════════════════════════════════════════════════════
   HEADER / NAV
═══════════════════════════════════════════════════════════ */
function Header({ active, scrolled }: { active: string; scrolled: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: scrolled ? "rgba(8,21,41,0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "none",
          transition: "all 0.4s ease",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>

          {/* Logo */}
          <button onClick={() => go("hero")} style={{ display: "flex", alignItems: "center", gap: 12, background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
            <div style={{ width: 44, height: 44, position: "relative", flexShrink: 0, filter: "drop-shadow(0 0 8px rgba(201,151,58,0.2))" }}>
              <Image src="/logo3.png" alt="Logo DISPERINDAG" fill className="object-contain" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: "0.1em", textTransform: "uppercase", lineHeight: 1.1 }}>DISPERINDAG</div>
              <div style={{ fontSize: 10, color: C.goldLight, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.9, fontWeight: 600 }}>Sumatera Barat</div>
            </div>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: "2.5rem" }}>
            {navLinks.map(item => (
              <motion.button key={item}
                onClick={() => go(item === "Beranda" ? "hero" : item.toLowerCase())}
                whileHover={{ y: -2, color: C.gold }}
                style={{ background: "none", border: "none", cursor: "pointer", textDecoration: "none", color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", transition: "all 0.3s ease" }}
              >{item}</motion.button>
            ))}
            <motion.button onClick={() => go("layanan")}
              whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(201,151,58,0.4)" }}
              whileTap={{ scale: 0.98 }}
              style={{ padding: "10px 22px", background: C.gold, color: C.navy, borderRadius: 10, fontWeight: 800, fontSize: 13, border: "none", cursor: "pointer", transition: "all 0.3s" }}
            >Portal Layanan</motion.button>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(true)} className="flex md:hidden" aria-label="Buka menu"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", width: 44, height: 44, borderRadius: 12, flexDirection: "column", gap: 5, alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
            <span style={{ display: "block", width: 20, height: 2, background: "#fff", borderRadius: 2 }} />
            <span style={{ display: "block", width: 14, height: 2, background: C.gold, borderRadius: 2 }} />
            <span style={{ display: "block", width: 20, height: 2, background: "#fff", borderRadius: 2 }} />
          </button>
        </div>
      </motion.nav>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: C.navy, display: "flex", flexDirection: "column", overflow: "hidden" }}
          >
            <div style={{ position: "absolute", top: "-10%", right: "-10%", width: "70%", height: "40%", background: `radial-gradient(circle, rgba(201,151,58,0.1) 0%, transparent 70%)`, filter: "blur(40px)", pointerEvents: "none" }} />

            {/* Drawer header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: `1px solid ${C.borderSub}`, flexShrink: 0, position: "relative", zIndex: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, position: "relative", flexShrink: 0 }}>
                  <Image src="/logo3.png" alt="Logo DISPERINDAG" fill className="object-contain" />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" }}>DISPERINDAG</div>
                  <div style={{ fontSize: 9, color: C.goldLight, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.8 }}>Sumatera Barat</div>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)}
                style={{ width: 44, height: 44, border: `1px solid rgba(255,255,255,0.15)`, borderRadius: 14, background: "rgba(255,255,255,0.05)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={20} />
              </button>
            </div>

            {/* Drawer links */}
            <div style={{ flex: 1, overflowY: "auto", padding: "2rem 1.5rem", position: "relative", zIndex: 10 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {NAV.map((n, i) => (
                  <motion.button key={n.id}
                    onClick={() => { go(n.id); setMobileOpen(false); }}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "1.25rem 1rem", borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)",
                      color: active === n.id ? C.goldLight : "#fff", fontSize: "1.1rem", fontWeight: 600,
                      background: active === n.id ? "rgba(201,151,58,0.1)" : "rgba(255,255,255,0.03)",
                      cursor: "pointer", textAlign: "left",
                    }}>
                    <span>{n.label}</span>
                    <ArrowRight size={18} color={C.gold} />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Drawer CTA */}
            <div style={{ padding: "1.5rem", flexShrink: 0, position: "relative", zIndex: 10, background: "linear-gradient(to top, rgba(8,21,41,1), transparent)" }}>
              <motion.button onClick={() => { go("layanan"); setMobileOpen(false); }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }} whileTap={{ scale: 0.95 }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "1.25rem", background: C.gold, color: C.navy, borderRadius: 16, fontWeight: 800, fontSize: "1rem", border: "none", cursor: "pointer", letterSpacing: "0.02em", boxShadow: "0 10px 30px rgba(201,151,58,0.3)", width: "100%" }}>
                Akses Portal Layanan <ArrowRight size={20} />
              </motion.button>
              <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "1.5rem", opacity: 0.5 }}>
                {[Facebook, Twitter, Instagram].map((Icon, i) => <Icon key={i} size={20} color="#fff" />)}
              </div>
              <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: "1.5rem", letterSpacing: "0.05em" }}>© 2026 DISPERINDAG Sumatera Barat</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   BOTTOM NAV — mobile only
═══════════════════════════════════════════════════════════ */
const BottomNav = memo(({ active }: { active: string }) => (
  <nav className="flex md:hidden" style={{
    position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 90,
    background: "rgba(7,17,31,0.96)", backdropFilter: "blur(20px) saturate(160%)",
    borderTop: `1px solid ${C.rimDark}`,
    height: 60, alignItems: "stretch",
    paddingBottom: "env(safe-area-inset-bottom, 0px)",
  }}>
    {NAV.map((n) => {
      const isActive = active === n.id;
      return (
        <button key={n.id} onClick={() => go(n.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, background: "transparent", border: "none", cursor: "pointer", position: "relative" }}>
          {isActive && (
            <motion.div layoutId="bnav-pill"
              style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 20, height: 2.5, borderRadius: C.rpill, background: C.gold }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <div style={{ width: 30, height: 30, borderRadius: C.r3, display: "flex", alignItems: "center", justifyContent: "center", background: isActive ? "rgba(200,151,59,0.14)" : "transparent", transition: "background 0.2s" }}>
            <n.Icon size={16} color={isActive ? C.goldLight : "rgba(255,255,255,0.32)"} strokeWidth={isActive ? 2.2 : 1.6} />
          </div>
          <span style={{ fontSize: 9, letterSpacing: "0.02em", lineHeight: 1, fontWeight: isActive ? 700 : 400, color: isActive ? C.goldLight : "rgba(255,255,255,0.3)" }}>{n.label}</span>
        </button>
      );
    })}
  </nav>
));
BottomNav.displayName = "BottomNav";

/* ═══════════════════════════════════════════════════════════
   SECTION: HERO
   — Mobile: new dark luxe design
   — Desktop: original design (floating orbs, grid, waves)
═══════════════════════════════════════════════════════════ */
function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroBgY     = useTransform(scrollYProgress, [0, 1], ["0%", "24%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section id="hero" ref={heroRef}
      style={{ minHeight: "100svh", background: C.navy, position: "relative", overflow: "hidden", display: "flex", alignItems: "center" }}
    >
      {/* BG parallax */}
      <motion.div style={{ position: "absolute", inset: 0, y: heroBgY }}>
        <Image src="/home1.png" alt="Kota Padang" fill priority className="object-cover object-center" style={{ opacity: 0.12 }} />
      </motion.div>

      {/* Desktop decorations */}
      <div className="hidden md:block">
        <div style={{ position: "absolute", left: "20%", top: "40%", width: "60vw", height: "60vw", background: "radial-gradient(circle, rgba(201,151,58,0.08) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />
        <HeroGrid />
        <DiagonalLines />
        <FloatingOrbs />
        {/* Spinning ring */}
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", right: "-10vw", top: "40%", width: "60vw", height: "60vw", maxWidth: 800, maxHeight: 800, borderRadius: "50%", border: "1px dashed rgba(201,151,58,0.1)", transform: "translateY(-50%)", pointerEvents: "none" }}
        />
      </div>

      {/* Mobile ambient glow */}
      <div className="block md:hidden" style={{ position: "absolute", top: "5%", left: "50%", transform: "translateX(-50%)", width: "100%", height: "70%", background: "radial-gradient(ellipse 70% 60% at 50% 30%, rgba(200,151,59,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
      {/* Mobile noise */}
      <div className="block md:hidden" style={{ position: "absolute", inset: 0, opacity: 0.025, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", backgroundSize: "200px" }} />
      {/* Mobile horizontal accent */}
      <div className="block md:hidden" style={{ position: "absolute", top: "40%", left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent 0%, ${C.rimGold} 20%, ${C.rimGold} 80%, transparent 100%)`, opacity: 0.4 }} />

      {/* ── DESKTOP CONTENT (original) ── */}
      <motion.div style={{ opacity: heroOpacity, position: "relative", zIndex: 10, width: "100%" }} className="hidden md:block">
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(100px, 15vh, 160px) 1.5rem" }}>
          <div style={{ maxWidth: 880 }}>
            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px 6px 10px", border: `1px solid ${C.border}`, borderRadius: 100, marginBottom: "2rem", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.goldLight, background: "rgba(201,151,58,0.1)", backdropFilter: "blur(8px)" }}>
              <div style={{ position: "relative", width: 8, height: 8 }}>
                <motion.span animate={{ scale: [1, 2, 1], opacity: [1, 0, 1] }} transition={{ duration: 2, repeat: Infinity }}
                  style={{ position: "absolute", inset: 0, borderRadius: "50%", background: C.gold }} />
                <span style={{ position: "absolute", inset: 1, borderRadius: "50%", background: C.gold, boxShadow: `0 0 10px ${C.gold}` }} />
              </div>
              Portal Layanan Publik Resmi
            </motion.div>

            {/* Heading */}
            <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}>
              <motion.h1 variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(3.2rem, 9vw, 6.5rem)", fontWeight: 600, lineHeight: 0.95, color: "#fff", marginBottom: "1.5rem" }}>
                Dinas<br />
                <span style={{ color: C.goldLight, position: "relative", display: "inline-block" }}>
                  <em style={{ fontStyle: "italic" }}>Perindustrian</em>
                  <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1, delay: 1 }}
                    style={{ position: "absolute", bottom: "15%", left: 0, height: 2, background: C.gold, opacity: 0.3 }} />
                </span><br />
                &amp; Perdagangan
              </motion.h1>

              <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                style={{ display: "flex", alignItems: "center", gap: 15, marginBottom: "1.5rem" }}>
                <div style={{ width: 45, height: 2, background: `linear-gradient(90deg, ${C.gold}, transparent)`, borderRadius: 2 }} />
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: C.goldLight, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700 }}>Provinsi Sumatera Barat</span>
              </motion.div>

              <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                style={{ fontSize: "clamp(1rem, 2.5vw, 1.15rem)", lineHeight: 1.8, color: "rgba(255,255,255,0.65)", maxWidth: 540, marginBottom: "3rem", fontWeight: 400 }}>
                Mewujudkan ekosistem ekonomi digital yang inklusif melalui inovasi, transparansi, dan pelayanan prima kepada seluruh pelaku usaha.
              </motion.p>

              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
                <motion.button onClick={() => go("layanan")}
                  whileHover={{ scale: 1.05, boxShadow: "0 15px 40px rgba(201,151,58,0.4)" }} whileTap={{ scale: 0.98 }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "16px 36px", background: C.gold, color: C.navy, borderRadius: 12, fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer", letterSpacing: "0.05em", boxShadow: "0 8px 25px rgba(201,151,58,0.2)" }}>
                  Akses Portal Layanan <ArrowRight size={18} />
                </motion.button>
                <motion.button onClick={() => go("profil")}
                  whileHover={{ background: "rgba(255,255,255,0.05)", borderColor: C.gold, color: C.gold }} whileTap={{ scale: 0.98 }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "16px 36px", background: "rgba(255,255,255,0.03)", color: "#fff", borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)", fontWeight: 600, fontSize: 15, cursor: "pointer", backdropFilter: "blur(10px)", transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)" }}>
                  Profil Dinas
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ── MOBILE CONTENT (new dark luxe) ── */}
      <div className="flex md:hidden" style={{ position: "relative", zIndex: 10, width: "100%", flexDirection: "column", justifyContent: "center", minHeight: "100svh", paddingBottom: "100px" }}>
        <div style={{ padding: "40px 20px 0", maxWidth: 640, margin: "0 auto", width: "100%" }}>

          {/* Mobile status pill */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px 5px 8px", border: `1px solid ${C.rimGold}`, borderRadius: C.rpill, marginBottom: 16, background: "rgba(200,151,59,0.08)" }}>
            <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <motion.span animate={{ scale: [1, 1.9, 1], opacity: [0.9, 0.1, 0.9] }} transition={{ duration: 2.2, repeat: Infinity }}
                style={{ display: "block", width: 6, height: 6, borderRadius: "50%", background: C.gold }} />
              <span style={{ display: "block", width: 6, height: 6, borderRadius: "50%", background: C.gold }} />
            </span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 500, letterSpacing: "0.2em", color: C.goldLight, textTransform: "uppercase" as const }}>Portal Layanan Resmi</span>
          </motion.div>

          {/* Mobile headline — editorial */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07, duration: 0.7 }}
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.6rem, 12vw, 4.2rem)", fontWeight: 800, lineHeight: 0.9, letterSpacing: "-0.025em", color: "#fff", marginBottom: 0 }}>
            <span style={{ display: "block" }}>Dinas</span>
            <span style={{ display: "block", fontStyle: "italic", color: C.goldLight, fontWeight: 400 }}>Perindust-</span>
            <span style={{ display: "block", fontStyle: "italic", color: C.goldLight, fontWeight: 400 }}>rian</span>
            <span style={{ display: "block", color: "rgba(255,255,255,0.22)", fontSize: "0.52em", fontWeight: 700, fontStyle: "normal", letterSpacing: "0.15em", marginTop: "0.6rem", fontFamily: "'DM Mono', monospace" }}>& PERDAGANGAN</span>
          </motion.h1>

          {/* Province line */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
            style={{ display: "flex", alignItems: "center", gap: 12, margin: "12px 0 14px" }}>
            <div style={{ width: 32, height: 1.5, background: `linear-gradient(90deg, ${C.gold}, transparent)` }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 500, color: C.mist, letterSpacing: "0.18em", textTransform: "uppercase" as const }}>Provinsi Sumatera Barat</span>
          </motion.div>

          {/* Description */}
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontSize: 14, lineHeight: 1.75, color: "rgba(255,255,255,0.45)", maxWidth: 360, marginBottom: 20 }}>
            Membangun ekosistem industri dan perdagangan yang inklusif, modern, dan berpihak pada masyarakat.
          </motion.p>

          {/* Mobile CTAs */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}
            style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => go("layanan")}
              style={{ display: "flex", alignItems: "center", gap: 9, padding: "13px 24px", background: C.gold, color: C.navy, border: "none", borderRadius: C.r4, fontWeight: 800, fontSize: 13, cursor: "pointer", letterSpacing: "0.02em", boxShadow: `0 6px 24px rgba(200,151,59,0.35)` }}>
              Akses Layanan <ArrowRight size={15} />
            </button>
            <button onClick={() => go("profil")}
              style={{ padding: "13px 22px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.7)", border: `1px solid ${C.rimDark}`, borderRadius: C.r4, fontWeight: 600, fontSize: 13, cursor: "pointer", backdropFilter: "blur(12px)" }}>
              Profil Dinas
            </button>
          </motion.div>
        </div>

        {/* Mobile stats strip */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          style={{ margin: "20px 20px 0", background: "rgba(255,255,255,0.06)", border: `1px solid ${C.rimGold}`, borderRadius: C.r5, padding: "18px", backdropFilter: "blur(20px)", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
          {[
            { val: "3×24", unit: "jam", label: "Respons Aduan" },
            { val: "24",   unit: "jam", label: "Layanan Online" },
            { val: "3K+",  unit: "",    label: "UMKM Terdampingi" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center", borderRight: i < 2 ? `1px solid ${C.rimDark}` : "none" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.3rem,5.5vw,1.8rem)", fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                {s.val}{s.unit && <span style={{ fontSize: "0.5em", color: C.goldLight, fontFamily: "'DM Mono', monospace", marginLeft: 2 }}>{s.unit}</span>}
              </div>
              <div style={{ fontSize: 10, color: C.mist, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

      </div>
      
      {/* Mobile wave separator (absolute bottom) */}
      <div className="block md:hidden" style={{ position: "absolute", bottom: -1, left: 0, right: 0, zIndex: 20, lineHeight: 0 }}>
        <svg viewBox="0 0 1440 64" preserveAspectRatio="none" style={{ width: "100%", height: 64, display: "block" }}>
          <path d="M0,64 C480,0 960,0 1440,64 L1440,64 L0,64 Z" fill={C.cream} />
        </svg>
      </div>

      {/* Desktop waves + scroll hint */}
      <div className="hidden md:block">
        <HeroWaves />
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2, duration: 1 }}
          style={{ position: "absolute", bottom: 80, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.3)", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 600 }}>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION: LAYANAN
   — Mobile: new card style
   — Desktop: original 3-col grid
═══════════════════════════════════════════════════════════ */
function LayananSection() {
  return (
    <section id="layanan" style={{ background: C.cream, padding: "clamp(36px,8vw,100px) 1.25rem", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, opacity: 0.25 }} />
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* ── DESKTOP HEADER (original split layout) ── */}
        <div className="hidden md:block" style={{ marginBottom: "2.25rem" }}>
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <SectionLabel>Layanan Kami</SectionLabel>
          </motion.div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <motion.h2 initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.9rem, 5vw, 3.2rem)", fontWeight: 600, lineHeight: 1.15, color: C.navy }}>
              Apa yang dapat <em style={{ fontStyle: "italic", color: C.gold }}>kami bantu</em>?
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.16 }}
              style={{ fontSize: "0.875rem", color: C.slate, lineHeight: 1.72, fontWeight: 300, maxWidth: 360 }}>
              Portal layanan terpadu untuk kebutuhan masyarakat dan pelaku usaha Sumatera Barat.
            </motion.p>
          </div>
        </div>

        {/* ── MOBILE HEADER ── */}
        <div className="block md:hidden" style={{ marginBottom: 20 }}>
          <motion.div {...fadeUp(0)}>
            <Eyebrow text="Layanan Kami" />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.7rem,7vw,2.4rem)", fontWeight: 700, color: C.navy, lineHeight: 1.1, marginBottom: 6 }}>
              Apa yang bisa <em style={{ fontStyle: "italic", color: C.gold }}>kami bantu?</em>
            </h2>
            <p style={{ fontSize: 13, color: C.ash, lineHeight: 1.7 }}>Portal terpadu untuk masyarakat dan pelaku usaha Sumatera Barat.</p>
          </motion.div>
        </div>

        {/* ── SERVICE CARDS ── */}
        {/* Desktop: 3-col grid (original style) */}
        <div className="hidden md:grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 290px), 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          {services.map((svc, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              whileHover={{ y: -6, boxShadow: "0 20px 52px rgba(8,21,41,0.1)" }}
              style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(8,21,41,0.07)", overflow: "hidden", display: "flex", flexDirection: "column" }}
            >
              <div style={{ height: 4, background: svc.accent }} />
              <div style={{ padding: "1.4rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: svc.accentBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svc.icon size={21} color={svc.accent} strokeWidth={1.8} />
                  </div>
                  <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 100, background: svc.accentBg, color: svc.accent, fontFamily: "'Space Mono', monospace" }}>{svc.tag}</span>
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.35rem", fontWeight: 600, color: C.navy, lineHeight: 1.25 }}>{svc.title}</div>
                <div style={{ fontSize: "0.84rem", color: C.slate, lineHeight: 1.68, flex: 1 }}>{svc.description}</div>
                <motion.a href={svc.href} target="_blank" rel="noopener noreferrer"
                  whileHover={{ background: svc.accent, color: "#fff", borderColor: svc.accent }} whileTap={{ scale: 0.97 }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "0.875rem 1rem", borderRadius: 10, border: "1px solid rgba(8,21,41,0.11)", fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", textDecoration: "none", color: C.navy, background: "transparent", transition: "all 0.2s", minHeight: 48 }}>
                  {svc.cta} <ArrowRight size={14} />
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: stacked cards (new style) */}
        <div className="flex md:hidden" style={{ flexDirection: "column", gap: 10, marginBottom: 14 }}>
          {services.map((svc, i) => (
            <motion.div key={i} {...fadeUp(i * 0.09)}
              style={{ background: "#fff", borderRadius: C.r5, border: `1px solid ${C.rimLight}`, boxShadow: C.elev1, overflow: "hidden" }}>
              <div style={{ height: 3, background: svc.accent }} />
              <div style={{ padding: "18px 18px 16px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 500, color: C.mist, letterSpacing: "0.08em" }}>0{i + 1}</span>
                    <div style={{ width: 38, height: 38, borderRadius: C.r3, background: svc.accentBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svc.icon size={17} color={svc.accent} strokeWidth={1.9} />
                    </div>
                  </div>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8.5, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: "3px 10px", borderRadius: C.rpill, color: svc.accent, background: svc.accentBg }}>{svc.tag}</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: C.navy, fontFamily: "'Playfair Display', serif", marginBottom: 5, lineHeight: 1.2 }}>{svc.title}</h3>
                <p style={{ fontSize: 12.5, color: C.ash, lineHeight: 1.6, marginBottom: 14 }}>{svc.description}</p>
                <a href={svc.href} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "11px 14px", borderRadius: C.r3, border: `1.5px solid ${C.rimLight}`, fontSize: 12.5, fontWeight: 700, textDecoration: "none", color: C.navy, letterSpacing: "0.02em", background: "#fff" }}>
                  {svc.cta} <ExternalLink size={12} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── ADDITIONAL SERVICES ── */}
        {/* Desktop: original 4-col hover cards */}
        <div className="hidden md:grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,160px), 1fr))", gap: "0.875rem" }}>
          {additionalServices.map((svc, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4, background: C.navy, borderColor: C.gold }}
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

        {/* Mobile: 2-col quick grid */}
        <div className="grid md:hidden" style={{ gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <motion.div {...fadeUp(0.3)} style={{ gridColumn: "1 / -1" }}>
            <p style={{ fontSize: 10.5, fontFamily: "'DM Mono', monospace", fontWeight: 500, color: C.mist, letterSpacing: "0.18em", textTransform: "uppercase" as const, marginBottom: 10 }}>Akses Cepat</p>
          </motion.div>
          {additionalServices.map((svc, i) => (
            <motion.div key={i} {...fadeUp(i * 0.07)}
              style={{ background: "#fff", borderRadius: C.r4, border: `1px solid ${C.rimLight}`, padding: "14px 14px 12px", boxShadow: C.elev1 }}>
              <div style={{ width: 32, height: 32, borderRadius: C.r3, background: C.cream, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 9 }}>
                <svc.icon size={15} color={C.navy} strokeWidth={1.8} />
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: C.navy, marginBottom: 2 }}>{svc.title}</div>
              <div style={{ fontSize: 10.5, color: C.mist, lineHeight: 1.4 }}>{svc.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION: PROFIL
═══════════════════════════════════════════════════════════ */
function ProfilSection() {
  return (
    <section id="profil" style={{ background: C.navy, padding: "clamp(44px,10vw,100px) 1.25rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: "60%", height: "100%", background: "radial-gradient(ellipse at right center, rgba(201,151,58,0.07) 0%, transparent 62%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>

        {/* Desktop: 2-col layout (original) */}
        <div className="hidden md:grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "clamp(2rem,5vw,4rem)", alignItems: "center" }}>
          <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <SectionLabel light>Sarana &amp; Prasarana</SectionLabel>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.9rem, 5vw, 3.2rem)", fontWeight: 600, lineHeight: 1.15, color: "#fff", marginBottom: "1.25rem" }}>
              Fasilitas &amp; <em style={{ fontStyle: "italic", color: C.goldLight }}>Pelayanan Publik</em>
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
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
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

        {/* Mobile: stacked */}
        <div className="block md:hidden">
          <motion.div {...fadeUp(0)} style={{ marginBottom: 22 }}>
            <Eyebrow text="Sarana &amp; Prasarana" light />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem,7vw,2.4rem)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 10 }}>
              Fasilitas &amp; <em style={{ fontStyle: "italic", color: C.goldLight }}>Pelayanan</em>
            </h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.72, marginBottom: 18, maxWidth: 380 }}>Berkomitmen mewujudkan industri yang tangguh dan perdagangan yang adil untuk Sumatera Barat.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 24 }}>
              {["Pelayanan Prima", "Inovasi Digital", "UMKM Berdaya Saing", "Transparansi"].map(p => (
                <span key={p} style={{ padding: "5px 13px", border: `1px solid ${C.rimGold}`, borderRadius: C.rpill, fontSize: 10.5, color: C.goldLight, background: "rgba(200,151,59,0.07)" }}>{p}</span>
              ))}
            </div>
          </motion.div>
          <motion.div {...fadeUp(0.14)} style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gridTemplateRows: "auto auto", gap: 8 }}>
            <div style={{ gridRow: "span 2", borderRadius: C.r5, overflow: "hidden", position: "relative", minHeight: 200, border: `1px solid ${C.borderSub}` }}>
              <Image src="/1.jpeg" alt="Kegiatan" fill className="object-cover" style={{ opacity: 0.84 }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, transparent 50%, rgba(7,17,31,0.5))" }} />
            </div>
            {["/2.jpeg", "/3.jpeg"].map((src, i) => (
              <div key={i} style={{ borderRadius: C.r4, overflow: "hidden", position: "relative", aspectRatio: "4/3", border: `1px solid ${C.borderSub}` }}>
                <Image src={src} alt="" fill className="object-cover" style={{ opacity: 0.84 }} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION: FAQ
═══════════════════════════════════════════════════════════ */
function FAQSection() {
  return (
    <section id="faq" style={{ padding: "clamp(44px,10vw,100px) 1.25rem", background: "#fff" }}>
      <div style={{ maxWidth: 840, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: "2.75rem" }}>
          {/* Desktop label */}
          <div className="hidden md:block"><SectionLabel center>Pertanyaan Umum</SectionLabel></div>
          {/* Mobile eyebrow centered */}
          <div className="flex md:hidden" style={{ justifyContent: "center", marginBottom: 10 }}>
            <Eyebrow text="FAQ" />
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.85rem, 5vw, 3rem)", fontWeight: 600, color: C.navy, lineHeight: 1.2, marginTop: "0.25rem" }}>
            Pertanyaan yang <em style={{ fontStyle: "italic", color: C.gold }}>Sering Diajukan</em>
          </h2>
        </motion.div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          {faqs.map((item, i) => <FaqItem key={i} q={item.q} a={item.a} index={i} />)}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION: KONTAK
═══════════════════════════════════════════════════════════ */
function KontakSection() {
  return (
    <section id="kontak" style={{ padding: "clamp(44px,10vw,100px) 1.25rem", background: C.cream }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* Desktop: 2-col (original) */}
        <div className="hidden md:grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))", gap: "clamp(2rem,5vw,4rem)", alignItems: "start" }}>
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
                style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={17} color={C.gold} strokeWidth={1.8} />
                </div>
                <div>
                  <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.slateLight, marginBottom: 4, fontFamily: "'Space Mono', monospace" }}>{label}</div>
                  <div style={{ fontSize: "0.88rem", color: C.navy, fontWeight: 500, whiteSpace: "pre-line", lineHeight: 1.55 }}>{val}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.14 }}
            style={{ borderRadius: 18, overflow: "hidden", border: "1px solid rgba(8,21,41,0.09)", boxShadow: "0 8px 32px rgba(8,21,41,0.07)", aspectRatio: "4/3", minHeight: 260 }}>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.2793680888847!2d100.354123!3d-0.955789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwNTcnMjAuOCJTIDEwMMKwMjEnMTQuOSJF!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid"
              width="100%" height="100%" style={{ border: 0, display: "block" }} allowFullScreen loading="lazy" title="Peta DISPERINDAG" />
          </motion.div>
        </div>

        {/* Mobile: stacked */}
        <div className="block md:hidden">
          <motion.div {...fadeUp(0)} style={{ marginBottom: 18 }}>
            <Eyebrow text="Hubungi Kami" />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem,7vw,2.4rem)", fontWeight: 700, color: C.navy, lineHeight: 1.1 }}>
              Lokasi &amp; <em style={{ fontStyle: "italic", color: C.gold }}>Kontak</em>
            </h2>
          </motion.div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {[
              { icon: MapPin, label: "Alamat",  val: "Jl. Aur No.1, Padang Pasir,\nKec. Padang Barat, Kota Padang" },
              { icon: Phone,  label: "Telepon", val: "+62 821 7101 9451" },
              { icon: Mail,   label: "Email",   val: "disperindang@sumbarprov.go.id" },
            ].map(({ icon: Icon, label, val }, i) => (
              <motion.div key={i} {...fadeUp(i * 0.08)}
                style={{ display: "flex", gap: 13, alignItems: "flex-start", padding: "15px 16px", background: "#fff", borderRadius: C.r4, border: `1px solid ${C.rimLight}`, boxShadow: C.elev1 }}>
                <div style={{ width: 36, height: 36, borderRadius: C.r3, background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={15} color={C.gold} strokeWidth={1.8} />
                </div>
                <div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8.5, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: C.mist, marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 13, color: C.navy, fontWeight: 600, whiteSpace: "pre-line", lineHeight: 1.55 }}>{val}</div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div {...fadeUp(0.24)} style={{ borderRadius: C.r5, overflow: "hidden", border: `1px solid ${C.rimLight}`, boxShadow: C.elev2, aspectRatio: "16/9" }}>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.2793680888847!2d100.354123!3d-0.955789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwNTcnMjAuOCJTIDEwMMKwMjEnMTQuOSJF!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid"
              width="100%" height="100%" style={{ border: 0, display: "block" }} allowFullScreen loading="lazy" title="Peta DISPERINDAG" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════ */
function FooterSection() {
  return (
    <footer style={{ background: C.navy, padding: "3.5rem 1.25rem 2rem" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 190px), 1fr))", gap: "2.25rem", paddingBottom: "2.25rem", borderBottom: `1px solid ${C.borderSub}` }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.875rem" }}>
              <div style={{ width: 38, height: 38, position: "relative", flexShrink: 0 }}>
                <Image src="/logo.jpg" alt="Logo DISPERINDAG" fill className="object-contain" />
              </div>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" }}>DISPERINDAG SUMBAR</span>
            </div>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.38)", lineHeight: 1.7, fontWeight: 300 }}>Portal Layanan Publik Dinas Perindustrian dan Perdagangan Provinsi Sumatera Barat.</p>
          </div>
          {[
            { title: "Layanan", items: ["Buku Tamu Digital", "Survey Kepuasan", "Layanan Aduan"] },
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
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════ */
export default function Page() {
  const [active,   setActive]   = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [showTop,  setShowTop]  = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 48);
      setShowTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.35, rootMargin: "-5% 0px -45% 0px" }
    );
    NAV.forEach(n => { const el = document.getElementById(n.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#fff", color: C.navy, overflowX: "hidden" }}>
      <Header active={active} scrolled={scrolled} />

      <main style={{ paddingBottom: 60 }} className="md:pb-0">
        <HeroSection />
        <LayananSection />
        <ProfilSection />
        <FAQSection />
        <KontakSection />
      </main>

      <FooterSection />

      {/* Bottom nav — mobile only */}
      <BottomNav active={active} />

      {/* Back to top — desktop only */}
      <AnimatePresence>
        {showTop && (
          <motion.button className="hidden md:flex"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ y: -3, boxShadow: "0 10px 30px rgba(201,151,58,0.45)" }} whileTap={{ scale: 0.92 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Kembali ke atas"
            style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", width: 48, height: 48, borderRadius: 14, background: C.gold, border: "none", cursor: "pointer", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(201,151,58,0.4)", zIndex: 90 }}>
            <ChevronUp size={20} color={C.navy} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}