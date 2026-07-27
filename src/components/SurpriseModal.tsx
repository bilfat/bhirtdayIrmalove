import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SurpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ── Falling hearts / sparkles particle layer ────────────────────── */
const PARTICLE_COUNT = 28;

interface Particle {
  id: number;
  emoji: string;
  x: number;       // vw offset
  size: number;
  delay: number;    // seconds
  duration: number; // seconds
  sway: number;     // horizontal drift in px
}

const EMOJIS = ['💖', '✨', '💕', '🩷', '💗', '🤍', '⭐', '💫', '🩵', '💖'];

function generateParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    emoji: EMOJIS[i % EMOJIS.length],
    x: Math.random() * 100,
    size: 12 + Math.random() * 16,
    delay: Math.random() * 6,
    duration: 4 + Math.random() * 5,
    sway: -30 + Math.random() * 60,
  }));
}

const FallingParticles: React.FC = () => {
  const particles = useRef(generateParticles()).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-0 select-none"
          style={{ left: `${p.x}%`, fontSize: p.size }}
          initial={{ y: '-5%', opacity: 0, x: 0 }}
          animate={{
            y: ['0%', '110%'],
            opacity: [0, 1, 1, 0],
            x: [0, p.sway, -p.sway / 2, p.sway],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  );
};

/* ── Sushi image data ───────────────────────────────────────────── */
const SUSHI_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80', alt: 'Assorted sushi platter' },
  { src: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80', alt: 'Salmon nigiri' }
  
];

/* ── Main Modal Component ───────────────────────────────────────── */
export const SurpriseModal: React.FC<SurpriseModalProps> = ({ isOpen, onClose }) => {
  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="surprise-overlay"
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* ── Backdrop ── */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* ── Modal Panel ── */}
          <motion.div
            className="relative z-10 w-full max-w-3xl mx-4 my-8 sm:my-12 rounded-3xl overflow-hidden
                       bg-gradient-to-br from-[#1a1510]/95 via-[#12100e]/98 to-[#0e1218]/95
                       border border-theme-brownDark/20 shadow-2xl shadow-theme-brownDark/10"
            initial={{ opacity: 0, scale: 0.7, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 30 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            {/* ── Falling particles layer ── */}
            <FallingParticles />

            {/* ── Close button ── */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-theme-brownDark/20 
                         hover:bg-theme-brownDark/40 text-theme-brownLight/70 hover:text-white 
                         transition-all duration-300 backdrop-blur-sm border border-white/5 
                         cursor-pointer group"
              aria-label="Tutup"
            >
              <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <div className="relative z-10 px-6 sm:px-10 py-10 sm:py-14 flex flex-col items-center text-center gap-6">

              {/* ── Top sparkle divider ── */}
              <div className="flex items-center gap-2 text-theme-brownDark/50 text-xs tracking-[0.3em] uppercase">
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-theme-brownDark/40" />
                <span>✨ Secret Gift ✨</span>
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-theme-brownDark/40" />
              </div>

              {/* ── Text 1: The Teaser ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              >
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-theme-brownLight italic leading-snug tracking-wide">
                  Rahasia... 🤫
                </h2>
                <p className="mt-3 font-sans text-sm sm:text-base text-theme-blueLight/70 leading-relaxed max-w-md mx-auto">
                  Nanti aku kasih kalau kamu udah di Bandung 💖
                </p>
              </motion.div>

              {/* ── Decorative shimmer line ── */}
              <motion.div
                className="w-24 h-px bg-gradient-to-r from-transparent via-theme-brownMedium/50 to-transparent"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              {/* ── Text 2: The Spoiler ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
              >
                <p className="font-sans text-sm sm:text-base text-theme-brownLight/90 leading-relaxed max-w-lg mx-auto">
                  Tapi aku spill satu deh... Nanti kita bakal makan{' '}
                  <span className="font-semibold text-theme-brownMedium">
                    All You Can Eat Sushi
                  </span>{' '}
                  🍣🍱✨
                </p>
              </motion.div>

              {/* ── Sushi Masonry Grid ── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="w-full mt-4"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {SUSHI_IMAGES.map((img, i) => (
                    <motion.div
                      key={i}
                      className={`relative overflow-hidden rounded-xl group cursor-pointer
                        ${i === 0 ? 'sm:row-span-2 sm:col-span-1' : ''}
                        ${i === 5 ? 'sm:col-span-2' : ''}`}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.0 + i * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.03, zIndex: 10 }}
                    >
                      <div className="overflow-hidden rounded-xl bg-theme-brownDark/10">
                        <img
                          src={img.src}
                          alt={img.alt}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110
                                     min-h-[120px] sm:min-h-[150px]"
                        />
                      </div>
                      {/* Warm overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-theme-bgDark/40 to-transparent 
                                      opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ── Bottom decorative text ── */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="font-sans text-[10px] sm:text-xs text-theme-blueLight/30 tracking-[0.2em] uppercase mt-2"
              >
                Get ready for an unforgettable feast 🍣✨
              </motion.p>

              {/* ── Tutup button ── */}
              <motion.button
                onClick={onClose}
                className="mt-2 px-8 py-3 rounded-full font-sans text-xs sm:text-sm tracking-[0.15em] uppercase 
                           bg-theme-brownDark/20 border border-theme-brownDark/30 
                           text-theme-brownLight/80 hover:text-white hover:bg-theme-brownDark/40 
                           hover:border-theme-brownMedium/50 transition-all duration-300 
                           cursor-pointer backdrop-blur-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2, duration: 0.5 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                Tutup 🤫
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
