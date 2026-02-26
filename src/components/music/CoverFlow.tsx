'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2 } from 'lucide-react';
import { Track } from '@/types/track';

interface CoverFlowProps {
  tracks: Track[];
  onSelect?: (track: Track) => void;
  currentTrackId?: string;
  isPlaying?: boolean;
}

export function CoverFlow({ tracks, onSelect, currentTrackId, isPlaying }: CoverFlowProps) {
  const [activeIndex, setActiveIndex] = useState(Math.floor(tracks.length / 2));
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((index: number) => {
    setActiveIndex(Math.max(0, Math.min(tracks.length - 1, index)));
  }, [tracks.length]);

  const handleDragEnd = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold || info.velocity.x < -500) {
      goTo(activeIndex + 1);
    } else if (info.offset.x > threshold || info.velocity.x > 500) {
      goTo(activeIndex - 1);
    }
  }, [activeIndex, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement) && document.activeElement !== containerRef.current) return;
      if (e.key === 'ArrowRight') goTo(activeIndex + 1);
      if (e.key === 'ArrowLeft') goTo(activeIndex - 1);
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const track = tracks[activeIndex];
        if (track && onSelect) onSelect(track);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, goTo, tracks, onSelect]);

  if (tracks.length === 0) return null;

  const activeTrack = tracks[activeIndex];
  const artistNames = activeTrack?.artists.map(a => a.artist.name).join(', ');
  const isActiveTrackPlaying = currentTrackId === activeTrack?.id && isPlaying;
  const isActiveTrackLoaded = currentTrackId === activeTrack?.id;

  return (
    <section className="relative py-8 sm:py-12 overflow-hidden" aria-label="Featured releases">
      {/* Desktop Cover Flow */}
      <div className="hidden sm:block">
        <div
          ref={containerRef}
          className="relative h-[340px] sm:h-[400px] mx-auto max-w-[1280px]"
          style={{ perspective: '1000px' }}
          role="listbox"
          aria-label="Album carousel, use arrow keys to browse"
          tabIndex={0}
        >
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
          >
            {tracks.map((track, index) => {
              const offset = index - activeIndex;
              const isActive = offset === 0;
              const absOffset = Math.abs(offset);
              const isThisTrackPlaying = currentTrackId === track.id && isPlaying;
              const hasAudio = !!track.audioUrl;

              if (absOffset > 3) return null;

              return (
                <motion.div
                  key={track.id}
                  role="option"
                  aria-selected={isActive}
                  aria-label={`${track.title} by ${track.artists.map(a => a.artist.name).join(', ')}${hasAudio ? ' — click to play' : ''}`}
                  className="absolute cursor-pointer"
                  animate={{
                    x: offset * 200,
                    z: isActive ? 0 : -200,
                    rotateY: offset * -45,
                    scale: isActive ? 1 : 0.65,
                    opacity: absOffset > 2 ? 0 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  style={{ zIndex: 10 - absOffset }}
                  onClick={() => {
                    if (isActive && onSelect) {
                      onSelect(track);
                    } else {
                      goTo(index);
                    }
                  }}
                >
                  <div className="relative">
                    {/* Main cover */}
                    <motion.div
                      layoutId={`cover-${track.id}`}
                      className="relative w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] rounded-xl overflow-hidden shadow-2xl group"
                    >
                      <Image
                        src={track.coverImage}
                        alt={`${track.title} — album cover`}
                        fill
                        className="object-cover"
                        sizes="280px"
                        priority={absOffset <= 1}
                      />

                      {/* Play/Pause overlay for active item */}
                      {isActive && hasAudio && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
                            isThisTrackPlaying
                              ? 'bg-accent/90 scale-100 opacity-100'
                              : 'bg-white/90 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100'
                          }`}>
                            {isThisTrackPlaying ? (
                              <Pause size={28} className="text-white" />
                            ) : (
                              <Play size={28} className="text-black ml-1" />
                            )}
                          </div>
                        </div>
                      )}

                      {/* Now playing indicator */}
                      {isThisTrackPlaying && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-accent/90 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                          <Volume2 size={12} className="animate-pulse" />
                          Playing
                        </div>
                      )}

                      {/* No audio indicator */}
                      {isActive && !hasAudio && (
                        <div className="absolute bottom-3 left-3 bg-black/60 text-white/70 text-xs px-2.5 py-1 rounded-full">
                          Streaming only
                        </div>
                      )}

                      {isActive && (
                        <div className="absolute inset-0 ring-2 ring-accent/30 rounded-xl" />
                      )}
                    </motion.div>

                    {/* Reflection */}
                    <div
                      className="relative w-[240px] h-[60px] sm:w-[280px] sm:h-[70px] mt-1 overflow-hidden rounded-b-xl opacity-30"
                      aria-hidden="true"
                    >
                      <div className="relative w-full h-[240px] sm:h-[280px]" style={{ transform: 'scaleY(-1)' }}>
                        <Image
                          src={track.coverImage}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="280px"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/70 to-bg-primary" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Navigation arrows + track info */}
        <div className="flex items-center justify-center gap-4 mt-2">
          <button
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors disabled:opacity-30 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Previous album"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Track info with play button */}
          <div className="text-center min-w-[200px]">
            <div className="flex items-center justify-center gap-2">
              {activeTrack?.audioUrl && (
                <button
                  onClick={() => onSelect?.(activeTrack)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isActiveTrackPlaying
                      ? 'bg-accent text-white'
                      : 'bg-bg-tertiary text-text-primary hover:bg-accent hover:text-white'
                  }`}
                  aria-label={isActiveTrackPlaying ? 'Pause' : 'Play'}
                >
                  {isActiveTrackPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                </button>
              )}
              <Link href={`/track/${activeTrack?.id}`} className="block text-base font-semibold text-text-primary hover:underline">
                {activeTrack?.title}
              </Link>
            </div>
            <p className="text-sm text-text-secondary">{artistNames}</p>
          </div>

          <button
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex === tracks.length - 1}
            className="p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors disabled:opacity-30 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Next album"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-3" role="tablist" aria-label="Carousel position">
          {tracks.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === activeIndex ? 'bg-accent w-4' : 'bg-border hover:bg-text-secondary'
              }`}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Mobile: horizontal scroll with play buttons */}
      <div className="sm:hidden">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-4 scrollbar-none">
          {tracks.map((track, i) => {
            const isThisPlaying = currentTrackId === track.id && isPlaying;
            const hasAudio = !!track.audioUrl;
            return (
              <div
                key={track.id}
                className="snap-center shrink-0 w-[260px]"
              >
                <div
                  className="relative aspect-square rounded-xl overflow-hidden shadow-lg group cursor-pointer"
                  onClick={() => hasAudio && onSelect?.(track)}
                >
                  <Image
                    src={track.coverImage}
                    alt={`${track.title} — album cover`}
                    fill
                    className="object-cover"
                    sizes="260px"
                    priority={i < 2}
                  />
                  {hasAudio && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 active:bg-black/30 transition-all flex items-center justify-center">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                        isThisPlaying
                          ? 'bg-accent/90 scale-100 opacity-100'
                          : 'bg-white/90 scale-90 opacity-0 group-hover:opacity-100 group-active:opacity-100 group-hover:scale-100 group-active:scale-100'
                      }`}>
                        {isThisPlaying ? (
                          <Pause size={24} className="text-white" />
                        ) : (
                          <Play size={24} className="text-black ml-1" />
                        )}
                      </div>
                    </div>
                  )}
                  {isThisPlaying && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-accent/90 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                      <Volume2 size={10} className="animate-pulse" />
                      Playing
                    </div>
                  )}
                </div>
                <div className="mt-3 text-center">
                  <Link href={`/track/${track.id}`} className="block text-sm font-semibold text-text-primary truncate hover:underline">
                    {track.title}
                  </Link>
                  <p className="text-xs text-text-secondary truncate">
                    {track.artists.map(a => a.artist.name).join(', ')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live region for screen readers */}
      <div className="sr-only" aria-live="polite">
        Showing {activeTrack?.title} by {artistNames}
      </div>
    </section>
  );
}
