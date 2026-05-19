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

  // Shared Apple-style transition for icon buttons — color crossfade + brief
  // tap scale that gives obvious feedback on touch without being chatty.
  const iconBtn = 'p-2 rounded-lg transition-all duration-150 active:scale-[0.9] min-w-[44px] min-h-[44px] flex items-center justify-center';
  const playBtn = 'rounded-full bg-text-primary text-bg-primary transition-all duration-150 hover:opacity-90 active:scale-[0.92] flex items-center justify-center';

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={onPlayPause}
          className={`${playBtn} p-2 min-w-[44px] min-h-[44px]`}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
        </button>
        <button
          onClick={onNext}
          className={`${iconBtn} text-text-secondary hover:text-text-primary`}
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
        className={`${iconBtn} ${isShuffled ? 'text-accent' : 'text-text-secondary hover:text-text-primary'}`}
        aria-label={`Shuffle ${isShuffled ? 'on' : 'off'}`}
        aria-pressed={isShuffled}
      >
        <Shuffle size={18} />
      </button>
      <button
        onClick={onPrevious}
        className={`${iconBtn} text-text-secondary hover:text-text-primary`}
        aria-label="Previous track"
      >
        <SkipBack size={20} />
      </button>
      <button
        onClick={onPlayPause}
        className={`${playBtn} p-3 min-w-[48px] min-h-[48px]`}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-0.5" />}
      </button>
      <button
        onClick={onNext}
        className={`${iconBtn} text-text-secondary hover:text-text-primary`}
        aria-label="Next track"
      >
        <SkipForward size={20} />
      </button>
      <button
        onClick={onCycleRepeat}
        className={`${iconBtn} ${repeatMode !== 'off' ? 'text-accent' : 'text-text-secondary hover:text-text-primary'}`}
        aria-label={`Repeat: ${repeatMode}`}
        aria-pressed={repeatMode !== 'off'}
      >
        <RepeatIcon size={18} />
      </button>
    </div>
  );
}
