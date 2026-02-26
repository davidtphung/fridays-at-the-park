'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Play, Tv, ChevronDown, Film, Music, ExternalLink, X } from 'lucide-react';
import { getMockEpisodes, getSeasons } from '@/lib/mock-data';
import { Track } from '@/types/track';
import { Badge } from '@/components/ui/Badge';
import { formatDuration, formatSeasonEpisode } from '@/lib/format';

function getVideoEmbed(url?: string): { type: 'youtube' | 'ipfs' | 'zora' | 'none'; id?: string; url?: string } {
  if (!url) return { type: 'none' };
  if (url.includes('youtube.com/embed/')) {
    const id = url.split('youtube.com/embed/')[1]?.split('?')[0];
    return id ? { type: 'youtube', id } : { type: 'none' };
  }
  if (url.includes('gateway.pinata.cloud/ipfs/') || url.includes('ipfs.io/ipfs/') || url.includes('nftstorage.link')) {
    return { type: 'ipfs', url };
  }
  if (url.includes('zora.co') || url.includes('highlight.xyz')) {
    return { type: 'zora', url };
  }
  return { type: 'none' };
}

// Categorize episodes
function categorizeEpisodes(episodes: Track[]) {
  const sessionEps = episodes.filter(e =>
    e.title.includes('Ep') || e.title.includes('Episode') || e.title.includes('Trailer')
  );
  const musicVideos = episodes.filter(e =>
    !sessionEps.includes(e) && !e.title.includes('Ending Credits') && !e.title.includes('Genesis')
  );
  const extras = episodes.filter(e =>
    !sessionEps.includes(e) && !musicVideos.includes(e)
  );
  return { sessionEps, musicVideos, extras };
}

