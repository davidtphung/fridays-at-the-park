import { create } from 'zustand';
import { Track } from '@/types/track';

interface QueueState {
  queue: Track[];
  history: Track[];
  isOpen: boolean;

  addToQueue: (track: Track) => void;
  addNext: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  reorderQueue: (from: number, to: number) => void;
  getNext: () => Track | null;
  getPrevious: () => Track | null;
  addToHistory: (track: Track) => void;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  setQueue: (tracks: Track[]) => void;
}

export const useQueueStore = create<QueueState>((set, get) => ({
  queue: [],
  history: [],
  isOpen: false,

  addToQueue: (track) => set((state) => ({
    queue: [...state.queue, track],
  })),

  addNext: (track) => set((state) => ({
    queue: [track, ...state.queue],
  })),

  removeFromQueue: (index) => set((state) => ({
    queue: state.queue.filter((_, i) => i !== index),
  })),

  clearQueue: () => set({ queue: [] }),

  reorderQueue: (from, to) => set((state) => {
    const newQueue = [...state.queue];
    const [moved] = newQueue.splice(from, 1);
    newQueue.splice(to, 0, moved);
    return { queue: newQueue };
  }),

  getNext: () => {
    const { queue } = get();
    if (queue.length === 0) return null;
    const next = queue[0];
    set({ queue: queue.slice(1) });
    return next;
  },

  getPrevious: () => {
    const { history } = get();
    if (history.length === 0) return null;
    const prev = history[history.length - 1];
    set({ history: history.slice(0, -1) });
    return prev;
  },

  addToHistory: (track) => set((state) => ({
    history: [...state.history.slice(-50), track],
  })),

  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),

  setOpen: (open) => set({ isOpen: open }),

  setQueue: (tracks) => set({ queue: tracks }),
}));
