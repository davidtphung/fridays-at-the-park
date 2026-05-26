'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink } from 'lucide-react';
import { Track } from '@/types/track';
import { FridayPressViewer } from './FridayPressViewer';

interface FridayPressGridProps {
  tracks: Track[];
}

/**
 * Grid of FRIDAY PRESS issues. Each card shows the issue cover with a
 * "View Issue" overlay; tapping opens the full-bleed FridayPressViewer
 * which iframes the PDF and lets the user read every page natively.
 *
 * Cards keep the "Collect on Zora" link visible below the cover so
 * users can mint without entering the viewer if they already know what
 * they want.
 */
export function FridayPressGrid({ tracks }: FridayPressGridProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tracks.map((track) => {
          const artistNames = track.artists.map((a) => a.artist.name).join(', ');
          return (
            <motion.div
              key={track.id}
              whileTap={{ scale: 0.99 }}
              className="bg-card-bg border border-border rounded-2xl overflow-hidden hover:border-accent/40 transition-colors group"
            >
              <button
                type="button"
                onClick={() => setOpenId(track.id)}
                className="block w-full relative aspect-[4/5] sm:aspect-[3/4] bg-bg-tertiary text-left"
                aria-label={`View ${track.title} — full PDF`}
              >
                <Image
                  src={track.coverImage}
                  alt={`${track.title} — cover`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Subtle bottom gradient for legibility of the View badge */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />
                {/* "View Issue" CTA — always-visible at the bottom of the cover */}
                <div className="absolute inset-x-0 bottom-0 p-4 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-widest font-semibold text-accent">
                      FRIDAY PRESS
                    </p>
                    <p className="text-white font-bold text-sm sm:text-base truncate drop-shadow">
                      {track.title}
                    </p>
                  </div>
                  <div className="shrink-0 w-10 h-10 rounded-full bg-accent text-bg-primary flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <BookOpen size={16} aria-hidden="true" />
                  </div>
                </div>
              </button>

              {/* Meta row */}
              <div className="p-3 sm:p-4 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-text-secondary line-clamp-2 leading-snug">
                    {track.description}
                  </p>
                  <p className="text-[11px] text-text-secondary mt-2 truncate">{artistNames}</p>
                </div>
                {track.mintUrl && (
                  <a
                    href={track.mintUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-bg-tertiary text-text-primary text-xs font-medium hover:bg-accent hover:text-bg-primary transition-colors min-h-[32px]"
                    aria-label="Collect on Zora"
                  >
                    <ExternalLink size={12} aria-hidden="true" />
                    Collect
                  </a>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <FridayPressViewer
        tracks={tracks}
        openId={openId}
        onClose={() => setOpenId(null)}
        onChangeId={(id) => setOpenId(id)}
      />
    </>
  );
}
