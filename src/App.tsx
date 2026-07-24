import React, { useState } from 'react';
import { AudioProvider, useAudio } from './context/AudioContext';
import { AnimatedBackground } from './components/AnimatedBackground';
import { HeroSection } from './components/HeroSection';
import { GiftSection } from './components/GiftSection';
import { LetterSection } from './components/LetterSection';
import { VideoSection } from './components/VideoSection';
import { FooterSection } from './components/FooterSection';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

// Floating Audio Controls for a premium experience
const FloatingAudioControls: React.FC = () => {
  const { isPlaying, playMusic, pauseMusic } = useAudio();

  const togglePlay = () => {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.6 }}
      className="fixed top-6 right-6 z-50"
    >
      <button
        onClick={togglePlay}
        className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#1e1a18]/70 border border-theme-brownDark/30 backdrop-blur-md text-theme-brownLight hover:text-white transition-all duration-300 hover:border-theme-blueMedium/50 shadow-lg cursor-pointer group"
      >
        {/* Equalizer animation when playing */}
        <AnimatePresence>
          {isPlaying ? (
            <motion.div 
              key="equalizer"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex items-center h-3 overflow-hidden gap-[2px] pr-1"
            >
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <span className="text-[10px] tracking-[0.15em] uppercase font-sans font-semibold">
          {isPlaying ? 'Music On' : 'Music Off'}
        </span>

        <div className="p-1 rounded-full bg-[#12100e]/50 text-theme-brownMedium group-hover:text-theme-blueMedium transition-colors duration-300">
          {isPlaying ? <Volume2 size={14} /> : <VolumeX size={14} />}
        </div>
      </button>
    </motion.div>
  );
};

const MainContent: React.FC = () => {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  // Cute, bouncy spring transitions for the pages
  const pageVariants: Variants = {
    initial: {
      opacity: 0,
      y: 60,
      scale: 0.95,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 18,
        mass: 0.8,
      },
    },
    exit: {
      opacity: 0,
      y: -60,
      scale: 0.95,
      transition: {
        ease: 'easeIn',
        duration: 0.25,
      },
    },
  };

  return (
    <div className="relative min-h-screen z-10 w-full overflow-hidden">
      {/* 1. Floating Global Controls */}
      <FloatingAudioControls />

      {/* 2. Page Step Conditional Router */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full min-h-screen flex items-center justify-center"
          >
            <HeroSection onNext={handleNext} />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full min-h-screen flex items-center justify-center"
          >
            <GiftSection onNext={handleNext} />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full min-h-screen flex items-center justify-center"
          >
            <LetterSection onNext={handleNext} />
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full min-h-screen flex items-center justify-center"
          >
            <VideoSection onNext={handleNext} />
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="step5"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full min-h-screen flex items-center justify-center"
          >
            <FooterSection />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function App() {
  return (
    <AudioProvider>
      {/* Persisting global background floats */}
      <AnimatedBackground />
      <MainContent />
    </AudioProvider>
  );
}

export default App;
