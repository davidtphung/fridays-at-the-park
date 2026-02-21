'use client';

import { useEffect } from 'react';
import { usePlayerStore } from '@/stores/playerStore';

export function useMediaSession() {
  const { currentTrack, isPlaying } = usePlayerStore();

  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentTrack) return;

    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
  }, [currentTrack, isPlaying]);
}
