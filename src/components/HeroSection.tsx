import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Calendar } from 'lucide-react';

interface HeroSectionProps {
  onNext: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNext }) => {
  // SET THE TARGET BIRTHDAY DATE HERE (YYYY-MM-DD THH:MM:SS)
  // Default: We set it to 3 days in the future from now so it's always ticking in the demo.
  const [targetDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date;
  });

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      setTimeLeft(newTimeLeft);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: 'Hari', value: timeLeft.days },
    { label: 'Jam', value: timeLeft.hours },
    { label: 'Menit', value: timeLeft.minutes },
    { label: 'Detik', value: timeLeft.seconds },
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-between items-center px-4 py-12 text-center overflow-hidden bg-transparent">
      {/* Abstract Animated Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-theme-brownDark/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-theme-blueMedium/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      {/* Top Bar / Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-theme-brownMedium font-sans"
      >
        <Calendar size={14} className="text-theme-blueMedium animate-pulse" />
        <span>A Special Invitation</span>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center my-8 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="font-serif text-5xl md:text-7xl font-light tracking-wide text-theme-brownLight leading-tight"
        >
          Hari Istimewanya <br/>
          <span className="font-semibold italic text-transparent bg-clip-text bg-gradient-to-r from-theme-brownLight via-theme-brownMedium to-theme-blueLight">
            Segera Tiba
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="mt-6 text-sm md:text-base tracking-[0.1em] font-light text-theme-blueLight/70 max-w-lg font-sans uppercase"
        >
          Waktu terus berjalan menuju perayaan momen yang sangat berharga. Bersiaplah untuk sebuah perjalanan kecil.
        </motion.p>

        {/* Countdown Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8, type: 'spring', stiffness: 50 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl px-4"
        >
          {timeUnits.map((unit) => (
            <div
              key={unit.label}
              className="relative p-6 rounded-2xl bg-[#1a1614]/60 border border-theme-brownDark/20 backdrop-blur-md flex flex-col items-center justify-center shadow-lg group overflow-hidden"
            >
              {/* Decorative accent lines */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-theme-brownMedium/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-theme-blueMedium/30 to-transparent"></div>
              
              <span className="font-serif text-4xl md:text-5xl font-semibold text-transparent bg-clip-text bg-gradient-to-b from-white to-theme-brownLight">
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="mt-2 text-xs tracking-wider uppercase font-medium text-theme-blueLight/60 group-hover:text-theme-blueLight transition-colors duration-300">
                {unit.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom CTA / Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="flex flex-col items-center"
      >
        <button
          onClick={onNext}
          className="group relative px-8 py-3 rounded-full overflow-hidden border border-theme-brownMedium/40 transition-all duration-300 hover:border-theme-blueMedium/80 shadow-md bg-[#12100e]/30 backdrop-blur-sm cursor-pointer"
        >
          {/* Animated background fill */}
          <div className="absolute inset-0 w-0 bg-gradient-to-r from-theme-brownMedium/20 to-theme-blueMedium/20 transition-all duration-500 ease-out group-hover:w-full"></div>
          
          <span className="relative z-10 font-sans text-xs tracking-[0.2em] uppercase font-semibold text-theme-brownLight transition-colors duration-300 group-hover:text-white flex items-center gap-2">
            Mulai Perjalanan
          </span>
        </button>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="mt-4 text-theme-blueLight/40 hover:text-theme-blueLight cursor-pointer"
          onClick={onNext}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
};
