'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Tv, Film, Music, ExternalLink, X, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { getMockEpisodes, getSeasons } from '@/lib/mock-data';
import { Track } from '@/types/track';
import { Badge } from '@/components/ui/Badge';
import { formatDuration, formatSeasonEpisode } from '@/lib/format';

// ─── Video embed resolver ───
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

// ─── Categorize episodes ───
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

// ─── Apple-style Cover Flow constants (from coverflow-media) ───
const ROTATE_ANGLE = 55;       // degrees for side covers
const Z_DEPTH = 220;           // how far back side covers are pushed
const SIDE_GAP = 120;          // horizontal gap between side covers (px)
const CENTER_GAP = 280;        // gap between center and first side cover (px)
const EASING: [number, number, number, number] = [0, 0, 0.001, 1]; // Apple-style exponential ease-out

// ═══════════════════════════════════════
// Apple Cover Flow Component for Episodes
// ═══════════════════════════════════════
function EpisodeCoverFlow({
  episodes,
  activeIndex,
  onSelect,
  onNavigate,
}: {
  episodes: Track[];
  activeIndex: number;
  onSelect: (episode: Track) => void;
  onNavigate: (index: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement) && document.activeElement !== containerRef.current) return;
      if (e.key === 'ArrowRight') onNavigate(Math.min(episodes.length - 1, activeIndex + 1));
      if (e.key === 'ArrowLeft') onNavigate(Math.max(0, activeIndex - 1));
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (episodes[activeIndex]) onSelect(episodes[activeIndex]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, episodes, onSelect, onNavigate]);

  // Mouse wheel navigation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let timeout: ReturnType<typeof setTimeout>;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (e.deltaX > 30 || e.deltaY > 30) onNavigate(Math.min(episodes.length - 1, activeIndex + 1));
        else if (e.deltaX < -30 || e.deltaY < -30) onNavigate(Math.max(0, activeIndex - 1));
      }, 50);
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => { el.removeEventListener('wheel', handleWheel); clearTimeout(timeout); };
  }, [activeIndex, episodes.length, onNavigate]);

  if (episodes.length === 0) return null;

  const activeEp = episodes[activeIndex];
  const artistNames = activeEp?.artists.map(a => a.artist.name).join(', ');

  return (
    <div className="relative select-none">
      {/* Black CoverFlow stage with perspective */}
      <div
        ref={containerRef}
        className="relative h-[280px] sm:h-[360px] lg:h-[420px] overflow-hidden rounded-2xl bg-black"
        style={{ perspective: '800px' }}
        tabIndex={0}
        role="listbox"
        aria-label="Episode cover flow — use arrow keys to browse"
      >
        {/* Edge fade mask */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            maskImage: 'linear-gradient(to right, rgba(0,0,0,0.1) 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 88%, rgba(0,0,0,0.1) 100%)',
            WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0.1) 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 88%, rgba(0,0,0,0.1) 100%)',
          }}
        />

        {/* Covers */}
        {episodes.map((episode, index) => {
          const offset = index - activeIndex;
          const absOffset = Math.abs(offset);
          if (absOffset > 5) return null; // Don't render far-off covers

          const isCenter = offset === 0;
          const isPlayable = getVideoEmbed(episode.videoUrl).type !== 'none';

          // Position math inspired by coverflow-media
          let x = 0;
          let z = 0;
          let rotateY = 0;
          let zIndex = 10 - absOffset;

          if (offset < 0) {
            // Left of center
            x = offset * SIDE_GAP - CENTER_GAP;
            z = -Z_DEPTH;
            rotateY = ROTATE_ANGLE;
          } else if (offset > 0) {
            // Right of center
            x = offset * SIDE_GAP + CENTER_GAP;
            z = -Z_DEPTH;
            rotateY = -ROTATE_ANGLE;
          } else {
            // Center
            x = 0;
            z = 0;
            rotateY = 0;
            zIndex = 50;
          }

          return (
            <motion.div
              key={episode.id}
              role="option"
              aria-selected={isCenter}
              aria-label={`${episode.title}${episode.season ? ` — ${formatSeasonEpisode(episode.season, episode.episode)}` : ''}`}
              className="absolute left-1/2 top-1/2 cursor-pointer"
              style={{
                marginLeft: '-140px', // half of cover width
                marginTop: '-100px', // offset for visual center
                transformStyle: 'preserve-3d',
                zIndex,
              }}
              animate={{
                x,
                z,
                rotateY,
                opacity: absOffset > 4 ? 0 : 1,
                scale: isCenter ? 1 : 0.85,
              }}
              transition={{
                type: 'tween',
                duration: 0.6,
                ease: EASING,
              }}
              onClick={() => {
                if (isCenter) onSelect(episode);
                else onNavigate(index);
              }}
            >
              {/* Cover image */}
              <div className="relative w-[280px] h-[158px] sm:w-[320px] sm:h-[180px] lg:w-[360px] lg:h-[202px] rounded-xl overflow-hidden shadow-2xl group">
                <Image
                  src={episode.coverImage}
                  alt={episode.title}
                  fill
                  className="object-cover"
                  sizes="360px"
                  priority={absOffset <= 1}
                />
                {/* Play overlay on center */}
                {isCenter && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200">
                      <Play size={24} className="text-black ml-1" fill="black" />
                    </div>
                  </div>
                )}
                {/* Season badge */}
                {episode.season && isCenter && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
                      {formatSeasonEpisode(episode.season, episode.episode)}
                    </span>
                  </div>
                )}
                {/* Duration */}
                {episode.duration && isCenter && (
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-white text-[10px] font-mono rounded">
                    {formatDuration(episode.duration)}
                  </span>
                )}
                {/* Playable indicator */}
                {isPlayable && isCenter && (
                  <div className="absolute top-2 right-2">
                    <span className="w-2.5 h-2.5 bg-green-400 rounded-full block shadow-sm shadow-green-400/50 animate-pulse" />
                  </div>
                )}
                {/* Active ring */}
                {isCenter && (
                  <div className="absolute inset-0 ring-2 ring-accent/40 rounded-xl pointer-events-none" />
                )}
              </div>

              {/* Reflection — Apple signature effect */}
              <div
                className="relative w-[280px] h-[50px] sm:w-[320px] sm:h-[55px] lg:w-[360px] lg:h-[65px] mt-[2px] overflow-hidden rounded-b-xl opacity-25"
                aria-hidden="true"
              >
                <div className="relative w-full h-[158px] sm:h-[180px] lg:h-[202px]" style={{ transform: 'scaleY(-1)' }}>
                  <Image
                    src={episode.coverImage}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="360px"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation + Title below CoverFlow */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={() => onNavigate(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
          className="p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors disabled:opacity-30 min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Previous episode"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="text-center min-w-[260px]">
          <button
            onClick={() => activeEp && onSelect(activeEp)}
            className="block text-base sm:text-lg font-bold text-text-primary hover:text-accent transition-colors truncate max-w-[260px] mx-auto"
          >
            {activeEp?.title}
          </button>
          <p className="text-sm text-text-secondary truncate">{artistNames}</p>
          {activeEp?.season && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-accent/10 text-accent text-xs font-medium rounded">
              {formatSeasonEpisode(activeEp.season, activeEp.episode)}
            </span>
          )}
        </div>

        <button
          onClick={() => onNavigate(Math.min(episodes.length - 1, activeIndex + 1))}
          disabled={activeIndex === episodes.length - 1}
          className="p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors disabled:opacity-30 min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Next episode"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-1 mt-3" role="tablist" aria-label="Episode position">
        {episodes.map((_, i) => (
          <button
            key={i}
            onClick={() => onNavigate(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? 'bg-accent w-5' : 'bg-border w-1.5 hover:bg-text-secondary'
            }`}
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`Go to episode ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Main Episodes Content
// ═══════════════════════════════════════
export function EpisodesContent() {
  const seasons = getSeasons();
  const [activeSeason, setActiveSeason] = useState('');
  const [activeEpisode, setActiveEpisode] = useState<Track | null>(null);
  const [coverFlowIndex, setCoverFlowIndex] = useState(0);
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

  // Reset cover flow index when episodes change
  useEffect(() => {
    setCoverFlowIndex(0);
  }, [displayEpisodes.length]);

  // Auto-scroll to player when episode selected
  useEffect(() => {
    if (activeEpisode && playerRef.current) {
      playerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeEpisode?.id]);

  const handleSelectEpisode = useCallback((episode: Track) => {
    setActiveEpisode(episode);
  }, []);

  const handleNavigate = useCallback((index: number) => {
    setCoverFlowIndex(index);
  }, []);

  const embed = activeEpisode ? getVideoEmbed(activeEpisode.videoUrl) : { type: 'none' as const };

  return (
    <div className="space-y-8">
      {/* Filters (above the CoverFlow) */}
      <div className="flex flex-wrap items-center gap-3">
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

      {/* Apple Cover Flow */}
      {displayEpisodes.length > 0 ? (
        <EpisodeCoverFlow
          episodes={displayEpisodes}
          activeIndex={coverFlowIndex}
          onSelect={handleSelectEpisode}
          onNavigate={handleNavigate}
        />
      ) : (
        <div className="text-center py-16 text-text-secondary">
          <Film size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium">No episodes found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      )}

      {/* Video Player (appears when an episode is selected) */}
      <AnimatePresence>
        {activeEpisode && (
          <motion.div
            ref={playerRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl border border-border/50">
              {/* Back button */}
              <button
                onClick={() => setActiveEpisode(null)}
                className="absolute top-4 right-4 z-20 px-3 py-2 rounded-lg bg-black/60 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/80 transition-colors flex items-center gap-1.5 text-sm font-medium"
                aria-label="Back to episodes"
              >
                <ArrowLeft size={16} />
                Back
              </button>

              {/* Video player - 16:9 aspect ratio */}
              <div className="relative aspect-video bg-black">
                {embed.type === 'youtube' ? (
                  <>
                    <iframe
                      src={`https://www.youtube.com/embed/${embed.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                      title={activeEpisode.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
                      className="absolute inset-0 w-full h-full"
                    />
                    {/* YouTube external link overlay button */}
                    <a
                      href={`https://www.youtube.com/watch?v=${embed.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/90 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                      aria-label="Open on YouTube"
                    >
                      <ExternalLink size={12} />
                      YouTube
                    </a>
                  </>
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
                  <div className="flex items-center gap-2 shrink-0">
                    {embed.type === 'youtube' && embed.id && (
                      <a
                        href={`https://www.youtube.com/watch?v=${embed.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors hidden sm:flex items-center gap-1.5"
                      >
                        <ExternalLink size={14} />
                        YouTube
                      </a>
                    )}
                    {activeEpisode.mintUrl && (
                      <a
                        href={activeEpisode.mintUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-accent/10 text-accent rounded-lg text-sm font-medium hover:bg-accent/20 transition-colors hidden sm:flex items-center gap-1.5"
                      >
                        <ExternalLink size={14} />
                        Collect
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Episode Grid below CoverFlow */}
      {displayEpisodes.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-text-primary mb-4">All Episodes</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {displayEpisodes.map((episode, index) => {
              const isActive = activeEpisode?.id === episode.id;
              const epEmbed = getVideoEmbed(episode.videoUrl);
              const isPlayable = epEmbed.type === 'youtube' || epEmbed.type === 'ipfs';
              const artistNames = episode.artists.map(a => a.artist.name).join(', ');

              return (
                <button
                  key={episode.id}
                  onClick={() => {
                    setCoverFlowIndex(index);
                    setActiveEpisode(episode);
                  }}
                  className={`group text-left rounded-xl overflow-hidden transition-all duration-200 ${
                    isActive
                      ? 'ring-2 ring-accent shadow-lg shadow-accent/10'
                      : 'hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5'
                  }`}
                >
                  <div className="relative aspect-video bg-bg-tertiary overflow-hidden">
                    <Image
                      src={episode.coverImage}
                      alt={episode.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                    <div className={`absolute inset-0 transition-all duration-200 flex items-center justify-center ${
                      isActive ? 'bg-accent/30' : 'bg-black/0 group-hover:bg-black/40'
                    }`}>
                      <div className={`rounded-full transition-all duration-200 ${
                        isActive
                          ? 'w-10 h-10 bg-accent flex items-center justify-center'
                          : 'w-10 h-10 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100'
                      }`}>
                        {isActive ? (
                          <div className="flex gap-0.5">
                            <div className="w-0.5 h-3 bg-white rounded-full animate-pulse" />
                            <div className="w-0.5 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
                            <div className="w-0.5 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                          </div>
                        ) : (
                          <Play size={16} className="text-black ml-0.5" fill="black" />
                        )}
                      </div>
                    </div>
                    {episode.season && (
                      <div className="absolute top-1.5 left-1.5">
                        <span className="px-1.5 py-0.5 bg-black/70 backdrop-blur-sm text-white text-[9px] font-bold rounded uppercase tracking-wider">
                          {formatSeasonEpisode(episode.season, episode.episode)}
                        </span>
                      </div>
                    )}
                    {episode.duration ? (
                      <span className="absolute bottom-1.5 right-1.5 px-1 py-0.5 bg-black/80 text-white text-[9px] font-mono rounded">
                        {formatDuration(episode.duration)}
                      </span>
                    ) : null}
                    {isPlayable && (
                      <div className="absolute top-1.5 right-1.5">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full block" />
                      </div>
                    )}
                  </div>
                  <div className="p-2 bg-bg-secondary border border-t-0 border-border/30 rounded-b-xl">
                    <h3 className="text-xs font-semibold text-text-primary line-clamp-1 leading-snug">
                      {episode.title}
                    </h3>
                    <p className="text-[10px] text-text-secondary line-clamp-1 mt-0.5">{artistNames}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
