import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../context/AudioContext';
import { Gift, Sparkles } from 'lucide-react';
import { triggerFlowerConfetti } from '../utils/confettiHelper';

interface GiftSectionProps {
  onNext: () => void;
}

export const GiftSection: React.FC<GiftSectionProps> = ({ onNext }) => {
  const { playMusic } = useAudio();
  const [isOpened, setIsOpened] = useState(false);

  const handleOpenGift = () => {
    if (isOpened) return;

    // 1. Change status to opened
    setIsOpened(true);

    // 2. Play theme music
    playMusic();

    // 3. Trigger the dense, fast flower petals burst
    triggerFlowerConfetti();

    // 4. Auto-advance to the letter page after 5.5s (ample time to see the lid opening and the greeting text)
    setTimeout(() => {
      onNext();
    }, 5500);
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-transparent overflow-hidden">
      {/* Background glow — responsive size */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-theme-blueMedium/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-2xl w-full text-center z-10 flex flex-col items-center">
        
        {/* ── Conditional Header vs Greeting Reveal ────────────────────────── */}
        <div className="min-h-[140px] sm:min-h-[180px] w-full flex items-center justify-center mb-4 sm:mb-6">
          <AnimatePresence mode="wait">
            {!isOpened ? (
              <motion.div
                key="header"
                initial={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center"
              >
                <span className="text-xs font-sans tracking-[0.25em] uppercase text-theme-blueLight font-semibold flex items-center gap-1.5 mb-3">
                  <Gift size={14} className="text-theme-brownMedium" />
                  Sebuah Kejutan Kecil
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-theme-brownLight font-light mb-4">
                  Ada sesuatu yang khusus dibuat untukmu
                </h2>
                <p className="font-sans text-xs sm:text-sm text-theme-blueLight/60 tracking-wider max-w-xs sm:max-w-sm">
                  Klik kado di bawah ini untuk membuka kejutan indah yang menunggumu di dalam.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="greeting"
                initial={{ opacity: 0, scale: 0.3, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: 'spring', stiffness: 100, damping: 12 }}
                className="flex flex-col items-center select-none"
              >
                {/* Gold Sparkle Icon top */}
                <motion.div
                  animate={{ scale: [1, 1.25, 1], rotate: [0, 180, 360] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="text-theme-brownLight mb-3"
                >
                  <Sparkles size={24} className="drop-shadow-[0_0_10px_rgba(255,182,193,0.85)]" />
                </motion.div>

                {/* Main Birthday Greeting — Large, elegant cursive styling with drop shadow */}
                <h3
                  className="font-serif italic font-bold text-3xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-theme-brownLight via-theme-brownMedium to-[#ffb6c1] leading-tight"
                  style={{
                    filter: 'drop-shadow(0 0 25px rgba(255, 182, 193, 0.75)) drop-shadow(0 3px 6px rgba(0,0,0,0.95))',
                    letterSpacing: '0.04em',
                  }}
                >
                  HAPPY BIRTHDAY <br /> IMAAA CANTIKKK ❤️
                </h3>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Gift Box Wrapper ────────────────────────────────────────────── */}
        <div className="relative w-48 h-48 sm:w-60 sm:h-60 flex justify-center items-center mb-8 select-none">
          {/* 3D-like Box SVG */}
          <div
            className="w-full h-full flex justify-center items-center cursor-pointer relative z-10"
            onClick={handleOpenGift}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 220 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.65)]"
            >
              {/* ── Gift Box Lid (Framer Motion Animated) ────────────────────── */}
              <motion.g
                initial={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
                animate={isOpened ? {
                  y: -95,
                  x: 60,
                  rotate: 35,
                  opacity: [1, 1, 0.9, 0],
                } : {
                  // Gentle float loop when closed
                  y: [-2, 2, -2]
                }}
                transition={isOpened ? {
                  type: 'spring',
                  stiffness: 90,
                  damping: 10,
                  duration: 1.4
                } : {
                  repeat: Infinity,
                  duration: 2,
                  ease: 'easeInOut'
                }}
              >
                {/* Lid Main Box */}
                <rect x="35" y="55" width="150" height="30" rx="4" fill="#3a6073" />
                {/* Lid Center Bow Ribbon */}
                <rect x="100" y="55" width="20" height="30" fill="#ffb6c1" />
                {/* Bow Leaves */}
                <path d="M100 55 C70 15, 60 45, 100 55" fill="#ffb6c1" stroke="#ff8ba7" strokeWidth="1.5" />
                <path d="M120 55 C150 15, 160 45, 120 55" fill="#ffb6c1" stroke="#ff8ba7" strokeWidth="1.5" />
              </motion.g>

              {/* ── Gift Box Base (Framer Motion Animated) ───────────────────── */}
              <motion.g
                animate={isOpened ? {
                  scaleY: [1, 0.92, 1],
                  scaleX: [1, 1.08, 1],
                  rotate: [0, -3, 3, 0],
                } : {}}
                transition={{ duration: 0.8, delay: 0.05 }}
              >
                {/* Main Body */}
                <rect x="42" y="83" width="136" height="100" rx="6" fill="#a3704c" />
                {/* Body Cross Ribbon */}
                <rect x="100" y="83" width="20" height="100" fill="#3a6073" />
              </motion.g>
            </svg>

            {/* Glowing aura ping ring when closed */}
            {!isOpened && (
              <span className="absolute inset-0 scale-[1.25] border border-theme-brownMedium/20 rounded-full animate-ping pointer-events-none opacity-20" />
            )}
          </div>
        </div>

        {/* CTA Button */}
        <motion.div
          animate={isOpened ? { opacity: 0.5, scale: 0.95 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <button
            onClick={handleOpenGift}
            disabled={isOpened}
            className={`min-h-[44px] px-8 sm:px-10 py-3 sm:py-4 rounded-full font-sans text-xs tracking-[0.2em] uppercase font-bold transition-all duration-500 cursor-pointer shadow-lg ${
              isOpened
                ? 'bg-theme-blueDark/40 text-theme-blueLight/40 pointer-events-none cursor-default'
                : 'bg-gradient-to-r from-theme-brownDark to-theme-blueDark text-white hover:from-theme-brownMedium hover:to-theme-blueMedium'
            }`}
          >
            {isOpened ? 'Membuka Kejutan...' : 'Buka Kado Spesial'}
          </button>
        </motion.div>
      </div>
    </section>
  );
};