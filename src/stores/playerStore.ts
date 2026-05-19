import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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
  /** Position (0..1) to seek to once the audio is ready — set when the
   *  store is rehydrated from localStorage so playback resumes mid-track. */
  pendingSeek: number | null;

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
  clearPendingSeek: () => void;
  stop: () => void;
}

/**
 * Persisted across navigation, reloads, and new tabs.
 *
 * The component tree owning the audio element (GlobalPlayer) lives in the
 * root layout, so the Howl instance survives every soft navigation already.
 * The `persist` middleware extends that across hard reloads + new tabs by
 * snapshotting the track + position + preferences into localStorage. On
 * rehydrate we force `isPlaying = false` (browser autoplay policies require
 * a user gesture) and stash the last position into `pendingSeek` so the
 * audio element can resume mid-track when the user hits play.
 */
export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
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
      pendingSeek: null,

      play: (track) =>
        set({
          currentTrack: track,
          isPlaying: true,
          progress: 0,
          isLoading: true,
          pendingSeek: null,
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
        const { isMuted, volume } = get();
        if (isMuted && volume === 0) {
          set({ isMuted: false, volume: 0.7 });
        } else {
          set({ isMuted: !isMuted });
        }
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

      clearPendingSeek: () => set({ pendingSeek: null }),

      stop: () =>
        set({
          currentTrack: null,
          isPlaying: false,
          progress: 0,
          duration: 0,
          isExpanded: false,
          isLoading: false,
          pendingSeek: null,
        }),
    }),
    {
      name: 'fatp-player',
      // Use a guarded storage factory so the store is a no-op during SSR.
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? window.localStorage : (undefined as unknown as Storage),
      ),
      // Persist only what survives a hard reload. We deliberately drop
      // `progress` (it ticks ~60 fps from rAF — persisting every frame would
      // hammer localStorage), `duration` (re-derived on load), `isPlaying`
      // (autoplay needs a user gesture), `isLoading`, `isExpanded`, and
      // `pendingSeek` (managed at runtime). Soft navigation preserves the
      // live audio + position via the GlobalPlayer ref in the root layout,
      // so within-app navigation is already seamless; this just covers
      // hard reloads + new tabs.
      partialize: (state) => ({
        currentTrack: state.currentTrack,
        volume: state.volume,
        isMuted: state.isMuted,
        repeatMode: state.repeatMode,
        isShuffled: state.isShuffled,
      }),
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.isPlaying = false;
        state.isLoading = false;
        state.isExpanded = false;
        state.progress = 0;
        state.duration = 0;
        state.pendingSeek = null;
      },
    },
  ),
);
