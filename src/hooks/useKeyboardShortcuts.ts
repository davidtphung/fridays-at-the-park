'use client';

import { useEffect } from 'react';
import { usePlayerStore } from '@/stores/playerStore';
import { useQueueStore } from '@/stores/queueStore';

export function useKeyboardShortcuts() {
  const { togglePlay, currentTrack, setProgress, progress, duration } = usePlayerStore();
  const { toggleOpen } = useQueueStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

      if (!currentTrack) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            setProgress(Math.max(0, progress - 10 / duration));
          }
          break;
        case 'ArrowRight':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            setProgress(Math.min(1, progress + 10 / duration));
          }
          break;
        case 'm':
        case 'M':
          usePlayerStore.getState().toggleMute();
          break;
        case 'q':
        case 'Q':
          toggleOpen();
          break;
        case 'Escape':
          usePlayerStore.getState().setExpanded(false);
          useQueueStore.getState().setOpen(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, currentTrack, setProgress, progress, duration, toggleOpen]);
}
