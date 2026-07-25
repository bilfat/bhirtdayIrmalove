import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Calendar, Lock, Unlock } from 'lucide-react';

interface HeroSectionProps {
  onNext: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// SET YOUR TARGET BIRTHDAY DATE HERE
// Format: new Date('YYYY-MM-DDTHH:MM:SS') — use local time of the recipient.
// Example: new Date('2025-08-15T00:00:00') → unlocks on 15 August 2025 at midnight.
// ─────────────────────────────────────────────────────────────────────────────
const TARGET_DATE = new Date('2026-07-29T00:00:00');

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const zeroed: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

const calcTimeLeft = (): { timeLeft: TimeLeft; isLocked: boolean } => {
  const difference = TARGET_DATE.getTime() - Date.now();

  if (difference <= 0) {
    return { timeLeft: zeroed, isLocked: false };
  }

  return {
    timeLeft: {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    },
    isLocked: true,
  };
};

export const HeroSection: React.FC<HeroSectionProps> = ({ onNext }) => {
  const [{ timeLeft, isLocked }, setCountdown] = useState(calcTimeLeft);

  // Real-time tick — updates every second and auto-unlocks when difference ≤ 0
  useEffect(() => {
    // If already unlocked on mount, don't bother starting the interval
    if (!isLocked) return;

    const timer = setInterval(() => {
      const next = calcTimeLeft();
      setCountdown(next);
      // Stop ticking once unlocked — no need to keep the interval alive
      if (!next.isLocked) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [isLocked]);

  const timeUnits = [
    { label: 'Hari', value: timeLeft.days },
    { label: 'Jam', value: timeLeft.hours },
    { label: 'Menit', value: timeLeft.minutes },
    { label: 'Detik', value: timeLeft.seconds },
  ];

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between items-center px-4 sm:px-6 py-10 sm:py-14 text-center overflow-hidden bg-transparent">
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-theme-brownDark/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-theme-blueMedium/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />

      {/* Top label */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.25em] uppercase text-theme-brownMedium font-sans"
      >
        <Calendar size={12} className="text-theme-blueMedium animate-pulse" />
        <span>A Someone Special </span>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center items-center my-6 sm:my-8 w-full max-w-2xl lg:max-w-4xl px-2">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-wide text-theme-brownLight leading-tight"
        >
          Halooo Imaaa emoyy wkwkw{' '}
          <br className="hidden sm:block" />
          <span className="font-semibold italic text-transparent bg-clip-text bg-gradient-to-r from-theme-brownLight via-theme-brownMedium to-theme-blueLight">
            {isLocked ? '' : ''}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="mt-4 sm:mt-6 text-xs sm:text-sm md:text-base tracking-[0.08em] font-light text-theme-blueLight/70 max-w-xs sm:max-w-md lg:max-w-lg font-sans uppercase leading-relaxed"
        >
          {isLocked
            ? 'mau tau gaa isinya apa diweb ini?'
            : 'Aku sudah menyiapkan sesuatu special buat kamu wlee.'}
        </motion.p>

        {/* Countdown Grid — 2×2 on mobile, 4×1 on md+ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8, type: 'spring', stiffness: 50 }}
          className="mt-8 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-xs sm:max-w-md md:max-w-2xl"
        >
          {timeUnits.map((unit) => (
            <div
              key={unit.label}
              className="relative p-4 sm:p-6 rounded-2xl bg-[#1a1614]/60 border border-theme-brownDark/20 backdrop-blur-md flex flex-col items-center justify-center shadow-lg group overflow-hidden min-h-[80px] sm:min-h-[100px]"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-theme-brownMedium/30 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-theme-blueMedium/30 to-transparent" />

              {/* Number with flip animation on each second change */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={unit.value}
                  initial={{ y: -12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 12, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-transparent bg-clip-text bg-gradient-to-b from-white to-theme-brownLight"
                >
                  {String(unit.value).padStart(2, '0')}
                </motion.span>
              </AnimatePresence>

              <span className="mt-1 sm:mt-2 text-[10px] sm:text-xs tracking-wider uppercase font-medium text-theme-blueLight/60 group-hover:text-theme-blueLight transition-colors duration-300">
                {unit.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Lock status hint — fades in after countdown is visible */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-5 sm:mt-6 flex items-center gap-1.5"
        >
          <AnimatePresence mode="wait">
            {isLocked ? (
              <motion.span
                key="locked-hint"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase font-sans text-theme-blueLight/40"
              >
                <Lock size={10} className="text-theme-brownMedium/60" />
                Tapii Belum waktunya dibuka. Nanti pas countdown selesai baru bisa dibukaa yaaa
              </motion.span>
            ) : (
              <motion.span
                key="unlocked-hint"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase font-sans text-theme-blueLight/70"
              >
                <Unlock size={10} className="text-theme-brownLight/80" />
                Udahh bisaaa dibukaaa irmaaa
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── Bottom CTA ──────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="flex flex-col items-center gap-3 pb-2"
      >
        {/* Locked button — visually dimmed, non-interactive */}
        {isLocked ? (
          <button
            disabled
            aria-disabled="true"
            className="group relative min-h-[44px] px-8 sm:px-10 py-3 rounded-full overflow-hidden border border-theme-brownDark/20 bg-[#12100e]/20 backdrop-blur-sm cursor-not-allowed opacity-40 select-none"
          >
            <span className="relative z-10 font-sans text-xs tracking-[0.2em] uppercase font-semibold text-theme-brownLight/60 flex items-center gap-2">
              <Lock size={11} />
              dikunci, ga bisaa di bukaa wkwkwk
            </span>
          </button>
        ) : (
          /* Unlocked button — fully interactive with hover animations */
          <motion.button
            onClick={onNext}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group relative min-h-[44px] px-8 sm:px-10 py-3 rounded-full overflow-hidden border border-theme-brownMedium/50 transition-all duration-300 hover:border-theme-blueMedium/80 shadow-md bg-[#12100e]/30 backdrop-blur-sm cursor-pointer"
          >
            <div className="absolute inset-0 w-0 bg-gradient-to-r from-theme-brownMedium/20 to-theme-blueMedium/20 transition-all duration-500 ease-out group-hover:w-full" />
            <span className="relative z-10 font-sans text-xs tracking-[0.2em] uppercase font-semibold text-theme-brownLight transition-colors duration-300 group-hover:text-white flex items-center gap-2">
              <Unlock size={11} className="opacity-70" />
              ayooo bukaa sekaranggg imaaa
            </span>
          </motion.button>
        )}

        {/* Bouncing chevron — only shown when unlocked */}
        <AnimatePresence>
          {!isLocked && (
            <motion.div
              key="chevron"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 8, 0] }}
              transition={{ opacity: { duration: 0.5 }, y: { repeat: Infinity, duration: 2, ease: 'easeInOut' } }}
              className="text-theme-blueLight/40 hover:text-theme-blueLight cursor-pointer p-2"
              onClick={onNext}
            >
              <ChevronDown size={18} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};
