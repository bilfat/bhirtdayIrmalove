import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../context/AudioContext';
import { Gift } from 'lucide-react';
// Import fungsi bunga pinggir
import { triggerFlowerConfetti } from '../utils/confettiHelper';

interface GiftSectionProps {
  onNext: () => void;
}

export const GiftSection: React.FC<GiftSectionProps> = ({ onNext }) => {
  const { playMusic } = useAudio();
  const [isOpened, setIsOpened] = useState(false);

  const handleOpenGift = () => {
    if (isOpened) return;
    
    // 1. Ubah status jadi terbuka
    setIsOpened(true);
    
    // 2. Mainkan musik
    playMusic();
    
    // 3. Tembakkan bunga dari pinggir!
    triggerFlowerConfetti();
    
    // 4. Otomatis pindah ke halaman surat setelah animasi selesai (3 detik)
    setTimeout(() => {
      onNext();
    }, 3000);
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center px-4 py-16 bg-transparent overflow-hidden">
      {/* Background glow — responsive size */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-theme-blueMedium/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-xl text-center z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center"
        >
          <span className="text-xs font-sans tracking-[0.25em] uppercase text-theme-blueLight font-semibold flex items-center gap-1.5 mb-3">
            <Gift size={14} className="text-theme-brownMedium" />
            Sebuah Kejutan Kecil
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-theme-brownLight font-light mb-4">
            Ada sesuatu yang khusus dibuat untukmu
          </h2>
          <p className="font-sans text-xs sm:text-sm text-theme-blueLight/60 tracking-wider max-w-xs sm:max-w-sm mb-10 sm:mb-12">
            Klik kado di bawah ini untuk membuka kejutan indah yang menunggumu di dalam.
          </p>
        </motion.div>

        {/* Dynamic SVG Gift Box — smaller on mobile */}
        <div
          className="relative w-48 h-48 sm:w-64 sm:h-64 flex justify-center items-center cursor-pointer mb-6 sm:mb-8"
          onClick={handleOpenGift}
        >
          <AnimatePresence>
            {!isOpened ? (
              <motion.div
                key="box"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                whileHover={{ y: -5 }}
                className="relative"
              >
                {/* SVG Kado — viewBox scales naturally */}
                <svg width="100%" height="100%" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]">
                  <motion.g animate={{ y: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <rect x="35" y="55" width="150" height="30" rx="4" fill="#3a6073" />
                    <rect x="100" y="55" width="20" height="30" fill="#a3704c" />
                    <path d="M100 55 C70 15, 60 45, 100 55" fill="#a3704c" stroke="#855838" strokeWidth="2" />
                    <path d="M120 55 C150 15, 160 45, 120 55" fill="#a3704c" stroke="#855838" strokeWidth="2" />
                  </motion.g>
                  <g>
                    <rect x="42" y="83" width="136" height="100" rx="6" fill="#a3704c" />
                    <rect x="100" y="83" width="20" height="100" fill="#3a6073" />
                  </g>
                </svg>
                <span className="absolute inset-0 scale-[1.3] border border-theme-brownMedium/20 rounded-full animate-ping pointer-events-none opacity-20" />
              </motion.div>
            ) : (
              <motion.div
                key="opened"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="text-theme-blueLight flex flex-col items-center justify-center font-serif italic"
              >
                <div className="text-4xl text-theme-brownMedium font-bold mb-2">Terbuka!</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA Button */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}>
          <button
            onClick={handleOpenGift}
            disabled={isOpened}
            className={`min-h-[44px] px-8 sm:px-10 py-3 sm:py-4 rounded-full font-sans text-xs tracking-[0.2em] uppercase font-bold transition-all duration-500 cursor-pointer shadow-lg ${
              isOpened
                ? 'bg-theme-blueDark/40 text-theme-blueLight/40'
                : 'bg-gradient-to-r from-theme-brownDark to-theme-blueDark text-white hover:from-theme-brownMedium hover:to-theme-blueMedium'
            }`}
          >
            {isOpened ? 'Sedang Membuka...' : 'Buka Kado Spesial'}
          </button>
        </motion.div>
      </div>
    </section>
  );
};