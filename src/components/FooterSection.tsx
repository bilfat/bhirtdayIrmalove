import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAudio } from '../context/AudioContext';
import { Heart } from 'lucide-react';

export const FooterSection: React.FC = () => {
  const { pauseMusic, isPlaying } = useAudio();

  useEffect(() => {
    if (isPlaying) {
      // Smoothly fade out and pause music when the closing page mounts
      pauseMusic();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
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
          Always & Forever
        </h3>

        {/* Small subtext */}
        <p className="font-sans text-xs sm:text-sm text-theme-blueLight/60 tracking-[0.15em] sm:tracking-[0.2em] uppercase font-light max-w-[260px] sm:max-w-xs leading-relaxed mt-2">
          Terima kasih telah menjadi bagian dari kebahagiaan ini.
        </p>

        {/* Separator line */}
        <div className="w-16 h-[1px] bg-theme-brownDark/30 my-4"></div>

        {/* Copyright */}
        <span className="font-sans text-[10px] text-theme-blueLight/40 tracking-wider">
          Created with love, just for you. &bull; {new Date().getFullYear()}
        </span>
      </motion.div>
    </section>
  );
};
