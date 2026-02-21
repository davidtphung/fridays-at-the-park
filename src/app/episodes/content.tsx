'use client';

import { useState, useMemo } from 'react';
import { SeasonSelector } from '@/components/episodes/SeasonSelector';
import { EpisodeGrid } from '@/components/episodes/EpisodeGrid';
import { VideoPlayer } from '@/components/episodes/VideoPlayer';
import { getMockEpisodes, getSeasons } from '@/lib/mock-data';
import { Track } from '@/types/track';

export function EpisodesContent() {
  const seasons = getSeasons();
  const [activeSeason, setActiveSeason] = useState('');
  const [activeEpisode, setActiveEpisode] = useState<Track | null>(null);

  const episodes = useMemo(() => {
    return getMockEpisodes(activeSeason || undefined);
  }, [activeSeason]);

  return (
    <>
      <div className="mb-6">
        <SeasonSelector
          seasons={seasons}
          activeSeason={activeSeason}
          onSeasonChange={setActiveSeason}
        />
      </div>

      {activeEpisode && (
        <VideoPlayer episode={activeEpisode} onClose={() => setActiveEpisode(null)} />
      )}

      <EpisodeGrid
        episodes={episodes}
        onEpisodeClick={setActiveEpisode}
        activeEpisodeId={activeEpisode?.id}
      />
    </>
  );
}
