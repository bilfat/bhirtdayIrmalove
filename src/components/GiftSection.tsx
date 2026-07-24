import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../context/AudioContext';
import { triggerFlowerConfetti } from '../utils/confettiHelper';
import { Gift } from 'lucide-react';

interface GiftSectionProps {
  onNext: () => void;
}

export const GiftSection: React.FC<GiftSectionProps> = ({ onNext }) => {
  const { playMusic } = useAudio();
  const [isOpened, setIsOpened] = useState(false);

  const handleOpenGift = () => {
    if (isOpened) return;
    setIsOpened(true);

    // 1. Play global music
    playMusic();

    // 2. Explode custom flower confetti
    triggerFlowerConfetti();

    // 3. Automatically transition to Page 3 after a 2-second delay
    setTimeout(() => {
      onNext();
    }, 2000);
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center px-4 py-16 bg-transparent overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-theme-blueMedium/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-xl text-center z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center"
        >
          <span className="text-xs font-sans tracking-[0.25em] uppercase text-theme-blueLight font-semibold flex items-center gap-1.5 mb-3">
            <Gift size={14} className="text-theme-brownMedium" />
            Sebuah Kejutan Kecil
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-theme-brownLight font-light mb-4">
            Ada sesuatu yang khusus dibuat untukmu
          </h2>
          <p className="font-sans text-xs md:text-sm text-theme-blueLight/60 tracking-wider max-w-sm mb-12">
            Klik kado di bawah ini untuk membuka kejutan indah yang menunggumu di dalam.
          </p>
        </motion.div>

        {/* Dynamic SVG Gift Box Container */}
        <div className="relative w-64 h-64 flex justify-center items-center cursor-pointer mb-8" onClick={handleOpenGift}>
          <AnimatePresence>
            {!isOpened ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                whileHover="hover"
                className="relative"
              >
                {/* SVG Gift Box */}
                <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]">
                  {/* Gift Box Lid - Animate on Hover */}
                  <motion.g
                    variants={{
                      hover: { y: -8, rotate: -2, transition: { repeat: Infinity, repeatType: 'reverse', duration: 0.6 } }
                    }}
                  >
                    {/* Lid Base (Blue) */}
                    <rect x="35" y="55" width="150" height="30" rx="4" fill="#3a6073" />
                    <rect x="35" y="55" width="150" height="30" rx="4" fill="url(#blueGrad)" />
                    {/* Lid Ribbon Horizontal (Brown) */}
                    <rect x="100" y="55" width="20" height="30" fill="#a3704c" />
                    <rect x="100" y="55" width="20" height="30" fill="url(#brownGrad)" />
                    
                    {/* Ribbon Bow Left */}
                    <path d="M100 55 C70 15, 60 45, 100 55" fill="#a3704c" stroke="#855838" strokeWidth="2"/>
                    {/* Ribbon Bow Right */}
                    <path d="M120 55 C150 15, 160 45, 120 55" fill="#a3704c" stroke="#855838" strokeWidth="2"/>
                    
                    {/* Bow Center node */}
                    <circle cx="110" cy="55" r="10" fill="#c89666" />
                  </motion.g>

                  {/* Gift Box Body (Brown) */}
                  <g>
                    <rect x="42" y="83" width="136" height="100" rx="6" fill="#a3704c" />
                    <rect x="42" y="83" width="136" height="100" rx="6" fill="url(#brownGrad)" />
                    {/* Box Ribbon Vertical (Blue) */}
                    <rect x="100" y="83" width="20" height="100" fill="#3a6073" />
                    <rect x="100" y="83" width="20" height="100" fill="url(#blueGrad)" />
                  </g>

                  {/* Definitions for Gradients */}
                  <defs>
                    <linearGradient id="blueGrad" x1="35" y1="55" x2="185" y2="183" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#4f7cac" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#0c1017" stopOpacity="0.4" />
                    </linearGradient>
                    <linearGradient id="brownGrad" x1="42" y1="83" x2="178" y2="183" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#c89666" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#12100e" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Subtle Pulse rings behind box */}
                <span className="absolute inset-0 scale-[1.3] border border-theme-brownMedium/20 rounded-full animate-ping pointer-events-none opacity-20"></span>
              </motion.div>
            ) : (
              // Exploded / Opened view
              <motion.div
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="text-theme-blueLight flex flex-col items-center justify-center font-serif italic"
              >
                <div className="text-4xl text-theme-brownMedium font-bold mb-2">Terbuka!</div>
                <div className="text-xs text-theme-blueLight/60 font-sans tracking-widest uppercase">Memulai Keajaiban...</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <button
            onClick={handleOpenGift}
            disabled={isOpened}
            className={`px-10 py-4 rounded-full font-sans text-xs tracking-[0.2em] uppercase font-bold transition-all duration-500 cursor-pointer shadow-lg relative overflow-hidden ${
              isOpened 
                ? 'bg-theme-blueDark/40 text-theme-blueLight/40 border-theme-blueDark/20' 
                : 'bg-gradient-to-r from-theme-brownDark to-theme-blueDark text-white border border-transparent hover:from-theme-brownMedium hover:to-theme-blueMedium'
            }`}
          >
            {isOpened ? 'Sedang Membuka...' : 'Buka Kado Spesial'}
          </button>
        </motion.div>
      </div>
    </section>
  );
};
