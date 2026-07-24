import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Heart, Camera, ChevronRight } from 'lucide-react';

interface LetterSectionProps {
  onNext: () => void;
}

interface PolaroidFrame {
  id: number;
  label: string;
  rotation: string; // Tailwind class for rotate offset
  iconType: 'heart' | 'camera' | 'star';
}

export const LetterSection: React.FC<LetterSectionProps> = ({ onNext }) => {
  const leftFrames: PolaroidFrame[] = [
    { id: 1, label: 'Tawa Pertama', rotation: '-rotate-6 hover:rotate-0 translate-x-2', iconType: 'camera' },
    { id: 2, label: 'Momen Teduh', rotation: 'rotate-3 hover:rotate-0 -translate-x-1', iconType: 'heart' },
    { id: 3, label: 'Senja Bersama', rotation: '-rotate-3 hover:rotate-0 translate-x-1', iconType: 'camera' },
    { id: 4, label: 'Langkah Awal', rotation: 'rotate-6 hover:rotate-0 -translate-x-2', iconType: 'star' },
  ];

  const rightFrames: PolaroidFrame[] = [
    { id: 5, label: 'Tatapan Hangat', rotation: 'rotate-6 hover:rotate-0 -translate-x-2', iconType: 'heart' },
    { id: 6, label: 'Cerita Sore', rotation: '-rotate-3 hover:rotate-0 translate-x-1', iconType: 'camera' },
    { id: 7, label: 'Canda Tawa', rotation: 'rotate-3 hover:rotate-0 -translate-x-1', iconType: 'star' },
    { id: 8, label: 'Harapan Kita', rotation: '-rotate-6 hover:rotate-0 translate-x-2', iconType: 'heart' },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
      className={`polaroid-card flex flex-col bg-[#fdfdfb] p-3 pb-4 border border-gray-200/40 rounded-sm shadow-md transition-all duration-300 w-32 h-40 md:w-36 md:h-44 ${frame.rotation} select-none mx-auto`}
    >
      {/* Empty frame area with sketch icon */}
      <div className="flex-1 border border-dashed border-theme-brownMedium/30 rounded-sm bg-theme-brownLight/5 flex items-center justify-center text-theme-brownDark/40">
        {frame.iconType === 'camera' && <Camera size={24} className="stroke-[1.5] animate-pulse" />}
        {frame.iconType === 'heart' && <Heart size={24} className="stroke-[1.5] fill-theme-brownMedium/10 animate-pulse" />}
        {frame.iconType === 'star' && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 animate-pulse">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        )}
      </div>
      {/* Frame label */}
      <div className="mt-3 text-center">
        <span className="font-serif text-[11px] md:text-xs text-gray-700 italic block font-medium">
          {frame.label}
        </span>
      </div>
    </motion.div>
  );

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center px-4 py-16 bg-transparent overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-theme-brownDark/5 rounded-full blur-[130px] pointer-events-none"></div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-4 items-center z-10"
      >
        {/* LEFT COLUMN: 4 Aesthetic Polaroids (Stacked/Scattered vertically) */}
        <div className="hidden lg:flex flex-col gap-6 items-center col-span-1 justify-center">
          {leftFrames.map(renderPolaroid)}
        </div>

        {/* CENTER COLUMN: The Long Poetic Letter */}
        <div className="col-span-1 lg:col-span-2 flex flex-col items-center justify-center px-2 md:px-4">
          <motion.div
            variants={itemVariants}
            className="w-full bg-[#1e1a18]/65 border border-theme-brownDark/25 rounded-3xl p-6 md:p-10 backdrop-blur-md shadow-2xl text-center relative"
          >
            {/* Heart Icon header */}
            <div className="flex justify-center mb-6">
              <div className="relative p-2.5 rounded-full bg-theme-brownDark/10 border border-theme-brownDark/20">
                <Heart size={18} className="text-theme-brownMedium fill-theme-brownMedium/30 animate-pulse" />
              </div>
            </div>

            {/* Letter Title */}
            <h2 className="font-serif text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-theme-brownLight via-theme-brownMedium to-theme-blueLight font-medium tracking-wide mb-6">
              Your Special Day
            </h2>

            {/* Letter Content */}
            <div className="font-serif text-sm md:text-base text-theme-brownLight/90 leading-loose space-y-5 italic font-light max-w-md mx-auto">
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
            <div className="mt-8 pt-5 border-t border-theme-brownDark/10 text-center font-sans">
              <span className="text-[10px] tracking-[0.25em] uppercase text-theme-blueLight/50 font-semibold block mb-1">
                Ditulis dengan penuh rasa sayang
              </span>
              <span className="font-serif italic text-base text-theme-brownMedium font-medium">
                Seseorang yang mengagumimu
              </span>
            </div>

            {/* Next Step Button inside Letter Card */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={onNext}
                className="group flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-theme-brownMedium/20 to-theme-blueMedium/20 border border-theme-brownMedium/30 hover:border-theme-blueMedium/60 transition-all duration-300 text-theme-brownLight hover:text-white cursor-pointer shadow-md text-xs tracking-wider uppercase font-semibold"
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
