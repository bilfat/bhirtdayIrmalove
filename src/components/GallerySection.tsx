import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
} from 'framer-motion';
import { Heart, ChevronRight } from 'lucide-react';

// ─── Local image imports (src/assets/berdua/) ────────────────────────────────
// 3D heart gallery — 7 foreground frames
import img1  from '../assets/berdua/1.jpeg';
import img2  from '../assets/berdua/2.jpeg';
import img7  from '../assets/berdua/7.jpeg';
import img11 from '../assets/berdua/11.jpeg';
import img14 from '../assets/berdua/14.jpeg';
import img19 from '../assets/berdua/19.jpeg';
import img22 from '../assets/berdua/22.jpeg';

// Falling background — remaining 15 files
import img3  from '../assets/berdua/3.jpeg';
import img4  from '../assets/berdua/4.jpeg';
import img5  from '../assets/berdua/5.jpeg';
import img6  from '../assets/berdua/6.jpeg';
import img8  from '../assets/berdua/8.jpeg';
import img9  from '../assets/berdua/9.jpeg';
import img10 from '../assets/berdua/10.jpeg';
import img13 from '../assets/berdua/13.jpeg';
import img15 from '../assets/berdua/15.jpeg';
import img16 from '../assets/berdua/16.jpeg';
import img17 from '../assets/berdua/17.jpeg';
import img18 from '../assets/berdua/18.jpeg';
import img20 from '../assets/berdua/20.jpeg';
import img21 from '../assets/berdua/21.jpeg';

// ─────────────────────────────────────────────────────────────────────────────
// EDIT YOUR PHOTOS HERE
// x, y : position offset from the center of the heart container (in px)
// tilt  : initial subtle rotation of the polaroid frame (in deg)
// z     : depth offset for parallax feel (-ve = further back, +ve = closer)
// ─────────────────────────────────────────────────────────────────────────────
interface PhotoCard {
  id: number;
  imageUrl: string;
  caption: string;
  x: number;
  y: number;
  z: number;
  tilt: number;
}

const photos: PhotoCard[] = [
  {
    id: 1,
    imageUrl: img1,
    caption: 'Momen Pertama',
    x: -140, y: -120, z: 30, tilt: -7,
  },
  {
    id: 2,
    imageUrl: img2,
    caption: 'My Love',
    x: 140, y: -120, z: 30, tilt: 6,
  },
  {
    id: 3,
    imageUrl: img7,
    caption: 'Jalan Berdua',
    x: -200, y: 10, z: 0, tilt: -4,
  },
  {
    id: 4,
    imageUrl: img11,
    caption: 'Hari Spesial',
    x: 200, y: 10, z: 0, tilt: 5,
  },
  {
    id: 5,
    imageUrl: img14,
    caption: 'Waktu Bersama',
    x: -120, y: 150, z: -20, tilt: 8,
  },
  {
    id: 6,
    imageUrl: img19,
    caption: 'Selamanya',
    x: 120, y: 150, z: -20, tilt: -6,
  },
  {
    id: 7,
    imageUrl: img22,
    caption: 'Always & Forever',
    x: 0, y: 240, z: -40, tilt: 2,
  },
];

// ─── Heart path constants ──────────────────────────────────────────────────
// Shared SVG heart path used by both the glow outline and the sparkle sampler.
// ViewBox: "0 0 400 360", heart spans from (20,20) to (380,320).
const HEART_PATH = "M200 320 C100 250, 20 200, 20 120 C20 60, 60 20, 110 20 C145 20, 175 40, 200 65 C225 40, 255 20, 290 20 C340 20, 380 60, 380 120 C380 200, 300 250, 200 320Z";

// ─── Sparkle particle generator ────────────────────────────────────────────
// Samples positions from the parametric heart curve and adds random jitter
// so sparkles distribute naturally along the heart outline.
interface Sparkle {
  id: number;
  // position relative to SVG center (0=200, 0=180 in the 400×360 vb)
  cx: number;
  cy: number;
  r: number;
  delay: number;
  duration: number;
  color: string;
}

