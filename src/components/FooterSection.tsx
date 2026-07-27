import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { SurpriseModal } from './SurpriseModal';

export const FooterSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center bg-transparent px-4 sm:px-8 py-12 overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-theme-brownDark/10 rounded-full blur-[100px] pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, type: 'spring', stiffness: 50 }}
          className="z-10 flex flex-col items-center gap-6 max-w-lg"
        >
          {/* Heart icon */}
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="text-theme-brownMedium mb-2"
          >
            <Heart size={32} className="fill-theme-brownMedium/30 stroke-[1.5]" />
          </motion.div>

          {/* Serif Quote */}
          <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl text-theme-brownLight tracking-widest font-light italic leading-tight">
            One Last Wish
          </h3>

          {/* Small subtext */}
          <p className="font-sans text-xs sm:text-sm text-theme-blueLight/60 tracking-[0.15em] sm:tracking-[0.2em] uppercase font-light max-w-[260px] sm:max-w-xs leading-relaxed mt-2">
            Makasih ya, Irma, udah hadir di hidup aku. Semoga kita tetap bisa jadi teman yang saling dukung, sama-sama belajar, sama-sama berkembang, dan semoga semua yang kita impikan bisa tercapai.
          </p>

          {/* Separator line */}
          <div className="w-16 h-[1px] bg-theme-brownDark/30 my-4"></div>

          {/* Copyright */}
          <span className="font-sans text-[10px] text-theme-blueLight/40 tracking-wider">
            Created with love, just for you. &bull; {new Date().getFullYear()}
          </span>

          {/* ── 🎁 Surprise Gift Button ── */}
          <motion.button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 px-8 py-3.5 rounded-full font-sans text-sm sm:text-base tracking-wider
                       bg-gradient-to-r from-theme-brownDark/30 via-theme-brownMedium/20 to-theme-brownDark/30
                       border border-theme-brownMedium/30
                       text-theme-brownLight hover:text-white
                       hover:border-theme-brownMedium/60 hover:from-theme-brownDark/50 hover:via-theme-brownMedium/30 hover:to-theme-brownDark/50
                       transition-all duration-500 cursor-pointer backdrop-blur-sm
                       shadow-lg shadow-theme-brownDark/10 hover:shadow-theme-brownMedium/20"
            animate={{
              scale: [1, 1.04, 1],
              boxShadow: [
                '0 4px 20px rgba(163, 112, 76, 0.08)',
                '0 4px 30px rgba(163, 112, 76, 0.18)',
                '0 4px 20px rgba(163, 112, 76, 0.08)',
              ],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
          >
            🎁 Hadiah Buat Kamu
          </motion.button>
        </motion.div>
      </section>

      {/* ── Surprise Modal ── */}
      <SurpriseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
