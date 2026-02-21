'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Track } from '@/types/track';

interface CoverFlowProps {
  tracks: Track[];
  onSelect?: (track: Track) => void;
}

export function CoverFlow({ tracks, onSelect }: CoverFlowProps) {
  const [activeIndex, setActiveIndex] = useState(Math.floor(tracks.length / 2));
  const containerRef = useRef<HTMLDivElement>(null);
  const dragX = useMotionValue(0);

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
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, goTo]);

  if (tracks.length === 0) return null;

  const activeTrack = tracks[activeIndex];
  const artistNames = activeTrack?.artists.map(a => a.artist.name).join(', ');

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

              if (absOffset > 3) return null;

              return (
                <motion.div
                  key={track.id}
                  role="option"
                  aria-selected={isActive}
                  aria-label={`${track.title} by ${track.artists.map(a => a.artist.name).join(', ')}`}
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
                      className="relative w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] rounded-xl overflow-hidden shadow-2xl"
                    >
                      <Image
                        src={track.coverImage}
                        alt={`${track.title} — album cover`}
                        fill
                        className="object-cover"
                        sizes="280px"
                        priority={absOffset <= 1}
                      />
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

        {/* Navigation arrows */}
        <div className="flex items-center justify-center gap-4 mt-2">
          <button
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors disabled:opacity-30 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Previous album"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Track info */}
          <div className="text-center min-w-[200px]">
            <Link href={`/track/${activeTrack?.id}`} className="block text-base font-semibold text-text-primary hover:underline">
              {activeTrack?.title}
            </Link>
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

      {/* Mobile: simplified horizontal scroll */}
      <div className="sm:hidden">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-4 scrollbar-none">
          {tracks.map((track, i) => (
            <Link
              key={track.id}
              href={`/track/${track.id}`}
              className="snap-center shrink-0 w-[260px]"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={track.coverImage}
                  alt={`${track.title} — album cover`}
                  fill
                  className="object-cover"
                  sizes="260px"
                  priority={i < 2}
                />
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm font-semibold text-text-primary truncate">{track.title}</p>
                <p className="text-xs text-text-secondary truncate">
                  {track.artists.map(a => a.artist.name).join(', ')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Live region for screen readers */}
      <div className="sr-only" aria-live="polite">
        Showing {activeTrack?.title} by {artistNames}
      </div>
    </section>
  );
}