const generateSparkles = (count: number): Sparkle[] => {
  const sparkleColors = [
    'rgba(255,182,193,0.9)',   // rose-pink
    'rgba(255,215,0,0.85)',    // warm gold
    'rgba(200,150,102,0.9)',   // theme brown-medium
    'rgba(163,194,222,0.85)',  // theme blue-light
    'rgba(255,255,255,0.9)',   // white shimmer
  ];

  return Array.from({ length: count }, (_, i) => {
    const t = (i / count) * 2 * Math.PI;
    // Parametric heart formula, scaled & offset to the 400×360 viewBox
    const scale = 11;
    const cx = 200 + 16 * Math.pow(Math.sin(t), 3) * scale;
    const cy = 180 - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale;

    return {
      id: i,
      cx: cx + (Math.random() - 0.5) * 12, // slight jitter
      cy: cy + (Math.random() - 0.5) * 12,
      r: Math.random() * 2.5 + 1,
      delay: Math.random() * 3.5,
      duration: 1.2 + Math.random() * 2,
      color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
    };
  });
};

// ─── Falling background photos ────────────────────────────────────────────
// All remaining berdua images not used in the 3D gallery.
// To swap in your own photos, replace the imported variables above.
const allFallingPhotos: string[] = [
  img3, img4, img5, img6, img8, img9, img10,
  img13, img15, img16, img17, img18, img19, img20, img21,
];

interface FallingCard {
  id: number;
  imageUrl: string;
  // vw units for x position so it's viewport-relative
  xVw: number;
  // px size for the card width
  size: number;
  duration: number;
  delay: number;
  // initial rotation in degrees
  startRotate: number;
  // final rotation (card spins slightly as it falls)
  endRotate: number;
  opacity: number;
}

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

// Generate 15 falling cards with fully randomised properties.
// Wrapped in a factory so useMemo can call it once.
const makeFallingCards = (): FallingCard[] =>
  Array.from({ length: 15 }, (_, i) => ({
    id: i,
    imageUrl: allFallingPhotos[i % allFallingPhotos.length],
    xVw:         rand(2, 96),      // spread across 2%–96% of viewport width
    size:        rand(64, 100),    // slightly larger cards for better visibility
    duration:    rand(9, 18),      // fall duration in seconds
    delay:       rand(0, 12),      // stagger so they don't all start at once
    startRotate: rand(-18, 18),    // initial tilt
    endRotate:   rand(-22, 22),    // tilt at bottom (subtle drift)
    opacity:     rand(0.60, 0.85), // clearly visible against dark background
  }));

