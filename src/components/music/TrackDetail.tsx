'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play, Pause } from 'lucide-react';
import { Track } from '@/types/track';
import { Chain, PLATFORM_LABELS } from '@/types/platform';
import { usePlayerStore } from '@/stores/playerStore';
import { Badge } from '@/components/ui/Badge';
import { CopyButton } from '@/components/ui/CopyButton';
import { ExternalLink } from '@/components/ui/ExternalLink';
import { MintButton } from './MintButton';
import { Button } from '@/components/ui/Button';
import { formatDuration, formatDate, formatAddress, formatEditionCount, formatSeasonEpisode } from '@/lib/format';

interface TrackDetailProps {
  track: Track;
}

export function TrackDetail({ track }: TrackDetailProps) {
  const { currentTrack, isPlaying, play, togglePlay } = usePlayerStore();
  const isCurrentTrack = currentTrack?.id === track.id;
  const artistNames = track.artists.map(a => a.artist.name).join(', ');

  const handlePlay = () => {
    if (isCurrentTrack) {
      togglePlay();
    } else {
      play(track);
    }
  };

  return (
    <article>
      {/* Hero section */}
      <div className="relative h-[300px] sm:h-[400px] lg:h-[450px] overflow-hidden">
        <Image
          src={track.coverImage}
          alt={`${track.title} by ${artistNames} — album cover`}
          fill
          className="object-cover blur-sm scale-110"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12 max-w-[1280px] mx-auto">
          <div className="flex items-end gap-6">
            {/* Cover art */}
            <div className="relative w-32 h-32 sm:w-48 sm:h-48 rounded-xl overflow-hidden shadow-2xl shrink-0">
              <Image
                src={track.coverImage}
                alt=""
                fill
                className="object-cover"
                sizes="192px"
                priority
              />
            </div>

            {/* Info */}
            <div className="space-y-2 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="platform" platform={track.platform} />
                {track.chain !== Chain.NONE && <Badge variant="chain" chain={track.chain} />}
                {track.season && <Badge variant="season">{formatSeasonEpisode(track.season, track.episode)}</Badge>}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary leading-tight">{track.title}</h1>
              <p className="text-base sm:text-lg text-text-secondary">
                {track.artists.map((a, i) => (
                  <span key={a.artistId}>
                    {i > 0 && ', '}
                    <Link href={`/artist/${a.artist.slug}`} className="hover:text-text-primary transition-colors">
                      {a.artist.name}
                    </Link>
                  </span>
                ))}
              </p>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                {track.duration && <span>{formatDuration(track.duration)}</span>}
                {track.releaseDate && <span>· {formatDate(track.releaseDate)}</span>}
                {track.genre.length > 0 && <span>· {track.genre.join(', ')}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions and details */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Action buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          {track.audioUrl && (
            <Button variant="primary" size="lg" onClick={handlePlay}>
              {isCurrentTrack && isPlaying ? <Pause size={18} className="mr-1" /> : <Play size={18} className="mr-1 ml-0.5" />}
              {isCurrentTrack && isPlaying ? 'Pause' : 'Play'}
            </Button>
          )}
          <MintButton track={track} size="lg" />
        </div>

        {/* Description */}
        {track.description && (
          <div>
            <h2 className="text-sm font-semibold text-text-primary mb-2">About</h2>
            <p className="text-sm text-text-secondary leading-relaxed">{track.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Credits */}
          {track.credits && Object.keys(track.credits).length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-text-primary mb-3">Credits</h2>
              <dl className="space-y-2">
                {Object.entries(track.credits).map(([role, names]) => (
                  <div key={role} className="flex gap-2">
                    <dt className="text-xs text-text-secondary capitalize min-w-[80px]">{role}</dt>
                    <dd className="text-sm text-text-primary">
                      {Array.isArray(names) ? names.join(', ') : String(names)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Onchain details */}
          {track.contractAddress && (
            <div>
              <h2 className="text-sm font-semibold text-text-primary mb-3">Onchain Details</h2>
              <dl className="space-y-2">
                <div className="flex items-center gap-2">
                  <dt className="text-xs text-text-secondary min-w-[80px]">Contract</dt>
                  <dd className="text-sm text-text-primary font-mono flex items-center gap-1">
                    {formatAddress(track.contractAddress)}
                    <CopyButton text={track.contractAddress} label="Copy contract address" />
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-xs text-text-secondary min-w-[80px]">Chain</dt>
                  <dd className="text-sm text-text-primary">
                    <Badge variant="chain" chain={track.chain} />
                  </dd>
                </div>
                {track.totalMints !== undefined && (
                  <div className="flex gap-2">
                    <dt className="text-xs text-text-secondary min-w-[80px]">Minted</dt>
                    <dd className="text-sm text-text-primary">
                      {formatEditionCount(track.totalMints, track.editionSize ?? undefined)}
                    </dd>
                  </div>
                )}
                {track.mintPrice && (
                  <div className="flex gap-2">
                    <dt className="text-xs text-text-secondary min-w-[80px]">Price</dt>
                    <dd className="text-sm text-text-primary">{track.mintPrice} ETH</dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>

        {/* External links */}
        {track.externalLinks && Object.keys(track.externalLinks).length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-text-primary mb-3">Listen On</h2>
            <div className="flex flex-wrap gap-3">
              {Object.entries(track.externalLinks).map(([platform, url]) => (
                url && (
                  <ExternalLink key={platform} href={url} className="text-sm capitalize">
                    {platform === 'appleMusic' ? 'Apple Music' : platform === 'soundxyz' ? 'Sound.xyz' : platform}
                  </ExternalLink>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
