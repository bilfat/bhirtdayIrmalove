import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  volume: number;
  playMusic: () => void;
  pauseMusic: () => void;
  duckMusic: (duck: boolean) => void;
  setMusicVolume: (vol: number) => void;
  fadeMusic: (target: number, durationMs: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8); // Default volume 80%
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<any>(null);

  useEffect(() => {
    // Initialize audio with a romantic, elegant piano track
    audioRef.current = new Audio('https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-493.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, []);

  const playMusic = () => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log("Audio play blocked/failed:", err));
    }
  };

  const pauseMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const setMusicVolume = (vol: number) => {
    const safeVol = Math.max(0, Math.min(1, vol));
    setVolume(safeVol);
    if (audioRef.current) {
      audioRef.current.volume = safeVol;
    }
  };

  const duckMusic = (duck: boolean) => {
    if (!audioRef.current || !isPlaying) return;
    // Duck to 0.1 volume, or restore to 0.8
    fadeMusic(duck ? 0.08 : 0.8, 800);
  };

  const fadeMusic = (target: number, durationMs: number) => {
    if (!audioRef.current) return;
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    const startVol = audioRef.current.volume;
    const diff = target - startVol;
    const stepTime = 50; // 20 frames/sec
    const totalSteps = durationMs / stepTime;
    const stepDiff = diff / totalSteps;
    let stepCount = 0;

    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current) {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        return;
      }
      stepCount++;
      const nextVol = Math.max(0, Math.min(1, startVol + stepDiff * stepCount));
      audioRef.current.volume = nextVol;
      setVolume(nextVol);

      if (stepCount >= totalSteps) {
        audioRef.current.volume = target;
        setVolume(target);
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      }
    }, stepTime);
  };

  return (
    <AudioContext.Provider value={{ isPlaying, volume, playMusic, pauseMusic, duckMusic, setMusicVolume, fadeMusic }}>
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
