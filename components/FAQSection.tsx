// components/FAQSection.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, HelpCircle } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What is the purpose of this website?",
    answer: "This website is a place to help you find the best products and services in the world. Kami menyediakan berbagai informasi dan layanan untuk memenuhi kebutuhan Anda.",
  },
  {
    question: "How do I contact support?",
    answer: "Anda dapat menghubungi support kami melalui email di support@disperindag.go.id atau telepon di (0751) 123-456 pada jam kerja (Senin-Jumat, 08.00-16.00 WIB).",
  },
  {
    question: "How do I find the best products?",
    answer: "Kami menyediakan fitur pencarian dan filter untuk membantu Anda menemukan produk terbaik. Anda juga bisa melihat rating dan review dari pengguna lain.",
  },
  {
    question: "Can I return a product?",
    answer: "Ya, Anda dapat mengembalikan produk dalam waktu 7 hari setelah penerimaan dengan syarat produk dalam kondisi baik dan tidak rusak.",
  },
  {
    question: "Do you offer international shipping?",
    answer: "Saat ini kami hanya melayani pengiriman domestik di seluruh wilayah Indonesia. Untuk pengiriman internasional sedang dalam pengembangan.",
  },
  {
    question: "How can I track my order?",
    answer: "Anda dapat melacak pesanan melalui halaman 'Lacak Pesanan' dengan memasukkan nomor resi yang dikirimkan via email setelah pesanan diproses.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-2 block">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
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
                className={`rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden
                  ${openIndex === index ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
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
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <HelpCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-semibold text-gray-900 text-lg">
                      {faq.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronRight className="w-5 h-5 text-blue-600" />
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
                      <div className="px-6 pb-6 pl-[4.5rem] text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
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