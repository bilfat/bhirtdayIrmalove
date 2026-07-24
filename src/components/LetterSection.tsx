import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Heart, ChevronRight } from 'lucide-react';

// ─── Local image imports (src/assets/irma/) ────────────────────────────────
// Main frames (2.jpeg to 9.jpeg)
import irma2 from '../assets/irma/2.jpeg';
import irma3 from '../assets/irma/3.jpeg';
import irma4 from '../assets/irma/4.jpeg';
import irma5 from '../assets/irma/5.jpeg';
import irma6 from '../assets/irma/6.jpeg';
import irma7 from '../assets/irma/7.jpeg';
import irma8 from '../assets/irma/8.jpeg';
import irma9 from '../assets/irma/9.jpeg';

// Background/Decorative frames (1.jpeg and 10.jpeg)
import irma1  from '../assets/irma/1.jpeg';
import irma10 from '../assets/irma/10.jpeg';

interface LetterSectionProps {
  onNext: () => void;
}

interface PolaroidFrame {
  id: number;
  label: string;
  rotation: string; // Tailwind class for rotate offset
  imageUrl: string;
}

export const LetterSection: React.FC<LetterSectionProps> = ({ onNext }) => {
  const leftFrames: PolaroidFrame[] = [
    { id: 1, label: 'Tawa Pertama', rotation: '-rotate-6 hover:rotate-0 translate-x-2', imageUrl: irma2 },
    { id: 2, label: 'Momen Teduh',  rotation: 'rotate-3 hover:rotate-0 -translate-x-1',  imageUrl: irma3 },
    { id: 3, label: 'Senja Bersama', rotation: '-rotate-3 hover:rotate-0 translate-x-1', imageUrl: irma4 },
    { id: 4, label: 'Langkah Awal',  rotation: 'rotate-6 hover:rotate-0 -translate-x-2',  imageUrl: irma5 },
  ];

  const rightFrames: PolaroidFrame[] = [
    { id: 5, label: 'Tatapan Hangat', rotation: 'rotate-6 hover:rotate-0 -translate-x-2',  imageUrl: irma6 },
    { id: 6, label: 'Cerita Sore',    rotation: '-rotate-3 hover:rotate-0 translate-x-1', imageUrl: irma7 },
    { id: 7, label: 'Canda Tawa',     rotation: 'rotate-3 hover:rotate-0 -translate-x-1',  imageUrl: irma8 },
    { id: 8, label: 'Harapan Kita',   rotation: '-rotate-6 hover:rotate-0 translate-x-2', imageUrl: irma9 },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
      },
    },
  };

  const renderPolaroid = (frame: PolaroidFrame) => (
    <motion.div
      key={frame.id}
      variants={itemVariants}
      className={`polaroid-card flex flex-col bg-[#fdfdfb] p-2.5 pb-2.5 border border-gray-200/40 rounded-sm shadow-md transition-all duration-300 w-28 h-32 sm:w-32 sm:h-36 md:w-36 md:h-42 ${frame.rotation} select-none mx-auto`}
    >
      {/* Polaroid Image Container — Captions/Labels removed completely as requested */}
      <div className="flex-1 overflow-hidden bg-gray-100 rounded-sm relative">
        <img
          src={frame.imageUrl}
          alt={frame.label}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-108"
          loading="lazy"
          draggable={false}
        />
      </div>
    </motion.div>
  );

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center px-3 sm:px-6 py-12 sm:py-16 bg-transparent overflow-x-hidden">
      {/* ── Background Glow Blobs ────────────────────────────────────────── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-[400px] md:w-[600px] h-64 sm:h-[400px] md:h-[600px] bg-theme-brownDark/5 rounded-full blur-[130px] pointer-events-none" />

      {/* ── Decorative Background Polaroid 1 (irma1) — Left-Bottom ──────── */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [-10, -8, -10] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        className="absolute left-6 bottom-10 hidden xl:flex flex-col bg-[#fdfdfb] p-2 pb-6 border border-gray-200/20 rounded-sm shadow-lg w-28 h-36 opacity-[0.16] pointer-events-none transform -rotate-12 select-none"
      >
        <div className="flex-1 overflow-hidden bg-gray-100 rounded-sm">
          <img src={irma1} alt="" className="w-full h-full object-cover" loading="lazy" />
        </div>
      </motion.div>

      {/* ── Decorative Background Polaroid 2 (irma10) — Right-Top ────────── */}
      <motion.div
        animate={{ y: [0, 10, 0], rotate: [8, 10, 8] }}
        transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
        className="absolute right-8 top-12 hidden xl:flex flex-col bg-[#fdfdfb] p-2 pb-6 border border-gray-200/20 rounded-sm shadow-lg w-28 h-36 opacity-[0.16] pointer-events-none transform rotate-8 select-none"
      >
        <div className="flex-1 overflow-hidden bg-gray-100 rounded-sm">
          <img src={irma10} alt="" className="w-full h-full object-cover" loading="lazy" />
        </div>
      </motion.div>

      {/* ── Grid Layout ─────────────────────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-4 items-center z-10"
      >
        {/* LEFT COLUMN: 4 Aesthetic Polaroids (Stacked/Scattered vertically) */}
        <div className="hidden lg:flex flex-col gap-6 items-center col-span-1 justify-center">
          {leftFrames.map(renderPolaroid)}
        </div>

        {/* CENTER COLUMN: The Cuter, Highly Decorated Poetic Letter Card */}
        <div className="col-span-1 lg:col-span-2 flex flex-col items-center justify-center px-2 md:px-4">
          <motion.div
            variants={itemVariants}
            className="w-full bg-[#1e1a18]/75 border border-theme-brownMedium/30 rounded-2xl sm:rounded-3xl p-6 sm:p-9 md:p-12 backdrop-blur-md text-center relative overflow-visible"
            style={{
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65), 0 0 35px rgba(255, 182, 193, 0.12), inset 0 0 20px rgba(255, 182, 193, 0.05)',
            }}
          >
            {/* ── Romantic Floating/Glowing Hearts (Absolute Positioned) ────── */}
            {/* Top Left Floating Heart */}
            <motion.div
              animate={{ y: [0, -10, 0], x: [0, 5, 0], scale: [1, 1.12, 1] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
              className="absolute -top-4 -left-4 text-theme-brownMedium drop-shadow-[0_0_12px_rgba(255,182,193,0.4)] pointer-events-none"
            >
              <Heart size={32} className="fill-theme-brownMedium/35 stroke-[1.5]" />
            </motion.div>

            {/* Bottom Right Floating Heart */}
            <motion.div
              animate={{ y: [0, 8, 0], x: [0, -6, 0], scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 5.2, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-5 -right-4 text-theme-blueLight/60 drop-shadow-[0_0_10px_rgba(163,194,222,0.4)] pointer-events-none"
            >
              <Heart size={28} className="fill-theme-blueLight/25 stroke-[1.5]" />
            </motion.div>

            {/* Top Right Tiny Pulsing Heart */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
              className="absolute top-8 -right-3 text-theme-brownLight drop-shadow-[0_0_8px_rgba(255,182,193,0.3)] pointer-events-none"
            >
              <Heart size={16} className="fill-theme-brownLight/20 stroke-[1.5]" />
            </motion.div>

            {/* Left Central Floating Heart */}
            <motion.div
              animate={{ x: [0, -8, 0], y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 0.5 }}
              className="absolute top-1/2 -left-6 -translate-y-1/2 text-theme-brownMedium/50 drop-shadow-[0_0_8px_rgba(255,182,193,0.2)] pointer-events-none"
            >
              <Heart size={20} className="fill-theme-brownMedium/20 stroke-[1.5]" />
            </motion.div>

            {/* ── Card Header ───────────────────────────────────────────────── */}
            <div className="flex flex-col items-center justify-center mb-6">
              {/* Overlapping Heart Accent Icon Header */}
              <div className="relative flex justify-center items-center mb-4">
                {/* Outlying glowing ring */}
                <span className="absolute inset-0 scale-[1.5] border border-theme-brownMedium/20 rounded-full animate-ping pointer-events-none opacity-20" />
                
                <div className="relative p-3 rounded-full bg-theme-brownDark/20 border border-theme-brownMedium/45 shadow-inner">
                  {/* Outer Left Heart */}
                  <motion.div
                    animate={{ rotate: [-8, 8, -8] }}
                    transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                    className="absolute -left-1.5 top-2 text-theme-brownMedium/70"
                  >
                    <Heart size={15} className="fill-theme-brownMedium/40 stroke-[1.5]" />
                  </motion.div>
                  {/* Center Main Heart */}
                  <Heart size={22} className="text-theme-brownLight fill-theme-brownLight/30 animate-pulse stroke-[1.5]" />
                  {/* Outer Right Heart */}
                  <motion.div
                    animate={{ rotate: [8, -8, 8] }}
                    transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
                    className="absolute -right-1.5 top-2 text-theme-blueLight/80"
                  >
                    <Heart size={14} className="fill-theme-blueLight/40 stroke-[1.5]" />
                  </motion.div>
                </div>
              </div>

              {/* Letter Title */}
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-theme-brownLight via-theme-brownMedium to-theme-blueLight font-medium tracking-wide">
                Your Special Day
              </h2>

              {/* Aesthetic Divider Line with Center Dot */}
              <div className="flex items-center gap-2 mt-3 w-40 justify-center">
                <span className="h-[1px] w-full bg-gradient-to-r from-transparent to-theme-brownMedium/40" />
                <Heart size={10} className="text-theme-brownMedium/80 fill-theme-brownMedium/50 animate-pulse shrink-0" />
                <span className="h-[1px] w-full bg-gradient-to-l from-transparent to-theme-brownMedium/40" />
              </div>
            </div>

            {/* Letter Content */}
            <div className="font-serif text-sm md:text-base text-theme-brownLight/90 leading-loose space-y-5 italic font-light max-w-md mx-auto relative z-10">
              <p>
                Di hari yang sangat indah ini, semesta bersorak merayakan kehadiranmu di dunia. Kamu adalah berkah yang menjelma, membawa kehangatan di setiap sudut hari yang kulewati.
              </p>
              <p>
                Terima kasih telah menjadi alasan di balik begitu banyak senyum, telah mengajarkan arti ketulusan melalui kebaikan hatimu, dan telah menjadi pelindung yang meneduhkan di kala badai datang menerpa.
              </p>
              <p>
                Semoga seiring bertambahnya usia, langkah kakimu selalu dituntun oleh kebahagiaan, mimpimu didekatkan oleh kemudahan, dan hatimu senantiasa dipenuhi kedamaian yang tak pernah pudar.
              </p>
            </div>

            {/* Signature */}
            <div className="mt-8 pt-5 border-t border-theme-brownMedium/15 text-center font-sans relative z-10">
              <span className="text-[10px] tracking-[0.25em] uppercase text-theme-blueLight/50 font-semibold block mb-1">
                Ditulis dengan penuh rasa sayang
              </span>
              <span className="font-serif italic text-base text-theme-brownMedium font-medium">
                Seseorang yang mengagumimu
              </span>
            </div>

            {/* Next Step Button inside Letter Card */}
            <div className="mt-8 flex justify-center relative z-10">
              <button
                onClick={onNext}
                className="group flex items-center gap-2 min-h-[44px] px-6 sm:px-8 py-2.5 rounded-full bg-gradient-to-r from-theme-brownMedium/20 to-theme-blueMedium/20 border border-theme-brownMedium/30 hover:border-theme-blueMedium/60 transition-all duration-300 text-theme-brownLight hover:text-white cursor-pointer shadow-md text-xs tracking-wider uppercase font-semibold"
              >
                Lanjutkan
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: 4 Aesthetic Polaroids (Stacked/Scattered vertically) */}
        <div className="hidden lg:flex flex-col gap-6 items-center col-span-1 justify-center">
          {rightFrames.map(renderPolaroid)}
        </div>

        {/* MOBILE GRID: 8 Polaroids in columns of 2 underneath letter */}
        <div className="lg:hidden grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-6 justify-center">
          {[...leftFrames, ...rightFrames].map(renderPolaroid)}
        </div>
      </motion.div>
    </section>
  );
};
