'use client';

import { Track, TrackCardVariant } from '@/types/track';
import { TrackCard } from './TrackCard';
import { TrackCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

interface TrackGridProps {
  tracks: Track[];
  variant?: TrackCardVariant;
  isLoading?: boolean;
  emptyMessage?: string;
  showPlatform?: boolean;
  columns?: 'default' | 'video';
}

export function TrackGrid({
  tracks,
  variant,
  isLoading = false,
  emptyMessage = 'No tracks found',
  showPlatform = true,
  columns = 'default',
}: TrackGridProps) {
  if (isLoading) {
    return (
      <div className={`grid gap-4 sm:gap-6 ${
        columns === 'video'
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          : 'grid-cols-1 min-[425px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
      }`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <TrackCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (tracks.length === 0) {
    return <EmptyState icon="music" title={emptyMessage} />;
  }

  return (
    <div className={`grid gap-4 sm:gap-6 ${
      columns === 'video'
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        : 'grid-cols-1 min-[425px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
    }`}>
      {tracks.map((track, i) => (
        <TrackCard
          key={track.id}
          track={track}
          variant={variant}
          showPlatform={showPlatform}
          priority={i < 4}
        />
      ))}
    </div>
  );
}
