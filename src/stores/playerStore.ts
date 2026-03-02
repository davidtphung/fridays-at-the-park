import { create } from 'zustand';
import { Track } from '@/types/track';

export type RepeatMode = 'off' | 'one' | 'all';

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isExpanded: boolean;
  repeatMode: RepeatMode;
  isShuffled: boolean;
  isLoading: boolean;

  // Actions
  play: (track: Track) => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleExpanded: () => void;
  setExpanded: (expanded: boolean) => void;
  cycleRepeat: () => void;
  toggleShuffle: () => void;
  setIsLoading: (loading: boolean) => void;
  stop: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  progress: 0,
  duration: 0,
  volume: 1.0,
  isMuted: false,
  isExpanded: false,
  repeatMode: 'off',
  isShuffled: false,
  isLoading: false,

  play: (track) => set({
    currentTrack: track,
    isPlaying: true,
    progress: 0,
    isLoading: true,
  }),

  pause: () => set({ isPlaying: false }),

  resume: () => set({ isPlaying: true }),

  togglePlay: () => {
    const { isPlaying, currentTrack } = get();
    if (!currentTrack) return;
    set({ isPlaying: !isPlaying });
  },

  setProgress: (progress) => set({ progress }),

  setDuration: (duration) => set({ duration }),

  setVolume: (volume) => set({ volume, isMuted: volume === 0 }),

  toggleMute: () => {
    const { isMuted } = get();
    set({ isMuted: !isMuted });
  },

  toggleExpanded: () => {
    const { isExpanded } = get();
    set({ isExpanded: !isExpanded });
  },

  setExpanded: (expanded) => set({ isExpanded: expanded }),

  cycleRepeat: () => {
    const { repeatMode } = get();
    const modes: RepeatMode[] = ['off', 'one', 'all'];
    const idx = modes.indexOf(repeatMode);
    set({ repeatMode: modes[(idx + 1) % modes.length] });
  },

  toggleShuffle: () => {
    const { isShuffled } = get();
    set({ isShuffled: !isShuffled });
  },

  setIsLoading: (loading) => set({ isLoading: loading }),

  stop: () => set({
    currentTrack: null,
    isPlaying: false,
    progress: 0,
    duration: 0,
    isExpanded: false,
    isLoading: false,
  }),
}));
