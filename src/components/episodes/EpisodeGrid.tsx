'use client';

import { Track } from '@/types/track';
import { EpisodeCard } from './EpisodeCard';
import { EpisodeCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

interface EpisodeGridProps {
  episodes: Track[];
  onEpisodeClick: (episode: Track) => void;
  activeEpisodeId?: string;
  isLoading?: boolean;
}

export function EpisodeGrid({ episodes, onEpisodeClick, activeEpisodeId, isLoading = false }: EpisodeGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <EpisodeCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (episodes.length === 0) {
    return <EmptyState icon="video" title="No episodes found" description="Check back soon for new episodes." />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {episodes.map(episode => (
        <EpisodeCard
          key={episode.id}
          episode={episode}
          onClick={onEpisodeClick}
          isActive={episode.id === activeEpisodeId}
        />
      ))}
    </div>
  );
}
