// components/ui/layout-grid.tsx
"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react"; // Tambahkan AnimatePresence di sini
import Image from "next/image";
import { X } from "lucide-react"; // Import X icon
import { cn } from "@/lib/utils";

type Card = {
  id: number;
  content: JSX.Element | React.ReactNode | string;
  className: string;
  thumbnail: string;
};

export const LayoutGrid = ({ cards }: { cards: Card[] }) => {
  const [selected, setSelected] = useState<Card | null>(null);
  const [lastSelected, setLastSelected] = useState<Card | null>(null);

  const handleClick = (card: Card) => {
    setLastSelected(selected);
    setSelected(card);
  };

  const handleOutsideClick = () => {
    setLastSelected(selected);
    setSelected(null);
  };

  return (
    <div className="w-full h-full p-4 md:p-10 grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-4 relative">
      {cards.map((card, i) => (
        <div key={i} className={cn(card.className)}>
          <motion.div
            onClick={() => handleClick(card)}
            className={cn(
              "relative overflow-hidden rounded-xl cursor-pointer",
              "bg-white dark:bg-neutral-900",
              "h-60 md:h-80 w-full",
              selected?.id === card.id
                ? "fixed inset-4 md:inset-10 z-50 !h-auto !w-auto cursor-default"
                : "",
              lastSelected?.id === card.id ? "z-40" : "",
            )}
            layoutId={`card-${card.id}`}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Overlay untuk card yang tidak dipilih */}
            {selected?.id !== card.id && (
              <div className="absolute inset-0 bg-black/20 z-10 transition-opacity hover:opacity-0" />
            )}

            <ImageComponent card={card} />

            {/* Content untuk preview (hanya muncul saat tidak dipilih) */}
            {selected?.id !== card.id && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-20">
                <div className="text-white">
                  {typeof card.content === "string" ? (
                    <p className="text-sm font-medium">{card.content}</p>
                  ) : (
                    <div className="text-sm">{card.content}</div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      ))}

      {/* Background overlay saat card dipilih */}
      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOutsideClick}
          className="fixed inset-0 bg-black/70 z-40"
        />
      )}

      {/* Selected Card Detail */}
      <AnimatePresence>
        {selected && (
          <motion.div
            layoutId={`card-${selected.id}`}
            className="fixed inset-4 md:inset-10 z-50 bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="relative h-full w-full">
              <Image
                src={selected.thumbnail}
                alt="Selected"
                fill
                className="object-contain md:object-cover"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.2 }}
                >
                  {selected.content}
                </motion.div>
              </div>
              <button
                onClick={handleOutsideClick}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ImageComponent = ({ card }: { card: Card }) => {
  return (
    <motion.div
      layoutId={`image-${card.id}-image`}
      className="relative w-full h-full"
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <Image
        src={card.thumbnail}
        alt="Gallery"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
    </motion.div>
  );
};
