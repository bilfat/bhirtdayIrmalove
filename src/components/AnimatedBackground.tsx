import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export const AnimatedBackground: React.FC = () => {
  // Membuat konfigurasi elemen melayang secara acak tapi tetap estetik
  const floatingElements = useMemo(() => {
    const elements = [];
    const texts = ['I love you', 'Forever', 'My everything', '❤️', '✨'];
    const colors = ['text-theme-brownMedium', 'text-theme-blueMedium', 'text-white/30', 'text-theme-brownLight/40'];
    
    for (let i = 0; i < 20; i++) {
      const isText = i % 3 === 0; // Sebagian teks, sebagian ikon
      elements.push({
        id: i,
        content: isText ? texts[Math.floor(Math.random() * texts.length)] : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 md:w-6 md:h-6">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        ),
        left: `${Math.random() * 100}%`,
        animationDuration: Math.random() * 15 + 15, // Melayang pelan antara 15-30 detik
        delay: Math.random() * -20, // Mulai dari waktu yang beda-beda
        scale: Math.random() * 0.5 + 0.5,
        colorClass: colors[Math.random() * colors.length | 0],
      });
    }
    return elements;
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {floatingElements.map((el) => (
        <motion.div
          key={el.id}
          className={`absolute bottom-[-10%] ${el.colorClass} font-serif italic text-sm md:text-base opacity-40`}
          style={{ left: el.left }}
          initial={{ y: 0, opacity: 0, scale: el.scale }}
          animate={{ 
            y: ['0vh', '-110vh'], // Bergerak ke atas sampai melewati layar
            opacity: [0, 0.4, 0.8, 0.4, 0], // Memudar masuk dan keluar
            rotate: [0, 10, -10, 0] // Bergoyang sedikit
          }}
          transition={{
            duration: el.animationDuration,
            ease: "linear",
            repeat: Infinity,
            delay: el.delay,
          }}
        >
          {el.content}
        </motion.div>
      ))}
    </div>
  );
};