export function EpisodesContent() {
  const seasons = getSeasons();
  const [activeSeason, setActiveSeason] = useState('');
  const [activeEpisode, setActiveEpisode] = useState<Track | null>(null);
  const [showCategory, setShowCategory] = useState<'sessions' | 'videos' | 'all'>('all');
  const playerRef = useRef<HTMLDivElement>(null);

  const allEpisodes = useMemo(() => {
    return getMockEpisodes(activeSeason || undefined);
  }, [activeSeason]);

  const { sessionEps, musicVideos, extras } = useMemo(() => categorizeEpisodes(allEpisodes), [allEpisodes]);

  const displayEpisodes = useMemo(() => {
    if (showCategory === 'sessions') return sessionEps;
    if (showCategory === 'videos') return [...musicVideos, ...extras];
    return allEpisodes;
  }, [showCategory, sessionEps, musicVideos, extras, allEpisodes]);

  // Auto-scroll to player when episode selected
  useEffect(() => {
    if (activeEpisode && playerRef.current) {
      playerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeEpisode?.id]);

  const embed = activeEpisode ? getVideoEmbed(activeEpisode.videoUrl) : { type: 'none' as const };

  return (
    <div className="space-y-8">
      {/* TV Player Area */}
      <div ref={playerRef}>
        {activeEpisode ? (
          <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl border border-border/50">
            {/* Close button */}
            <button
              onClick={() => setActiveEpisode(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black/80 transition-colors"
              aria-label="Close player"
            >
              <X size={20} />
            </button>

            {/* Video player - 16:9 aspect ratio */}
            <div className="relative aspect-video bg-black">
              {embed.type === 'youtube' ? (
                <iframe
                  src={`https://www.youtube.com/embed/${embed.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                  title={activeEpisode.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              ) : embed.type === 'ipfs' ? (
                <video
                  src={embed.url}
                  controls
                  autoPlay
                  playsInline
                  className="absolute inset-0 w-full h-full object-contain"
                  poster={activeEpisode.coverImage}
                />
              ) : embed.type === 'zora' ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
                  {activeEpisode.coverImage && (
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-20 blur-md scale-110"
                      style={{ backgroundImage: `url(${activeEpisode.coverImage})` }}
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                    <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                      <Play size={36} className="text-white ml-1" />
                    </div>
                    <h3 className="text-white font-bold text-xl">{activeEpisode.title}</h3>
                    <p className="text-white/50 text-sm">This episode lives onchain</p>
                    <a
                      href={embed.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent-hover transition-colors"
                    >
                      <ExternalLink size={16} />
                      Watch on Zora
                    </a>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/40">
                  Video unavailable
                </div>
              )}
            </div>

            {/* Now Playing Info Bar */}
            <div className="bg-gradient-to-r from-bg-secondary to-bg-tertiary px-6 py-4 border-t border-border/30">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {activeEpisode.season && (
                      <Badge variant="season">{formatSeasonEpisode(activeEpisode.season, activeEpisode.episode)}</Badge>
                    )}
                    {embed.type !== 'none' && embed.type !== 'zora' && (
                      <Badge className="bg-green-500/10 text-green-400 border border-green-500/20">
                        <Tv size={10} className="mr-1" /> Now Playing
                      </Badge>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-text-primary truncate">{activeEpisode.title}</h2>
                  <p className="text-sm text-text-secondary truncate">
                    {activeEpisode.artists.map(a => a.artist.name).join(', ')}
                  </p>
                </div>
                {activeEpisode.mintUrl && (
                  <a
                    href={activeEpisode.mintUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 px-4 py-2 bg-accent/10 text-accent rounded-lg text-sm font-medium hover:bg-accent/20 transition-colors hidden sm:flex items-center gap-1.5"
                  >
                    <ExternalLink size={14} />
                    Collect
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Hero / Welcome Banner when no video is playing */
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-bg-secondary via-bg-tertiary to-bg-secondary border border-border/50 aspect-[21/9] sm:aspect-[3/1] flex items-center justify-center">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, currentColor 20px, currentColor 21px), repeating-linear-gradient(90deg, transparent, transparent 20px, currentColor 20px, currentColor 21px)',
                color: 'var(--color-text-primary)',
              }} />
            </div>
            <div className="relative text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Tv size={32} className="text-accent" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">FATP TV</h2>
              <p className="text-text-secondary text-sm sm:text-base max-w-md mx-auto">
                Select an episode below to start watching. Studio sessions, music videos, and more.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Season selector */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveSeason('')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors min-h-[40px] ${
              activeSeason === '' ? 'bg-accent text-white' : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
            }`}
          >
            All Seasons
          </button>
          {seasons.map(season => (
            <button
              key={season}
              onClick={() => setActiveSeason(season)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors min-h-[40px] ${
                activeSeason === season ? 'bg-accent text-white' : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
              }`}
            >
              {season}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-border hidden sm:block" />

        {/* Category filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              showCategory === 'all' ? 'bg-text-primary text-bg-primary' : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setShowCategory('sessions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              showCategory === 'sessions' ? 'bg-text-primary text-bg-primary' : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
            }`}
          >
            <Film size={12} /> Sessions
          </button>
          <button
            onClick={() => setShowCategory('videos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              showCategory === 'videos' ? 'bg-text-primary text-bg-primary' : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
            }`}
          >
            <Music size={12} /> Music Videos
          </button>
        </div>
      </div>

      {/* Episode Grid - TV Guide Style */}
      {displayEpisodes.length === 0 ? (
        <div className="text-center py-16 text-text-secondary">
          <Film size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium">No episodes found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayEpisodes.map(episode => {
            const isActive = activeEpisode?.id === episode.id;
            const epEmbed = getVideoEmbed(episode.videoUrl);
            const isPlayable = epEmbed.type === 'youtube' || epEmbed.type === 'ipfs';
            const artistNames = episode.artists.map(a => a.artist.name).join(', ');

            return (
              <button
                key={episode.id}
                onClick={() => setActiveEpisode(episode)}
                className={`group text-left rounded-xl overflow-hidden transition-all duration-200 ${
                  isActive
                    ? 'ring-2 ring-accent shadow-lg shadow-accent/10 scale-[1.02]'
                    : 'hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5'
                }`}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-bg-tertiary overflow-hidden">
                  <Image
                    src={episode.coverImage}
                    alt={episode.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />

                  {/* Play overlay */}
                  <div className={`absolute inset-0 transition-all duration-200 flex items-center justify-center ${
                    isActive ? 'bg-accent/30' : 'bg-black/0 group-hover:bg-black/40'
                  }`}>
                    <div className={`rounded-full transition-all duration-200 ${
                      isActive
                        ? 'w-12 h-12 bg-accent flex items-center justify-center'
                        : 'w-12 h-12 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100'
                    }`}>
                      {isActive ? (
                        <div className="flex gap-0.5">
                          <div className="w-1 h-4 bg-white rounded-full animate-pulse" />
                          <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
                          <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                        </div>
                      ) : (
                        <Play size={20} className="text-black ml-0.5" fill="black" />
                      )}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    {episode.season && (
                      <span className="px-2 py-0.5 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
                        {formatSeasonEpisode(episode.season, episode.episode)}
                      </span>
                    )}
                  </div>

                  {/* Duration */}
                  {episode.duration && (
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-white text-[10px] font-mono rounded">
                      {formatDuration(episode.duration)}
                    </span>
                  )}

                  {/* Platform indicator */}
                  {isPlayable && (
                    <div className="absolute top-2 right-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full block shadow-sm shadow-green-400/50" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3 bg-bg-secondary border border-t-0 border-border/30 rounded-b-xl">
                  <h3 className="text-sm font-semibold text-text-primary line-clamp-1 leading-snug">
                    {episode.title}
                  </h3>
                  <p className="text-xs text-text-secondary line-clamp-1 mt-0.5">{artistNames}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
