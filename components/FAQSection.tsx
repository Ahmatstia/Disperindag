// components/FAQSection.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, HelpCircle } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Apa saja layanan utama yang tersedia di Portal ini?",
    answer: "Portal ini menyediakan akses cepat ke Buku Tamu Digital, Survey Kepuasan Pelayanan, Layanan Aduan Online, serta informasi terkait Izin Usaha, Informasi Pasar, dan Pendampingan UMKM.",
  },
  {
    question: "Bagaimana cara saya menyampaikan keluhan atau aspirasi?",
    answer: "Anda dapat menggunakan 'Layanan Aduan' yang tersedia di halaman utama. Cukup klik tombol 'Buat Aduan' dan isi formulir yang disediakan. Kami berkomitmen untuk menindaklanjuti setiap aduan maksimal dalam 3x24 jam.",
  },
  {
    question: "Apakah ada program khusus untuk pengembangan UMKM di Sumatera Barat?",
    answer: "Ya, kami memiliki program Pendampingan UMKM yang meliputi bimbingan teknis, fasilitasi akses permodalan, dan bantuan perluasan akses pasar baik lokal maupun internasional.",
  },
  {
    question: "Di mana saya bisa mendapatkan informasi harga komoditas pasar terkini?",
    answer: "Informasi harga pasar diperbarui secara berkala dan dapat diakses melalui bagian 'Layanan Lainnya' di menu 'Informasi Pasar'.",
  },
  {
    question: "Di mana lokasi kantor Dinas Perindustrian dan Perdagangan Sumbar?",
    answer: "Kantor kami berlokasi di Jl. Aur No.1, Padang Pasir, Kec. Padang Barat, Kota Padang, Sumatera Barat. Anda juga dapat menghubungi kami melalui telepon di +6282171019451.",
  },
  {
    question: "Apakah pengisian Buku Tamu Digital diwajibkan bagi pengunjung?",
    answer: "Kami sangat menyarankan setiap pengunjung untuk mengisi Buku Tamu Digital guna membantu kami mendata kunjungan dan meningkatkan kualitas pelayanan di masa mendatang.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-slate-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-2 block">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Temukan jawaban atas pertanyaan yang sering diajukan tentang layanan kami
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="mb-4"
            >
              <motion.div
                className={`rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden
                  ${openIndex === index ? 'ring-2 ring-cyan-500 ring-opacity-50' : ''}`}
                animate={{
                  scale: openIndex === index ? 1.02 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-cyan-500/10 rounded-full flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                      <HelpCircle className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="font-semibold text-white text-lg">
                      {faq.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronRight className="w-5 h-5 text-cyan-400" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pl-[4.5rem] text-white/70 leading-relaxed border-t border-white/10 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </div>
    
      </div>
    </section>
  );
}