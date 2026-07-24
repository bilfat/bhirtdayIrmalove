import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import lanySong from '../assets/lany.mp3';
import alexanderSong from '../assets/alexandra.mp3';

type AudioTheme = 'her' | 'us';
const MAX_VOLUME = 0.6;
const CROSSFADE_MS = 2000; // crossfade duration

interface AudioContextType {
  isPlaying: boolean;
  currentTheme: AudioTheme;
  playMusic: () => void;
  pauseMusic: () => void;
  switchTheme: (newTheme: AudioTheme) => void;
  duckMusic: (isDucking: boolean) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used within an AudioProvider');
  return ctx;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // ── Audio element refs ─────────────────────────────────────────────────────
  const lanyRef   = useRef<HTMLAudioElement | null>(null);
  const alexRef   = useRef<HTMLAudioElement | null>(null);

  // ── Per-track independent fade interval refs ────────────────────────────────
  // Using two separate refs means fading lany never cancels a concurrent alex fade.
  const lanyFadeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const alexFadeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Active theme stored as a REF (not state) ────────────────────────────────
  // Storing it in a ref prevents stale-closure bugs in switchTheme/duckMusic.
  // We also keep a state copy only so that consumers can re-render when it changes.
  const currentThemeRef = useRef<AudioTheme>('her');
  const [currentTheme, _setCurrentTheme] = useState<AudioTheme>('her');
  const setCurrentTheme = (t: AudioTheme) => {
    currentThemeRef.current = t;
    _setCurrentTheme(t);
  };

  // ── isPlaying stored as a ref too, to avoid stale closures ─────────────────
  const isPlayingRef = useRef(false);

  // ── Init audio elements ─────────────────────────────────────────────────────
  useEffect(() => {
    lanyRef.current = new Audio(lanySong);
    lanyRef.current.loop = true;
    lanyRef.current.volume = 0;

    alexRef.current = new Audio(alexanderSong);
    alexRef.current.loop = true;
    alexRef.current.volume = 0;

    return () => {
      lanyRef.current?.pause();
      alexRef.current?.pause();
    };
  }, []);

  // ── Per-track fade helper ───────────────────────────────────────────────────
  // Each audio element has its own interval ref, so two concurrent fades
  // (crossfade) never interfere with each other.
  const fadeTo = useCallback(
    (
      audio: HTMLAudioElement,
      intervalRef: React.MutableRefObject<ReturnType<typeof setInterval> | null>,
      targetVolume: number,
      durationMs: number,
      onComplete?: () => void,
    ) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      const startVolume = audio.volume;
      const diff = targetVolume - startVolume;
      const STEP_MS = 50; // ~20 fps
      const totalSteps = Math.max(1, Math.floor(durationMs / STEP_MS));
      let step = 0;

      intervalRef.current = setInterval(() => {
        step++;
        const progress = step / totalSteps;
        audio.volume = Math.min(MAX_VOLUME, Math.max(0, startVolume + diff * progress));

        if (step >= totalSteps) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          audio.volume = Math.min(MAX_VOLUME, Math.max(0, targetVolume));
          onComplete?.();
        }
      }, STEP_MS);
    },
    [],
  );

  // ── playMusic ───────────────────────────────────────────────────────────────
  // Starts playback of whichever theme is currently active.
  // Idempotent: calling it while already playing does nothing.
  const playMusic = useCallback(() => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;
    setIsPlaying(true);

    const audio = currentThemeRef.current === 'her' ? lanyRef.current : alexRef.current;
    const intervalRef = currentThemeRef.current === 'her' ? lanyFadeRef : alexFadeRef;

    if (audio) {
      audio.play().catch(e => console.error('play() failed:', e));
      fadeTo(audio, intervalRef, MAX_VOLUME, 1500);
    }
  }, [fadeTo]);

  // ── pauseMusic ──────────────────────────────────────────────────────────────
  const pauseMusic = useCallback(() => {
    if (!isPlayingRef.current) return;
    isPlayingRef.current = false;
    setIsPlaying(false);

    const audio = currentThemeRef.current === 'her' ? lanyRef.current : alexRef.current;
    const intervalRef = currentThemeRef.current === 'her' ? lanyFadeRef : alexFadeRef;

    if (audio) {
      fadeTo(audio, intervalRef, 0, 1500, () => audio.pause());
    }
  }, [fadeTo]);

  // ── switchTheme ─────────────────────────────────────────────────────────────
  // KEY CONTRACT:
  //   - Uses the REF for the theme comparison, not state — immune to stale closures.
  //   - Does NOT reset `currentTime` of the incoming audio when switching to 'us'
  //     for the first time, but DOES preserve playhead position on subsequent calls.
  //   - Only triggers a crossfade if music is actively playing.
  //   - Completely idempotent: calling switchTheme('us') while 'us' is already active
  //     is a no-op, so Step 4→5→6 navigation never re-triggers or restarts audio.
  const switchTheme = useCallback(
    (newTheme: AudioTheme) => {
      // Read from the ref — NOT from the state — to avoid stale closure.
      if (newTheme === currentThemeRef.current) return; // ← Idempotency guard

      const outgoingAudio    = currentThemeRef.current === 'her' ? lanyRef.current : alexRef.current;
      const incomingAudio    = newTheme === 'her' ? lanyRef.current : alexRef.current;
      const outgoingInterval = currentThemeRef.current === 'her' ? lanyFadeRef : alexFadeRef;
      const incomingInterval = newTheme === 'her' ? lanyFadeRef : alexFadeRef;

      // Commit the theme change immediately via the ref so any concurrent
      // calls that happen during the crossfade see the new theme.
      setCurrentTheme(newTheme);

      if (!isPlayingRef.current || !outgoingAudio || !incomingAudio) return;

      // Start playing the incoming track from its current position
      // (preserves loop position if it was already played before).
      incomingAudio.play().catch(e => console.error('switchTheme play() failed:', e));

      // Fade out the outgoing track, then pause it
      fadeTo(outgoingAudio, outgoingInterval, 0, CROSSFADE_MS, () => {
        outgoingAudio.pause();
      });

      // Simultaneously fade in the incoming track
      fadeTo(incomingAudio, incomingInterval, MAX_VOLUME, CROSSFADE_MS);
    },
    [fadeTo],
    // ↑ NOTE: `currentTheme` (state) is intentionally NOT in this dep array.
    //   We read from `currentThemeRef` instead to prevent stale closures
    //   and to prevent useCallback from creating a new reference on every theme change.
  );

  // ── duckMusic ───────────────────────────────────────────────────────────────
  const duckMusic = useCallback(
    (isDucking: boolean) => {
      if (!isPlayingRef.current) return;
      const audio = currentThemeRef.current === 'her' ? lanyRef.current : alexRef.current;
      const intervalRef = currentThemeRef.current === 'her' ? lanyFadeRef : alexFadeRef;
      if (audio) {
        fadeTo(audio, intervalRef, isDucking ? 0.1 : MAX_VOLUME, 800);
      }
    },
    [fadeTo],
  );

  return (
    <AudioContext.Provider value={{ isPlaying, currentTheme, playMusic, pauseMusic, switchTheme, duckMusic }}>
      {children}
    </AudioContext.Provider>
  );
};