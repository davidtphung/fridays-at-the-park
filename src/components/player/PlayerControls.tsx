'use client';

import { SkipBack, SkipForward, Play, Pause, Shuffle, Repeat, Repeat1 } from 'lucide-react';
import { RepeatMode } from '@/stores/playerStore';

interface PlayerControlsProps {
  isPlaying: boolean;
  repeatMode: RepeatMode;
  isShuffled: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleShuffle: () => void;
  onCycleRepeat: () => void;
  compact?: boolean;
}

export function PlayerControls({
  isPlaying,
  repeatMode,
  isShuffled,
  onPlayPause,
  onNext,
  onPrevious,
  onToggleShuffle,
  onCycleRepeat,
  compact = false,
}: PlayerControlsProps) {
  const RepeatIcon = repeatMode === 'one' ? Repeat1 : Repeat;

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={onPlayPause}
          className="p-2 rounded-full bg-text-primary text-bg-primary hover:opacity-90 transition-opacity min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
        </button>
        <button
          onClick={onNext}
          className="p-2 text-text-secondary hover:text-text-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Next track"
        >
          <SkipForward size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggleShuffle}
        className={`p-2 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
          isShuffled ? 'text-accent' : 'text-text-secondary hover:text-text-primary'
        }`}
        aria-label={`Shuffle ${isShuffled ? 'on' : 'off'}`}
        aria-pressed={isShuffled}
      >
        <Shuffle size={18} />
      </button>
      <button
        onClick={onPrevious}
        className="p-2 text-text-secondary hover:text-text-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Previous track"
      >
        <SkipBack size={20} />
      </button>
      <button
        onClick={onPlayPause}
        className="p-3 rounded-full bg-text-primary text-bg-primary hover:opacity-90 transition-opacity min-w-[48px] min-h-[48px] flex items-center justify-center"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-0.5" />}
      </button>
      <button
        onClick={onNext}
        className="p-2 text-text-secondary hover:text-text-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Next track"
      >
        <SkipForward size={20} />
      </button>
      <button
        onClick={onCycleRepeat}
        className={`p-2 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
          repeatMode !== 'off' ? 'text-accent' : 'text-text-secondary hover:text-text-primary'
        }`}
        aria-label={`Repeat: ${repeatMode}`}
      >
        <RepeatIcon size={18} />
      </button>
    </div>
  );
}
