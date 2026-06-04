'use client';

import { useRef, useState, useCallback } from 'react';
import { formatDuration } from '@/lib/format';

interface ProgressBarProps {
  progress: number;
  duration: number;
  onSeek: (progress: number) => void;
  compact?: boolean;
}

/**
 * Scrub-mode progress bar.
 *
 * While the user is actively dragging, we track a LOCAL `scrubProgress` for
 * instant visual feedback but DO NOT call `onSeek` - calling it on every
 * pointer move fires `howl.seek()` per frame, causing the HTMLAudioElement
 * (html5: true) to re-buffer and stutter. We commit exactly once on pointer
 * up. Result: smooth Apple-Music-style scrub with the audio jumping once at
 * the end of the gesture.
 */
export function ProgressBar({ progress, duration, onSeek, compact = false }: ProgressBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [scrubProgress, setScrubProgress] = useState<number | null>(null);
  const isScrubbing = scrubProgress !== null;

  const calculateProgress = useCallback((clientX: number) => {
    if (!barRef.current) return 0;
    const rect = barRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    return Math.max(0, Math.min(1, x / rect.width));
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setScrubProgress(calculateProgress(e.clientX));
    },
    [calculateProgress],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isScrubbing) return;
      setScrubProgress(calculateProgress(e.clientX));
    },
    [calculateProgress, isScrubbing],
  );

  const commit = useCallback(() => {
    if (scrubProgress !== null) {
      onSeek(scrubProgress);
      setScrubProgress(null);
    }
  }, [scrubProgress, onSeek]);

  const effectiveProgress = scrubProgress ?? progress;
  const currentTime = effectiveProgress * duration;
  const percentage = effectiveProgress * 100;

  return (
    <div className={`flex items-center gap-2 ${compact ? '' : 'w-full'}`}>
      {!compact && (
        <span className="text-xs text-text-secondary tabular-nums min-w-[36px] text-right">
          {formatDuration(currentTime)}
        </span>
      )}
      <div
        ref={barRef}
        role="slider"
        aria-label="Track progress"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={Math.floor(currentTime)}
        aria-valuetext={`${formatDuration(currentTime)} of ${formatDuration(duration)}`}
        tabIndex={0}
        className={`relative flex-1 group cursor-pointer ${compact ? 'h-1' : 'h-1.5 hover:h-2'} transition-all`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={commit}
        onPointerCancel={commit}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') onSeek(Math.min(1, progress + 10 / duration));
          if (e.key === 'ArrowLeft') onSeek(Math.max(0, progress - 10 / duration));
        }}
      >
        {/* Track */}
        <div className="absolute inset-0 rounded-full bg-border overflow-hidden">
          {/* Filled - no width transition while scrubbing so the thumb tracks
              the finger 1:1. Re-enable the transition when not scrubbing for
              the gentle catch-up after the rAF progress tick lands. */}
          <div
            className={`h-full bg-accent rounded-full ${isScrubbing ? '' : 'transition-[width] duration-75'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {/* Thumb - bigger + always visible while scrubbing for tactile feel,
            invisible-until-hover otherwise so the bar stays clean. */}
        {!compact && (
          <div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-accent shadow-md transition-all duration-150 ${
              isScrubbing
                ? 'w-4 h-4 opacity-100 ring-2 ring-accent/30'
                : 'w-3 h-3 opacity-0 group-hover:opacity-100 focus-within:opacity-100'
            }`}
            style={{ left: `${percentage}%` }}
          />
        )}
      </div>
      {!compact && (
        <span className="text-xs text-text-secondary tabular-nums min-w-[36px]">
          {formatDuration(duration)}
        </span>
      )}
    </div>
  );
}
