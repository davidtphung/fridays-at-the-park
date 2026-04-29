'use client';

import { useRef, useCallback } from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  iconOnly?: boolean;
}

export function VolumeControl({ volume, isMuted, onVolumeChange, onToggleMute, iconOnly = false }: VolumeControlProps) {
  const barRef = useRef<HTMLDivElement>(null);

  const calculateVolume = useCallback((clientX: number) => {
    if (!barRef.current) return 0;
    const rect = barRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    return Math.max(0, Math.min(1, x / rect.width));
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const newVolume = calculateVolume(e.clientX);
    onVolumeChange(newVolume);
  }, [calculateVolume, onVolumeChange]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (e.buttons === 0) return;
    const newVolume = calculateVolume(e.clientX);
    onVolumeChange(newVolume);
  }, [calculateVolume, onVolumeChange]);

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const displayVolume = isMuted ? 0 : volume;

  if (iconOnly) {
    return (
      <button
        onClick={onToggleMute}
        className="p-1.5 rounded-md text-text-secondary hover:text-text-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        <VolumeIcon size={18} />
      </button>
    );
  }

  return (
    <div className="hidden sm:flex items-center gap-2">
      <button
        onClick={onToggleMute}
        className="p-1.5 rounded-md text-text-secondary hover:text-text-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        <VolumeIcon size={18} />
      </button>
      <div
        ref={barRef}
        role="slider"
        aria-label="Volume"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(displayVolume * 100)}
        tabIndex={0}
        className="relative w-20 h-1.5 group cursor-pointer hover:h-2 transition-all"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') onVolumeChange(Math.min(1, volume + 0.05));
          if (e.key === 'ArrowLeft') onVolumeChange(Math.max(0, volume - 0.05));
        }}
      >
        <div className="absolute inset-0 rounded-full bg-border overflow-hidden">
          <div
            className="h-full bg-text-secondary rounded-full"
            style={{ width: `${displayVolume * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
