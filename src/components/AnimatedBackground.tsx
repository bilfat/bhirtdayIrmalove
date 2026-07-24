import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  type: 'heart' | 'bubble' | 'sparkle';
  color: string;
  size: number;
  left: number;
  delay: number;
  duration: number;
}

export const AnimatedBackground: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate a fixed set of particles on client mount to prevent SSR hydration mismatches
    const generated: Particle[] = Array.from({ length: 35 }).map((_, i) => {
      const types: Particle['type'][] = ['heart', 'bubble', 'sparkle'];
      const colors = [
        'rgba(163, 112, 76, 0.2)',  // theme-brownDark
        'rgba(200, 150, 102, 0.25)', // theme-brownMedium
        'rgba(79, 124, 172, 0.2)',   // theme-blueMedium
        'rgba(163, 194, 222, 0.25)', // theme-blueLight
      ];
      return {
        id: i,
        type: types[Math.floor(Math.random() * types.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.floor(Math.random() * 16) + 10, // 10px to 26px
        left: Math.random() * 100, // 0% to 100%
        delay: Math.random() * 12, // 0s to 12s delay
        duration: Math.random() * 15 + 12, // 12s to 27s float duration
      };
    });
    setParticles(generated);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {/* Background dark gradients */}
      <div className="absolute inset-0 bg-[#12100e]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#12100e] via-[#0c1017] to-[#12100e] opacity-90"></div>

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-[-50px] animate-float"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            color: p.color,
          }}
        >
          {p.type === 'heart' && (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}
          {p.type === 'bubble' && (
            <div
              className="w-full h-full rounded-full border"
              style={{
                borderColor: p.color,
                backgroundColor: p.color.replace('0.2', '0.05').replace('0.25', '0.05'),
              }}
            ></div>
          )}
          {p.type === 'sparkle' && (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 0l3.09 9.09L24 12l-8.91 2.91L12 24l-3.09-9.09L0 12l8.91-2.91z" />
            </svg>
          )}
        </div>
      ))}

      {/* Self-contained CSS injection for floating animation */}
      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg) scale(0.8);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-115vh) rotate(360deg) scale(1.2);
            opacity: 0;
          }
        }
        .animate-float {
          animation-name: float-up;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
      `}</style>
    </div>
  );
};
