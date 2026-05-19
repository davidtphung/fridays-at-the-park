'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import { Playlist, getMockPlaylist } from '@/lib/mock-data';
import { usePlayerStore } from '@/stores/playerStore';
import { useQueueStore } from '@/stores/queueStore';
import { Track } from '@/types/track';

interface PlaylistRailProps {
  playlists: Playlist[];
}

/**
 * Horizontal rail of curated playlists. Each card shows:
 * - a 3-cover mosaic from the first three tracks (Apple Music-style)
 * - the playlist title + description
 * - a play button that loads the whole playlist into the queue and starts
 *   playback at track 1
 *
 * The active playlist's play button flips to Pause when its first track is
 * currently playing — so the rail reads as a "now playing" indicator too.
 */
export function PlaylistRail({ playlists }: PlaylistRailProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const play = usePlayerStore((s) => s.play);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const setQueue = useQueueStore((s) => s.setQueue);

  const handlePlay = (slug: string) => {
    const resolved = getMockPlaylist(slug);
    if (!resolved || resolved.tracks.length === 0) return;
    const [first, ...rest] = resolved.tracks;
    // If we're already on this playlist's first track, just toggle play.
    if (currentTrack?.id === first.id) {
      togglePlay();
      return;
    }
    if (first.audioUrl) {
      play(first);
      setQueue(rest.filter((t) => t.audioUrl));
    }
  };

  return (
    <section aria-label="Curated playlists" className="relative">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-base sm:text-lg font-semibold text-text-primary">Playlists</h2>
        <p className="text-xs text-text-secondary">Curated by The Park</p>
      </div>

      {/* Horizontal scroll — snap to each card so on mobile it lands clean */}
      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
        {playlists.map((pl) => {
          const resolved = getMockPlaylist(pl.slug);
          const tracks = resolved?.tracks ?? [];
          const isCurrentPlaylist = tracks.some((t) => t.id === currentTrack?.id);
          const isThisPlaying = isCurrentPlaylist && isPlaying;
          const covers = tracks.slice(0, 3);

          return (
            <motion.button
              key={pl.slug}
              type="button"
              onClick={() => handlePlay(pl.slug)}
              onMouseEnter={() => setExpanded(pl.slug)}
              onMouseLeave={() => setExpanded((s) => (s === pl.slug ? null : s))}
              whileTap={{ scale: 0.97 }}
              className={`snap-start shrink-0 w-[260px] sm:w-[300px] rounded-2xl overflow-hidden text-left bg-card-bg border transition-all ${
                isCurrentPlaylist ? 'border-accent/50 shadow-lg shadow-accent/10' : 'border-border hover:border-accent/30'
              }`}
              aria-label={`Play ${pl.title}: ${pl.description}`}
            >
              {/* 3-cover mosaic */}
              <div className="relative aspect-[16/9] bg-bg-tertiary">
                <div className="absolute inset-0 grid grid-cols-3 gap-px">
                  {[0, 1, 2].map((i) => {
                    const t: Track | undefined = covers[i];
                    return (
                      <div key={i} className="relative overflow-hidden bg-bg-tertiary">
                        {t?.coverImage ? (
                          <Image
                            src={t.coverImage}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="100px"
                          />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
                {/* Hover/focus play-button overlay */}
                <div
                  className={`absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-200 ${
                    expanded === pl.slug || isCurrentPlaylist ? 'bg-black/30' : ''
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full bg-accent text-bg-primary flex items-center justify-center shadow-lg transition-all duration-200 ${
                      expanded === pl.slug || isCurrentPlaylist
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-90'
                    }`}
                  >
                    {isThisPlaying ? (
                      <Pause size={20} fill="currentColor" />
                    ) : (
                      <Play size={20} fill="currentColor" className="ml-0.5" />
                    )}
                  </div>
                </div>
              </div>

              {/* Title + description */}
              <div className="p-3 sm:p-4">
                <div className="flex items-start gap-2">
                  <span className="text-base sm:text-lg shrink-0" aria-hidden="true">
                    {pl.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-text-primary truncate">{pl.title}</p>
                    <p className="text-xs text-text-secondary line-clamp-2 mt-0.5 leading-snug">
                      {pl.description}
                    </p>
                    <p className="text-[10px] text-text-secondary mt-1.5 uppercase tracking-wider font-medium">
                      {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
