'use client';

import Image from 'next/image';
import { Play } from 'lucide-react';
import { Track } from '@/types/track';
import { Badge } from '@/components/ui/Badge';
import { formatDuration, formatSeasonEpisode } from '@/lib/format';

interface EpisodeCardProps {
  episode: Track;
  onClick: (episode: Track) => void;
  isActive?: boolean;
}

export function EpisodeCard({ episode, onClick, isActive = false }: EpisodeCardProps) {
  const artistNames = episode.artists.map(a => a.artist.name).join(', ');

  return (
    <button
      onClick={() => onClick(episode)}
      className={`group text-left w-full rounded-card focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
        isActive ? 'ring-2 ring-accent' : ''
      }`}
    >
      <div className="relative aspect-video rounded-card overflow-hidden bg-bg-tertiary mb-3">
        <Image
          src={episode.coverImage}
          alt={`${episode.title} — video thumbnail`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
        />
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity p-4 rounded-full bg-accent/90 text-white">
            <Play size={24} fill="white" className="ml-0.5" />
          </div>
        </div>

        {/* Duration */}
        {episode.duration && (
          <div className="absolute bottom-2 right-2">
            <Badge className="bg-black/70 text-white">{formatDuration(episode.duration)}</Badge>
          </div>
        )}

        {/* Season/Episode badge */}
        {episode.season && (
          <div className="absolute top-2 left-2">
            <Badge variant="season">{formatSeasonEpisode(episode.season, episode.episode)}</Badge>
          </div>
        )}
      </div>

      <h3 className="text-sm font-semibold text-text-primary line-clamp-2 leading-snug mb-1">
        {episode.title}
      </h3>
      <p className="text-xs text-text-secondary line-clamp-1">{artistNames}</p>
    </button>
  );
}
