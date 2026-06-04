'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, ExternalLink, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import { Track } from '@/types/track';
import { fastIpfsUrl } from '@/lib/fast-ipfs';

interface MusicVideoGridProps {
  tracks: Track[];
}

/**
 * Press-to-play music video grid. Each card shows a poster + play overlay
 * until tapped, at which point the card swaps in a real <video> element
 * with `autoplay` and starts streaming. dweb.link gateway keeps first-byte
 * to ~250 ms (vs Pinata's 4.8 s) so playback is effectively instant.
 *
 * Only one card plays at a time - selecting another auto-pauses the
 * previous via React state.
 */
export function MusicVideoGrid({ tracks }: MusicVideoGridProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  if (tracks.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tracks.map((track) => (
        <MusicVideoCard
          key={track.id}
          track={track}
          isPlaying={playingId === track.id}
          onPlay={() => setPlayingId(track.id)}
          onPause={() => setPlayingId((p) => (p === track.id ? null : p))}
        />
      ))}
    </div>
  );
}

interface CardProps {
  track: Track;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
}

function MusicVideoCard({ track, isPlaying, onPlay, onPause }: CardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const artistNames = track.artists.map((a) => a.artist.name).join(', ');
  // Rewrite Pinata → dweb.link for instant first-byte
  const videoSrc = track.videoUrl ? fastIpfsUrl(track.videoUrl) : '';

  // When another card claims `isPlaying`, pause this one. Only one card
  // plays at a time (parent enforces it via state).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!isPlaying && !v.paused) v.pause();
  }, [isPlaying]);

  return (
    <motion.div
      whileTap={{ scale: 0.99 }}
      className="bg-card-bg border border-border rounded-2xl overflow-hidden hover:border-accent/30 transition-colors"
    >
      {/* Poster + play overlay until the user presses play, then a real
          <video> element streams the content. The video sits over the
          poster (same aspect ratio) so the visual transition is seamless. */}
      <div className="relative aspect-video bg-bg-tertiary">
        {isPlaying ? (
          <video
            ref={videoRef}
            src={videoSrc}
            poster={track.coverImage}
            controls
            autoPlay
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            // NOTE: deliberately not wiring `onPause` → parent's `onPause`.
            // The HTML `pause` event fires during scrubbing/seeking (browsers
            // pause briefly while seeking, then resume) and when entering or
            // exiting fullscreen on some platforms. Wiring it would unmount
            // the <video> on every scrub - kicking the user out of fullscreen
            // mid-skip. The inline pause/close button in the card header is
            // the explicit signal to return to the poster, and the parent's
            // "only one card plays at a time" useEffect uses imperative
            // `videoRef.current.pause()` so we don't depend on this event.
            onEnded={onPause}
            aria-label={`${track.title} by ${artistNames}`}
          />
        ) : (
          <>
            <Image
              src={track.coverImage}
              alt={`${track.title} - poster`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* Play overlay */}
            <button
              type="button"
              onClick={onPlay}
              className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 active:bg-black/40 transition-colors group"
              aria-label={`Play ${track.title}`}
            >
              <div className="w-16 h-16 rounded-full bg-accent text-bg-primary flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-200">
                <Play size={28} fill="currentColor" className="ml-1" />
              </div>
            </button>
          </>
        )}
      </div>

      {/* Title + actions */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Link
              href={`/track/${track.id}`}
              className="block text-sm sm:text-base font-semibold text-text-primary hover:text-accent transition-colors truncate"
            >
              {track.title}
            </Link>
            <p className="text-xs text-text-secondary truncate mt-0.5">{artistNames}</p>
          </div>
          {/* Inline play / pause toggle pinned to the card */}
          {isPlaying ? (
            <button
              type="button"
              onClick={() => {
                videoRef.current?.pause();
                onPause();
              }}
              className="shrink-0 w-9 h-9 rounded-full bg-accent text-bg-primary flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              aria-label={`Pause ${track.title}`}
            >
              <Pause size={16} fill="currentColor" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onPlay}
              className="shrink-0 w-9 h-9 rounded-full bg-bg-tertiary text-text-primary flex items-center justify-center transition-all hover:bg-accent hover:text-bg-primary hover:scale-105 active:scale-95"
              aria-label={`Play ${track.title}`}
            >
              <Play size={16} fill="currentColor" className="ml-0.5" />
            </button>
          )}
        </div>
        {/* Collect link */}
        {track.mintUrl && (
          <a
            href={track.mintUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-accent hover:text-accent-hover transition-colors"
          >
            <ExternalLink size={12} aria-hidden="true" />
            Collect on Zora
          </a>
        )}
      </div>
    </motion.div>
  );
}
