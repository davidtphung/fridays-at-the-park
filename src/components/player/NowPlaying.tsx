'use client';

import Image from 'next/image';
import { X, ChevronDown } from 'lucide-react';
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

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-0 z-50 bg-bg-primary flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Now playing"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Close now playing"
        >
          <ChevronDown size={24} />
        </button>
        <p className="text-xs text-text-secondary uppercase tracking-wider font-medium">Now Playing</p>
        <div className="w-[44px]" />
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
