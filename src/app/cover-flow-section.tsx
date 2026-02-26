'use client';

import { CoverFlow } from '@/components/music/CoverFlow';
import { getMockFeaturedTracks } from '@/lib/mock-data';
import { usePlayerStore } from '@/stores/playerStore';
import { useQueueStore } from '@/stores/queueStore';
import { Track } from '@/types/track';

export function CoverFlowSection() {
  const play = usePlayerStore((s) => s.play);
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const { setQueue } = useQueueStore();
  const featured = getMockFeaturedTracks();

  const handleSelect = (track: Track) => {
    // If clicking the currently playing track, toggle play/pause
    if (currentTrack?.id === track.id) {
      togglePlay();
      return;
    }
    // Play the track and set queue to all featured tracks
    if (track.audioUrl) {
      play(track);
      setQueue(featured.filter(t => t.audioUrl && t.id !== track.id));
    }
  };

  return (
    <CoverFlow
      tracks={featured}
      onSelect={handleSelect}
      currentTrackId={currentTrack?.id}
      isPlaying={isPlaying}
    />
  );
}
