'use client';

import { useRef, useCallback } from 'react';
import { formatDuration } from '@/lib/format';

interface ProgressBarProps {
  progress: number;
  duration: number;
  onSeek: (progress: number) => void;
  compact?: boolean;
}

export function ProgressBar({ progress, duration, onSeek, compact = false }: ProgressBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const calculateProgress = useCallback((clientX: number) => {
    if (!barRef.current) return 0;
    const rect = barRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    return Math.max(0, Math.min(1, x / rect.width));
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const newProgress = calculateProgress(e.clientX);
    onSeek(newProgress);
  }, [calculateProgress, onSeek]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const newProgress = calculateProgress(e.clientX);
    onSeek(newProgress);
  }, [calculateProgress, onSeek]);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const currentTime = progress * duration;
  const percentage = progress * 100;

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
        onPointerUp={handlePointerUp}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') onSeek(Math.min(1, progress + 10 / duration));
          if (e.key === 'ArrowLeft') onSeek(Math.max(0, progress - 10 / duration));
        }}
      >
        {/* Track */}
        <div className="absolute inset-0 rounded-full bg-border overflow-hidden">
          {/* Filled */}
          <div
            className="h-full bg-accent rounded-full transition-[width] duration-75"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {/* Thumb (visible on hover/focus) */}
        {!compact && (
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shadow-md"
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
