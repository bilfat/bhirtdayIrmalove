import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import lanySong from '../assets/lany.mp3';
import alexanderSong from '../assets/alexandra.mp3';

interface AudioContextType {
  isPlaying: boolean;
  playMusic: () => void;
  pauseMusic: () => void;
  switchTheme: (theme: 'her' | 'us') => void;
  fadeMusic: (targetVolume: number, duration: number) => void;
  duckMusic: (isDucking: boolean) => void; // <-- Ini yang tadi hilang
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'her' | 'us'>('her');
  
  const lanyAudioRef = useRef<HTMLAudioElement | null>(null);
  const alexanderAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    lanyAudioRef.current = new Audio(lanySong);
    lanyAudioRef.current.loop = true;
    lanyAudioRef.current.volume = 0.5;

    alexanderAudioRef.current = new Audio(alexanderSong);
    alexanderAudioRef.current.loop = true;
    alexanderAudioRef.current.volume = 0;

    return () => {
      lanyAudioRef.current?.pause();
      alexanderAudioRef.current?.pause();
    };
  }, []);

  const playMusic = () => {
    setIsPlaying(true);
    if (currentTheme === 'her') {
      lanyAudioRef.current?.play().catch(() => {});
    } else {
      alexanderAudioRef.current?.play().catch(() => {});
    }
  };

  const pauseMusic = () => {
    setIsPlaying(false);
    lanyAudioRef.current?.pause();
    alexanderAudioRef.current?.pause();
  };

  const fadeMusic = (targetVolume: number, duration: number) => {
    const activeAudio = currentTheme === 'her' ? lanyAudioRef.current : alexanderAudioRef.current;
    if (!activeAudio) return;

    const startVolume = activeAudio.volume;
    const volumeChange = targetVolume - startVolume;
    const startTime = performance.now();

    const animateFade = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      activeAudio.volume = startVolume + volumeChange * progress;

      if (progress < 1) {
        requestAnimationFrame(animateFade);
      }
    };

    requestAnimationFrame(animateFade);
  };

  // Fungsi untuk mengecilkan volume saat video diputar, dan membesarkannya lagi
  const duckMusic = (isDucking: boolean) => {
    // Jika ducking (video play), turunkan volume ke 0.1. Jika pause, naikkan lagi ke 0.5
    fadeMusic(isDucking ? 0.1 : 0.5, 1000); 
  };

  const switchTheme = (newTheme: 'her' | 'us') => {
    if (newTheme === currentTheme) return;

    const outgoingAudio = currentTheme === 'her' ? lanyAudioRef.current : alexanderAudioRef.current;
    const incomingAudio = newTheme === 'her' ? lanyAudioRef.current : alexanderAudioRef.current;

    setCurrentTheme(newTheme);

    if (isPlaying) {
      incomingAudio?.play().catch(() => {});

      const duration = 1500; 
      const startTime = performance.now();

      const animateCrossfade = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        if (outgoingAudio) {
          outgoingAudio.volume = Math.max(0.5 * (1 - progress), 0);
        }
        if (incomingAudio) {
          incomingAudio.volume = Math.min(0.5 * progress, 0.5);
        }

        if (progress < 1) {
          requestAnimationFrame(animateCrossfade);
        } else {
          outgoingAudio?.pause();
        }
      };

      requestAnimationFrame(animateCrossfade);
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, playMusic, pauseMusic, switchTheme, fadeMusic, duckMusic }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};