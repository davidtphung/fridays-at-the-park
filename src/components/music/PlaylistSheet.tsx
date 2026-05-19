'use client';

import { useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, ListPlus, Volume2 } from 'lucide-react';
import { Track } from '@/types/track';
import { Playlist, getMockPlaylist } from '@/lib/mock-data';
import { usePlayerStore } from '@/stores/playerStore';
import { useQueueStore } from '@/stores/queueStore';
import { formatDuration } from '@/lib/format';

interface PlaylistSheetProps {
  /** Slug of the open playlist, or null when closed. */
  slug: string | null;
  onClose: () => void;
}

/**
 * Slide-up "Now Playing"-style sheet showing the full tracklist of a playlist.
 *
 * Apple Music / iOS HIG conventions:
 * - Slides up from the bottom on mobile (full-height sheet)
 * - Anchors as a centered modal on desktop (max-w-2xl)
 * - Tap a track row → play that track (with the rest of the playlist queued)
 * - "Play all" button at the top → play track 1 + queue
 * - "Add to queue" appends without interrupting playback
 * - Drag handle + ESC + scrim-click all dismiss
 */
export function PlaylistSheet({ slug, onClose }: PlaylistSheetProps) {
  const resolved = useMemo(() => (slug ? getMockPlaylist(slug) : null), [slug]);
  const play = usePlayerStore((s) => s.play);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const setQueue = useQueueStore((s) => s.setQueue);
  const addToQueue = useQueueStore((s) => s.addToQueue);

  // ESC dismisses the sheet (matches the NowPlaying expanded view).
  useEffect(() => {
    if (!slug) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    // Lock body scroll while sheet is open — prevents background bleed.
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [slug, onClose]);

  const handlePlayTrack = (track: Track, index: number) => {
    if (!resolved) return;
    // If user taps the row of the track already playing, toggle play/pause
    // (matches Apple Music behavior).
    if (currentTrack?.id === track.id) {
      togglePlay();
      return;
    }
    if (!track.audioUrl) return;
    play(track);
    // Queue = everything after the picked track that has audio.
    const rest = resolved.tracks.slice(index + 1).filter((t) => t.audioUrl);
    setQueue(rest);
  };

  const handlePlayAll = () => {
    if (!resolved || resolved.tracks.length === 0) return;
    const [first, ...rest] = resolved.tracks;
    if (!first.audioUrl) return;
    if (currentTrack?.id === first.id) {
      togglePlay();
      return;
    }
    play(first);
    setQueue(rest.filter((t) => t.audioUrl));
  };

  const handleAddAllToQueue = () => {
    if (!resolved) return;
    for (const t of resolved.tracks) {
      if (t.audioUrl) addToQueue(t);
    }
  };

  const playlist: Playlist | null = resolved?.playlist ?? null;
  const tracks: Track[] = resolved?.tracks ?? [];
  const playlistIsCurrent = tracks.some((t) => t.id === currentTrack?.id);
  const playAllIsPlaying = playlistIsCurrent && isPlaying && currentTrack?.id === tracks[0]?.id;

  return (
    <AnimatePresence>
      {slug && playlist && (
        <>
          {/* Scrim — clicking dismisses the sheet */}
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[88vh] sm:max-h-[80vh] sm:inset-x-auto sm:left-1/2 sm:bottom-[88px] sm:-translate-x-1/2 sm:max-w-2xl sm:w-[calc(100vw-2rem)] sm:rounded-2xl rounded-t-3xl overflow-hidden glass border border-border/60 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={`Playlist: ${playlist.title}`}
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            {/* Drag handle — visual hint that this dismisses */}
            <div className="flex justify-center pt-2 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-text-secondary/30" aria-hidden="true" />
            </div>

            {/* Header */}
            <div className="px-5 pt-3 pb-4 flex items-start gap-4 border-b border-border/40">
              {/* 3-cover stack */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
                {tracks.slice(0, 3).map((t, i) => (
                  <div
                    key={t.id}
                    className="absolute rounded-lg overflow-hidden border border-bg-primary shadow-md"
                    style={{
                      width: '100%',
                      height: '100%',
                      transform: `translate(${i * 4}px, ${i * 4}px)`,
                      zIndex: 3 - i,
                    }}
                  >
                    <Image src={t.coverImage} alt="" fill className="object-cover" sizes="80px" />
                  </div>
                ))}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base shrink-0" aria-hidden="true">{playlist.emoji}</span>
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-accent">Playlist</p>
                </div>
                <h2 className="text-xl font-bold text-text-primary leading-tight truncate">{playlist.title}</h2>
                <p className="text-xs text-text-secondary mt-1 line-clamp-2">{playlist.description}</p>
                <p className="text-[11px] text-text-secondary mt-1.5">
                  {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 -mr-2 rounded-lg text-text-secondary hover:text-text-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0"
                aria-label="Close playlist"
              >
                <X size={20} />
              </button>
            </div>

            {/* Action bar */}
            <div className="px-5 py-3 flex items-center gap-2 border-b border-border/40">
              <button
                onClick={handlePlayAll}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-bg-primary font-semibold text-sm transition-all hover:bg-accent-hover active:scale-[0.97] min-h-[40px]"
                aria-label={playAllIsPlaying ? 'Pause playlist' : 'Play playlist'}
              >
                {playAllIsPlaying ? (
                  <>
                    <Pause size={16} fill="currentColor" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play size={16} fill="currentColor" className="ml-0.5" />
                    Play
                  </>
                )}
              </button>
              <button
                onClick={handleAddAllToQueue}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-bg-tertiary text-text-primary font-medium text-sm transition-all hover:bg-bg-tertiary/80 active:scale-[0.97] min-h-[40px]"
                aria-label="Add playlist to queue"
              >
                <ListPlus size={16} />
                <span className="hidden sm:inline">Add to queue</span>
                <span className="sm:hidden">Queue</span>
              </button>
            </div>

            {/* Tracklist (scrollable) */}
            <div className="overflow-y-auto" style={{ maxHeight: '52vh' }}>
              <ul role="list" className="divide-y divide-border/30">
                {tracks.map((track, i) => {
                  const isCurrent = currentTrack?.id === track.id;
                  const isPlayingThis = isCurrent && isPlaying;
                  const artistNames = track.artists.map((a) => a.artist.name).join(', ');
                  const noAudio = !track.audioUrl;
                  return (
                    <li key={track.id}>
                      <button
                        type="button"
                        onClick={() => handlePlayTrack(track, i)}
                        disabled={noAudio}
                        className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors min-h-[60px] ${
                          noAudio ? 'opacity-50 cursor-not-allowed' : 'hover:bg-bg-tertiary/50 active:bg-bg-tertiary/70'
                        } ${isCurrent ? 'bg-accent/5' : ''}`}
                        aria-label={isPlayingThis ? `Pause ${track.title}` : `Play ${track.title}`}
                        aria-current={isCurrent ? 'true' : undefined}
                      >
                        {/* Index / play-state indicator */}
                        <div className="w-6 shrink-0 flex items-center justify-center">
                          {isPlayingThis ? (
                            <Volume2 size={16} className="text-accent animate-pulse" aria-hidden="true" />
                          ) : isCurrent ? (
                            <Pause size={14} className="text-accent" fill="currentColor" />
                          ) : (
                            <span className="text-xs tabular-nums text-text-secondary group-hover:hidden">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                          )}
                        </div>

                        {/* Cover */}
                        <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 bg-bg-tertiary">
                          <Image src={track.coverImage} alt="" fill className="object-cover" sizes="40px" />
                        </div>

                        {/* Title + artists */}
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-medium truncate ${isCurrent ? 'text-accent' : 'text-text-primary'}`}>
                            {track.title}
                          </p>
                          <p className="text-xs text-text-secondary truncate">{artistNames}</p>
                        </div>

                        {/* Duration */}
                        {track.duration ? (
                          <span className="text-xs tabular-nums text-text-secondary shrink-0 ml-2">
                            {formatDuration(track.duration)}
                          </span>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {tracks.length === 0 && (
                <p className="text-center text-sm text-text-secondary py-8">No tracks in this playlist yet.</p>
              )}
            </div>

            {/* Footer: explore link to track grid filtered by this theme */}
            <div className="px-5 py-3 border-t border-border/40 flex items-center justify-between">
              <p className="text-[11px] text-text-secondary">Curated by The Park</p>
              {tracks[0] && (
                <Link
                  href={`/track/${tracks[0].id}`}
                  onClick={onClose}
                  className="text-xs text-accent hover:underline"
                >
                  Open first track →
                </Link>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
