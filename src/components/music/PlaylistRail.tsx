'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import { Playlist, getMockPlaylist } from '@/lib/mock-data';
import { usePlayerStore } from '@/stores/playerStore';
import { useQueueStore } from '@/stores/queueStore';
import { Track } from '@/types/track';
import { PlaylistSheet } from './PlaylistSheet';

interface PlaylistRailProps {
  playlists: Playlist[];
}

/**
 * Horizontal rail of curated playlists. Card interactions:
 *
 *  - Tap the card BODY (cover mosaic + text) → opens the PlaylistSheet
 *    showing the full tracklist with per-track play buttons.
 *  - Tap the round play button on the cover → immediately plays the
 *    playlist's first track and queues the rest (Apple Music behavior).
 *
 * Separating "explore" from "play" matches Apple Music + Spotify HIG —
 * users who already know they want to play don't have to dismiss a sheet,
 * and users who want to browse can drill in without the audio jumping.
 */
export function PlaylistRail({ playlists }: PlaylistRailProps) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const play = usePlayerStore((s) => s.play);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const setQueue = useQueueStore((s) => s.setQueue);

  const handlePlay = (slug: string) => {
    const resolved = getMockPlaylist(slug);
    if (!resolved || resolved.tracks.length === 0) return;
    const [first, ...rest] = resolved.tracks;
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
    <>
      <section aria-label="Curated playlists" className="relative">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-base sm:text-lg font-semibold text-text-primary">Playlists</h2>
          <p className="text-xs text-text-secondary">Curated by The Park</p>
        </div>

        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
          {playlists.map((pl) => {
            const resolved = getMockPlaylist(pl.slug);
            const tracks = resolved?.tracks ?? [];
            const isCurrentPlaylist = tracks.some((t) => t.id === currentTrack?.id);
            const isThisPlaying = isCurrentPlaylist && isPlaying;
            const covers = tracks.slice(0, 3);

            return (
              <motion.div
                key={pl.slug}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => setHoveredSlug(pl.slug)}
                onMouseLeave={() =>
                  setHoveredSlug((s) => (s === pl.slug ? null : s))
                }
                className={`snap-start shrink-0 w-[260px] sm:w-[300px] rounded-2xl overflow-hidden bg-card-bg border transition-all relative ${
                  isCurrentPlaylist ? 'border-accent/50 shadow-lg shadow-accent/10' : 'border-border hover:border-accent/30'
                }`}
              >
                {/* Card body — click opens the sheet */}
                <button
                  type="button"
                  onClick={() => setOpenSlug(pl.slug)}
                  className="block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded-2xl"
                  aria-label={`Open ${pl.title} playlist with ${tracks.length} tracks`}
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
                    {/* Subtle gradient bottom for legibility */}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
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
                </button>

                {/* Floating play button — separate hit target. Apple Music
                    pattern: card opens detail, play button plays now. */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlay(pl.slug);
                  }}
                  className={`absolute top-[calc(56%-24px)] right-3 z-10 w-12 h-12 rounded-full bg-accent text-bg-primary flex items-center justify-center shadow-lg transition-all duration-200 ${
                    hoveredSlug === pl.slug || isCurrentPlaylist
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-2 sm:opacity-0'
                  } sm:opacity-0 sm:group-hover:opacity-100 hover:scale-105 active:scale-95`}
                  style={{
                    // Always visible on touch devices (hover-fallback)
                    opacity: hoveredSlug === pl.slug || isCurrentPlaylist ? 1 : undefined,
                  }}
                  aria-label={isThisPlaying ? `Pause ${pl.title}` : `Play ${pl.title}`}
                >
                  {isThisPlaying ? (
                    <Pause size={20} fill="currentColor" />
                  ) : (
                    <Play size={20} fill="currentColor" className="ml-0.5" />
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>

      <PlaylistSheet slug={openSlug} onClose={() => setOpenSlug(null)} />
    </>
  );
}
