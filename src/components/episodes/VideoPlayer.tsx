'use client';

import { Track } from '@/types/track';
import { X, ExternalLink, Play } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatSeasonEpisode } from '@/lib/format';

interface VideoPlayerProps {
  episode: Track;
  onClose: () => void;
}

function getVideoEmbed(url?: string): { type: 'youtube' | 'ipfs' | 'zora' | 'none'; id?: string; url?: string } {
  if (!url) return { type: 'none' };

  // YouTube embed URLs
  if (url.includes('youtube.com/embed/')) {
    const id = url.split('youtube.com/embed/')[1]?.split('?')[0];
    return id ? { type: 'youtube', id } : { type: 'none' };
  }

  // IPFS gateway URLs (direct video files)
  if (url.includes('gateway.pinata.cloud/ipfs/') || url.includes('ipfs.io/ipfs/') || url.includes('nftstorage.link')) {
    return { type: 'ipfs', url };
  }

  // Zora / Highlight links (external)
  if (url.includes('zora.co') || url.includes('highlight.xyz')) {
    return { type: 'zora', url };
  }

  return { type: 'none' };
}

export function VideoPlayer({ episode, onClose }: VideoPlayerProps) {
  const embed = getVideoEmbed(episode.videoUrl);

  return (
    <div className="bg-bg-secondary rounded-2xl border border-border overflow-hidden mb-8">
      {/* Video area */}
      <div className="relative aspect-video bg-black">
        {embed.type === 'youtube' ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${embed.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={episode.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            loading="eager"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 w-full h-full"
          />
        ) : embed.type === 'ipfs' ? (
          <video
            src={embed.url}
            controls
            autoPlay
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-contain"
            poster={episode.coverImage}
          >
            Your browser does not support the video element.
          </video>
        ) : embed.type === 'zora' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
            {/* Cover image background */}
            {episode.coverImage && (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm"
                style={{ backgroundImage: `url(${episode.coverImage})` }}
              />
            )}
            <div className="relative z-10 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                <Play size={32} className="text-accent ml-1" />
              </div>
              <div>
                <p className="text-white font-semibold text-lg mb-1">{episode.title}</p>
                <p className="text-white/60 text-sm mb-4">This episode lives onchain</p>
              </div>
              <a
                href={embed.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-colors"
              >
                <ExternalLink size={16} />
                Watch on {embed.url?.includes('highlight') ? 'Highlight' : 'Zora'}
              </a>
            </div>
          </div>
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
              {(embed.type === 'zora' || embed.type === 'ipfs') && (
                <Badge className="bg-chain-base/10 text-chain-base border border-chain-base/20">Onchain</Badge>
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
