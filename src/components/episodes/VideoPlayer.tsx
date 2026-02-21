'use client';

import { Track } from '@/types/track';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatSeasonEpisode } from '@/lib/format';

interface VideoPlayerProps {
  episode: Track;
  onClose: () => void;
}

export function VideoPlayer({ episode, onClose }: VideoPlayerProps) {
  // Extract YouTube video ID from embed URL
  const videoId = episode.videoUrl?.includes('youtube.com/embed/')
    ? episode.videoUrl.split('youtube.com/embed/')[1]?.split('?')[0]
    : null;

  return (
    <div className="bg-bg-secondary rounded-2xl border border-border overflow-hidden mb-8">
      {/* Video embed */}
      <div className="relative aspect-video bg-black">
        {videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={episode.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-text-secondary">
            Video unavailable
          </div>
        )}
      </div>

      {/* Episode info */}
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {episode.season && (
                <Badge variant="season">{formatSeasonEpisode(episode.season, episode.episode)}</Badge>
              )}
            </div>
            <h2 className="text-lg font-bold text-text-primary mb-1">{episode.title}</h2>
            <p className="text-sm text-text-secondary">
              {episode.artists.map(a => a.artist.name).join(', ')}
            </p>
            {episode.description && (
              <p className="text-sm text-text-secondary mt-3 leading-relaxed">{episode.description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close video"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
