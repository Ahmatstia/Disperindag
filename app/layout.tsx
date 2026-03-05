import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond, DM_Sans, DM_Mono, Playfair_Display, Space_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Portal Layanan | DISPERINDAG Sumatera Barat",
    template: "%s | DISPERINDAG Sumatera Barat",
  },
  description: "Portal Layanan Publik Resmi Dinas Perindustrian dan Perdagangan Provinsi Sumatera Barat. Akses buku tamu digital, survey kepuasan, dan layanan aduan online.",
  keywords: ["Disperindag", "Sumatera Barat", "Layanan Publik", "Padang", "Perindustrian", "Perdagangan", "Aduan Masyarakat"],
  authors: [{ name: "DISPERINDAG Sumatera Barat" }],
  creator: "DISPERINDAG Sumatera Barat",
  publisher: "DISPERINDAG Sumatera Barat",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Portal Layanan | DISPERINDAG Sumatera Barat",
    description: "Portal Layanan Publik Resmi Dinas Perindustrian dan Perdagangan Provinsi Sumatera Barat",
    url: "https://disperindag.sumbarprov.go.id", // Sesuaikan jika ada domain asli
    siteName: "DISPERINDAG SUMBAR",
    locale: "id_ID",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${dmSans.variable} ${dmMono.variable} ${playfair.variable} ${spaceMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
