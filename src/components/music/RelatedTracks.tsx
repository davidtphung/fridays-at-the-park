'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Track } from '@/types/track';
import { TrackCard } from './TrackCard';

interface RelatedTracksProps {
  tracks: Track[];
  title?: string;
}

export function RelatedTracks({ tracks, title = 'Related Tracks' }: RelatedTracksProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (tracks.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = direction === 'left' ? -300 : 300;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        <div className="flex gap-1">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-none pb-2"
      >
        {tracks.map(track => (
          <div key={track.id} className="w-[180px] shrink-0">
            <TrackCard track={track} />
          </div>
        ))}
      </div>
    </section>
  );
}
