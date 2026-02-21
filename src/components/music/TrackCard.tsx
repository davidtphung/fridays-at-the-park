'use client';

import { useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import { Track, TrackCardVariant } from '@/types/track';
import { Platform, Chain, MediaType, ONCHAIN_PLATFORMS } from '@/types/platform';
import { usePlayerStore } from '@/stores/playerStore';
import { useQueueStore } from '@/stores/queueStore';
import { OnchainBadge } from './OnchainBadge';
import { Badge } from '@/components/ui/Badge';
import { formatDuration, formatMintPrice, formatEditionCount, formatSeasonEpisode } from '@/lib/format';

interface TrackCardProps {
  track: Track;
  variant?: TrackCardVariant;
  showPlatform?: boolean;
  priority?: boolean;
}

export function TrackCard({ track, variant, showPlatform = true, priority = false }: TrackCardProps) {
  const { currentTrack, isPlaying, play, togglePlay } = usePlayerStore();
  const { addToQueue } = useQueueStore();

  const isCurrentTrack = currentTrack?.id === track.id;
  const isVideo = track.mediaType === MediaType.VIDEO;
  const artistNames = track.artists.map(a => a.artist.name).join(', ');

  // Determine variant from platform if not provided
  const cardVariant = variant || (
    isVideo ? 'episode' :
    track.platform === Platform.BANDCAMP ? 'bandcamp' :
    ONCHAIN_PLATFORMS.includes(track.platform as typeof ONCHAIN_PLATFORMS[number]) ? 'onchain' : 'onchain'
  );

  const handlePlay = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCurrentTrack) {
      togglePlay();
    } else {
      play(track);
    }
  }, [isCurrentTrack, togglePlay, play, track]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link
        href={isVideo ? `/episodes` : `/track/${track.id}`}
        className="block focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 rounded-card"
      >
        {/* Cover art */}
        <div className={`relative ${isVideo ? 'aspect-video' : 'aspect-square'} rounded-card overflow-hidden bg-bg-tertiary mb-3`}>
          <Image
            src={track.coverImageSmall || track.coverImage}
            alt={`${track.title} by ${artistNames} — ${isVideo ? 'video thumbnail' : 'album cover'}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 424px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
            priority={priority}
          />

          {/* Hover overlay with play button */}
          {!isVideo && track.audioUrl && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <button
                onClick={handlePlay}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-3 rounded-full bg-accent hover:bg-accent-hover text-white shadow-lg min-w-[48px] min-h-[48px] flex items-center justify-center"
                aria-label={isCurrentTrack && isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
              >
                {isCurrentTrack && isPlaying ? (
                  <Pause size={20} fill="white" />
                ) : (
                  <Play size={20} fill="white" className="ml-0.5" />
                )}
              </button>
            </div>
          )}

          {/* Currently playing indicator */}
          {isCurrentTrack && isPlaying && (
            <div className="absolute bottom-2 left-2 flex items-end gap-[2px] h-4 p-1 rounded bg-black/60">
              <div className="equalizer-bar" />
              <div className="equalizer-bar" />
              <div className="equalizer-bar" />
            </div>
          )}

          {/* Platform badge */}
          {showPlatform && cardVariant === 'onchain' && (
            <div className="absolute top-2 right-2">
              <OnchainBadge platform={track.platform} chain={track.chain} />
            </div>
          )}

          {/* Duration badge for videos */}
          {isVideo && track.duration && (
            <div className="absolute bottom-2 right-2">
              <Badge className="bg-black/70 text-white">{formatDuration(track.duration)}</Badge>
            </div>
          )}

          {/* Season/Episode badge */}
          {track.season && track.episode && (
            <div className="absolute top-2 left-2">
              <Badge variant="season">{formatSeasonEpisode(track.season, track.episode)}</Badge>
            </div>
          )}
        </div>

        {/* Track info */}
        <div className="space-y-1 px-0.5">
          <h3 className="text-sm font-semibold text-text-primary line-clamp-2 leading-snug">
            {track.title}
          </h3>
          <p className="text-xs text-text-secondary line-clamp-1">
            {track.artists.map((a, i) => (
              <span key={a.artistId}>
                {i > 0 && ', '}
                {a.artist.name}
              </span>
            ))}
          </p>

          {/* Variant-specific metadata */}
          {cardVariant === 'onchain' && track.mintPrice && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-text-primary font-medium">{formatMintPrice(track.mintPrice)}</span>
              {track.totalMints !== undefined && (
                <span className="text-text-secondary">{formatEditionCount(track.totalMints, track.editionSize ?? undefined)}</span>
              )}
            </div>
          )}

          {cardVariant === 'bandcamp' && (
            <div className="text-xs text-text-secondary">
              {track.duration && formatDuration(track.duration)}
            </div>
          )}

          {cardVariant === 'episode' && (
            <div className="text-xs text-text-secondary">
              {formatSeasonEpisode(track.season, track.episode)}
              {track.duration && ` · ${formatDuration(track.duration)}`}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