// The FallingPhotos layer — sits behind title and 3D gallery, but above global bg
const FallingPhotos: React.FC = () => {
  // Generate once, never re-randomize
  const cards = useMemo(makeFallingCards, []);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {cards.map((card) => (
        <motion.div
          key={card.id}
          // Gunakan top (%) alih-alih y (vh) untuk kompabilitas penuh pada browser mobile (seperti iOS Safari)
          initial={{
            top: '-15%',
            opacity: 0,
            rotate: card.startRotate,
          }}
          animate={{
            top: '112%',
            opacity: [0, card.opacity, card.opacity, 0],
            rotate: card.endRotate,
          }}
          transition={{
            duration: card.duration,
            delay: card.delay,
            repeat: Infinity,
            ease: 'linear',
            // Opacity keyframe timings: fade in fast, hold, fade out near bottom
            opacity: {
              times: [0, 0.08, 0.85, 1],
              ease: 'easeInOut',
              duration: card.duration,
              delay: card.delay,
              repeat: Infinity,
            },
          }}
          style={{
            position: 'absolute',
            left: `${card.xVw}%`,
            width: card.size,
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.55))',
          }}
        >
          {/* Mini polaroid frame — warm white card with glow border */}
          <div
            style={{
              background: '#fdfdfb',
              padding: '5px',
              paddingBottom: '16px',
              // Warm border + subtle rose-gold glow so it pops on dark bg
              boxShadow: '0 0 0 1px rgba(255,255,255,0.55), 0 6px 20px rgba(0,0,0,0.55), 0 0 12px rgba(255,182,193,0.18)',
              borderRadius: '2px',
            }}
          >
            <div
              style={{
                width: '100%',
                aspectRatio: '1 / 1',
                overflow: 'hidden',
                background: '#e5e0db',
              }}
            >
              <img
                src={card.imageUrl}
                alt=""
                loading="lazy"
                draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

interface GallerySectionProps {
  onNext: () => void;
}

// Individual sparkle — rendered as a Framer Motion animated circle
const SparkleParticle: React.FC<Sparkle> = ({ cx, cy, r, delay, duration, color }) => {
  const safeR = typeof r === 'number' ? r : 3;
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={safeR}
      fill={color}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0.6, 1, 0],
        scale: [0, 1, 1.8, 1, 0],
      }}
      style={{
        originX: `${cx}px`,
        originY: `${cy}px`,
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

export const GallerySection: React.FC<GallerySectionProps> = ({ onNext }) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  // activeId persists after click — needed for mobile where hover doesn't exist.
  // Clicking a card brings it to the very front (zIndex 200); clicking again or
  // clicking another card clears it.
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isEntered, setIsEntered] = useState(false);

  // Stable sparkle data — generated only once
  const sparkles = useMemo(() => generateSparkles(40), []);

  // Raw mouse/touch offset — normalized to [-0.5, 0.5]
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Spring-smoothed rotation values
  const springX = useSpring(rawX, { stiffness: 35, damping: 28, mass: 1 });
  const springY = useSpring(rawY, { stiffness: 35, damping: 28, mass: 1 });
  const rotateY = useTransform(springX, [-0.5, 0.5], [-30, 30]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [18, -18]);

  // Pulsing heart glow opacity
  const glowOpacity = useMotionValue(0.45);
  useEffect(() => {
    const controls = animate(glowOpacity, [0.45, 0.85, 0.45], {
      duration: 2.8,
      repeat: Infinity,
      ease: 'easeInOut',
    });
    return controls.stop;
  }, [glowOpacity]);

  // ── Mouse tracking ─────────────────────────────────────────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!sceneRef.current) return;
    const rect = sceneRef.current.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [rawX, rawY]);

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  // ── Touch tracking ──────────────────────────────────────────────────────────
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!sceneRef.current || e.touches.length === 0) return;
    const rect = sceneRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    rawX.set((touch.clientX - rect.left) / rect.width - 0.5);
    rawY.set((touch.clientY - rect.top) / rect.height - 0.5);
  }, [rawX, rawY]);

  const handleTouchEnd = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  // Staggered entrance
  useEffect(() => {
    const timer = setTimeout(() => setIsEntered(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-3 sm:px-6 py-12 sm:py-16 bg-transparent overflow-x-hidden select-none">

      {/* ── Falling photo background — z-0, pointer-events-none ──────────── */}
      <FallingPhotos />

      {/* ── Title ──────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1 }}
        className="text-center z-10 mb-6"
      >
        <span className="flex justify-center items-center gap-2 font-sans text-[10px] md:text-xs tracking-[0.25em] uppercase text-theme-blueLight/70 mb-2">
          <Heart size={12} className="fill-theme-brownMedium/60 text-theme-brownMedium/60" />
          Kenangan Kita
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-theme-brownLight font-light">
          Momen Foto Bersama Lucu
        </h2>
        <p className="font-sans text-[10px] sm:text-[11px] text-theme-blueLight/40 tracking-widest mt-2 uppercase">
          Geser untuk memutar • Sentuh foto untuk memperbesar
        </p>
      </motion.div>

      {/* ── 3D Scene Wrapper ──────────────────────────────────────────────── */}
      <motion.div
        ref={sceneRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full max-w-3xl"
        style={{
          height: 'clamp(420px, 60vh, 560px)',
          perspective: '1100px',
          perspectiveOrigin: '50% 50%',
          cursor: 'grab',
        }}
      >

        {/* ════════════════════════════════════════════════════════════════════
            GLOWING HEART SVG — sits behind the 3D scene (pointer-events-none)
            Layer 1: Radial ambient glow in the center
            Layer 2: Wide blurred heart stroke (outer glow halo)
            Layer 3: Medium blurred heart stroke (mid glow)
            Layer 4: Sharp heart stroke (crisp edge)
            Layer 5: 40 twinkling sparkle particles along the curve
        ════════════════════════════════════════════════════════════════════ */}
        <motion.svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 400 360"
          preserveAspectRatio="xMidYMid meet"
          style={{ opacity: glowOpacity }}
        >
          <defs>
            {/* ── Radial centre glow ───────────────────────────────────────── */}
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="rgba(255,182,193,0.18)" />
              <stop offset="55%"  stopColor="rgba(200,150,102,0.08)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>

            {/* ── Outer blur filter for the glow halo ─────────────────────── */}
            <filter id="outerGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="14" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
              </feMerge>
            </filter>

            {/* ── Mid blur filter ──────────────────────────────────────────── */}
            <filter id="midGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* ── Sparkle dot glow filter ──────────────────────────────────── */}
            <filter id="sparkleGlow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Layer 1 — Radial ambient glow blob */}
          <ellipse cx="200" cy="175" rx="170" ry="145" fill="url(#centerGlow)" />

          {/* Layer 2 — Wide outer glow halo (very blurred, rose-gold) */}
          <path
            d={HEART_PATH}
            fill="none"
            stroke="rgba(255,182,193,0.65)"
            strokeWidth="18"
            filter="url(#outerGlow)"
          />

          {/* Layer 3 — Medium inner glow (warm amber/rose) */}
          <path
            d={HEART_PATH}
            fill="none"
            stroke="rgba(255,200,150,0.7)"
            strokeWidth="5"
            filter="url(#midGlow)"
          />

          {/* Layer 4 — Crisp sharp stroke (rose pink) */}
          <motion.path
            d={HEART_PATH}
            fill="none"
            stroke="rgba(255,182,193,0.9)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            // Draw-on animation using dasharray
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.2, delay: 0.4, ease: 'easeInOut' }}
          />

          {/* Layer 5 — Twinkling sparkles along the heart curve */}
          <g filter="url(#sparkleGlow)">
            {sparkles.map(s => (
              <SparkleParticle key={s.id} {...s} />
            ))}
          </g>

          {/* A few larger accent stars at key positions on the heart */}
          {[
            { cx: 200, cy: 320, label: 'bottom' },
            { cx: 110, cy: 20,  label: 'leftLobe' },
            { cx: 290, cy: 20,  label: 'rightLobe' },
            { cx: 20,  cy: 120, label: 'leftSide' },
            { cx: 380, cy: 120, label: 'rightSide' },
          ].map(({ cx, cy, label }) => (
            <motion.g key={label}>
              <motion.circle
                cx={cx}
                cy={cy}
                r={4}
                fill="rgba(255,215,0,0.9)"
                filter="url(#sparkleGlow)"
                initial={{ scale: 1, opacity: 0.4 }}
                animate={{
                  opacity: [0.4, 1, 0.4],
                  scale: [0.75, 1.25, 0.75],
                  fill: ['rgba(255,215,0,0.9)', 'rgba(255,182,193,1)', 'rgba(255,215,0,0.9)'],
                }}
                style={{
                  originX: `${cx}px`,
                  originY: `${cy}px`,
                }}
                transition={{ duration: 2.5 + Math.random(), repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }}
              />
              {/* Cross sparkle arms */}
              <motion.line
                x1={cx - 8} y1={cy} x2={cx + 8} y2={cy}
                stroke="rgba(255,215,0,0.7)" strokeWidth="1"
                animate={{ opacity: [0, 0.8, 0], scaleX: [0.5, 1, 0.5] }}
                transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: Math.random() * 2 }}
              />
              <motion.line
                x1={cx} y1={cy - 8} x2={cx} y2={cy + 8}
                stroke="rgba(255,215,0,0.7)" strokeWidth="1"
                animate={{ opacity: [0, 0.8, 0], scaleY: [0.5, 1, 0.5] }}
                transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: Math.random() * 2 }}
              />
            </motion.g>
          ))}
        </motion.svg>

        {/* ── Rotating 3D Scene ────────────────────────────────────────────── */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
        >
          {photos.map((photo, index) => {
            const isHovered = hoveredId === photo.id;
            const isOtherHovered = hoveredId !== null && !isHovered;

            return (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.5, z: photo.z - 60 }}
                // Drive the scale, rotation, and 3D depth directly from active/hover/stagger states
                animate={
                  isEntered
                    ? activeId === photo.id
                      ? {
                          opacity: 1,
                          scale: 1.25,
                          rotate: 0,
                          z: photo.z + 120,
                          transition: { type: 'spring', stiffness: 200, damping: 22 }
                        }
                      : {
                          opacity: isOtherHovered || (activeId !== null && activeId !== photo.id) ? 0.45 : 1,
                          scale: 1,
                          rotate: photo.tilt,
                          z: photo.z,
                          transition: { type: 'spring', stiffness: 120, damping: 20 }
                        }
                    : { opacity: 0, scale: 0.5, z: photo.z - 60 }
                }
                whileHover={activeId !== photo.id ? {
                  scale: 1.18,
                  rotate: 0,
                  z: photo.z + 90,
                  transition: { type: 'spring', stiffness: 250, damping: 20 },
                } : {}}
                onHoverStart={() => setHoveredId(photo.id)}
                onHoverEnd={() => setHoveredId(null)}
                // onTap filters out swiping gestures, ensuring tap only fires on release without drag displacement
                onTap={() => setActiveId(prev => prev === photo.id ? null : photo.id)}
                className="absolute cursor-pointer"
                style={{
                  x: photo.x,
                  y: photo.y,
                  // Priority: activeId (click) > hoveredId (mouse) > default stack
                  zIndex: activeId === photo.id ? 200 : isHovered ? 100 : isOtherHovered ? 1 : 10 + index,
                  transformStyle: 'preserve-3d',
                  transition: 'opacity 0.3s ease',
                }}
              >
                {/* ── Polaroid Frame ──────────────────────────────────────── */}
                <div
                  className="relative bg-white rounded-sm"
                  style={{
                    padding: '10px',
                    paddingBottom: '14px',
                    width: 'clamp(112px, 14vw, 152px)',
                    // Warmer, richer shadow with a faint rose-gold ambient glow on hover or selection
                    boxShadow: (isHovered || activeId === photo.id)
                      ? '0 0 0 1.5px rgba(255,182,193,0.5), 0 24px 64px rgba(0,0,0,0.6), 0 0 40px rgba(255,182,193,0.22), 0 0 20px rgba(200,150,102,0.2)'
                      : '0 6px 18px rgba(0,0,0,0.5), 0 2px 6px rgba(163,112,76,0.2)',
                    transition: 'box-shadow 0.35s ease',
                  }}
                >
                  {/* Photo */}
                  <div
                    className="overflow-hidden bg-gray-200"
                    style={{ aspectRatio: '1 / 1', width: '100%' }}
                  >
                    <motion.img
                      src={photo.imageUrl}
                      alt={photo.caption}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      animate={{ scale: isHovered ? 1.07 : 1 }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>

                  {/* Rose-gold inner glow on hover or active */}
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 pointer-events-none rounded-sm"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(255,182,193,0.14) 0%, rgba(200,150,102,0.1) 100%)',
                      }}
                    />
                  )}
                </div>

                {/* Heart pin dot */}
                <div
                  className="absolute left-1/2 -top-2 -translate-x-1/2 w-3 h-3 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, #ffb6c1, #a3704c)',
                    boxShadow: '0 0 6px rgba(255,182,193,0.7), 0 2px 6px rgba(0,0,0,0.4)',
                  }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* ── Navigation Button ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.7 }}
        className="mt-8 sm:mt-10 z-10"
      >
        <button
          onClick={onNext}
          className="group flex items-center gap-2.5 min-h-[44px] px-7 sm:px-8 py-3 rounded-full bg-gradient-to-r from-theme-brownMedium/20 to-theme-blueMedium/20 border border-theme-brownMedium/30 hover:border-theme-blueMedium/60 transition-all duration-300 text-theme-brownLight hover:text-white cursor-pointer shadow-md text-xs tracking-wider uppercase font-semibold"
        >
          Lanjutkan Kisah Kita
          <ChevronRight
            size={14}
            className="group-hover:translate-x-1 transition-transform duration-300"
          />
        </button>
      </motion.div>
    </section>
  );
};
