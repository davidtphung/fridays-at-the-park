'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Track } from '@/types/track';
import { RepeatMode } from '@/stores/playerStore';
import { ProgressBar } from './ProgressBar';
import { PlayerControls } from './PlayerControls';
import { Waveform } from './Waveform';

interface NowPlayingProps {
  track: Track;
  isPlaying: boolean;
  progress: number;
  duration: number;
  repeatMode: RepeatMode;
  isShuffled: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (progress: number) => void;
  onToggleShuffle: () => void;
  onCycleRepeat: () => void;
  onClose: () => void;
}

export function NowPlaying({
  track, isPlaying, progress, duration, repeatMode, isShuffled,
  onPlayPause, onNext, onPrevious, onSeek, onToggleShuffle, onCycleRepeat, onClose,
}: NowPlayingProps) {
  const artistNames = track.artists.map(a => a.artist.name).join(', ');

  // Keyboard-accessible dismiss: ESC closes the expanded view, matching
  // Apple's "swipe down" affordance for Music's full-screen player.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-0 z-50 bg-bg-primary flex flex-col"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Now playing"
    >
      {/* Header — explicit Back button on the left, label centered. The
          left-pointing chevron + word "Back" reads as a navigation control
          (matches Apple Music + iOS HIG), while still collapsing the
          expanded view back to the mini player. */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <button
          onClick={onClose}
          className="flex items-center gap-1 pl-1 pr-3 py-2 -ml-1 rounded-lg text-text-secondary hover:text-text-primary active:scale-[0.96] transition-all min-h-[44px]"
          aria-label="Back to previous view"
        >
          <ChevronLeft size={24} aria-hidden="true" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <p className="text-xs text-text-secondary uppercase tracking-wider font-medium">Now Playing</p>
        <div className="w-[72px]" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-8 gap-6 max-w-lg mx-auto w-full">
        {/* Album art */}
        <motion.div
          layoutId={`cover-${track.id}`}
          className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden shadow-2xl"
        >
          <Image
            src={track.coverImage}
            alt={`${track.title} by ${artistNames} — album cover`}
            fill
            className="object-cover"
            sizes="320px"
            priority
          />
        </motion.div>

        {/* Track info */}
        <div className="text-center w-full">
          <h2 className="text-xl font-bold text-text-primary truncate">{track.title}</h2>
          <p className="text-sm text-text-secondary truncate">{artistNames}</p>
        </div>

        {/* Waveform */}
        <Waveform isPlaying={isPlaying} className="h-16 rounded-lg" />

        {/* Progress */}
        <div className="w-full">
          <ProgressBar progress={progress} duration={duration} onSeek={onSeek} />
        </div>

        {/* Controls */}
        <PlayerControls
          isPlaying={isPlaying}
          repeatMode={repeatMode}
          isShuffled={isShuffled}
          onPlayPause={onPlayPause}
          onNext={onNext}
          onPrevious={onPrevious}
          onToggleShuffle={onToggleShuffle}
          onCycleRepeat={onCycleRepeat}
        />

        {/* Credits */}
        {track.credits && (
          <div className="text-xs text-text-secondary text-center space-y-1 mt-2">
            {Object.entries(track.credits).map(([role, names]) => (
              <p key={role}>
                <span className="capitalize">{role}:</span>{' '}
                {Array.isArray(names) ? names.join(', ') : names}
              </p>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
