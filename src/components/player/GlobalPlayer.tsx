'use client';

import { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Howl } from 'howler';
import { ListMusic, ChevronUp } from 'lucide-react';
import { usePlayerStore } from '@/stores/playerStore';
import { useQueueStore } from '@/stores/queueStore';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { PlayerControls } from './PlayerControls';
import { NowPlaying } from './NowPlaying';
import { QueueDrawer } from './QueueDrawer';
import { motion, AnimatePresence } from 'framer-motion';

export function GlobalPlayer() {
  const {
    currentTrack, isPlaying, progress, duration, volume, isMuted,
    isExpanded, repeatMode, isShuffled, isLoading,
    pause, resume, togglePlay, setProgress, setDuration,
    setVolume, toggleMute, toggleExpanded, setExpanded,
    cycleRepeat, toggleShuffle, setIsLoading, play,
  } = usePlayerStore();

  const { getNext, getPrevious, addToHistory, isOpen: isQueueOpen, toggleOpen: toggleQueue } = useQueueStore();

  const howlRef = useRef<Howl | null>(null);
  const animFrameRef = useRef<number>(0);

  // Update progress via requestAnimationFrame
  const updateProgress = useCallback(() => {
    if (howlRef.current && howlRef.current.playing()) {
      const seek = howlRef.current.seek() as number;
      const dur = howlRef.current.duration();
      if (dur > 0) {
        setProgress(seek / dur);
      }
    }
    animFrameRef.current = requestAnimationFrame(updateProgress);
  }, [setProgress]);

  // Create/destroy Howl when track changes
  useEffect(() => {
    if (!currentTrack?.audioUrl) return;

    // Destroy previous
    if (howlRef.current) {
      howlRef.current.unload();
    }

    const howl = new Howl({
      src: [currentTrack.audioUrl],
      html5: true,
      volume: isMuted ? 0 : volume,
      onload: () => {
        setDuration(howl.duration());
        setIsLoading(false);
      },
      onplay: () => {
        animFrameRef.current = requestAnimationFrame(updateProgress);
      },
      onpause: () => {
        cancelAnimationFrame(animFrameRef.current);
      },
      onend: () => {
        cancelAnimationFrame(animFrameRef.current);
        if (repeatMode === 'one') {
          howl.seek(0);
          howl.play();
        } else {
          handleNext();
        }
      },
      onloaderror: () => {
        setIsLoading(false);
      },
    });

    howlRef.current = howl;
    howl.play();

    // MediaSession API
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artists.map(a => a.artist.name).join(', '),
        artwork: currentTrack.coverImage ? [{ src: currentTrack.coverImage, sizes: '512x512', type: 'image/jpeg' }] : [],
      });
      navigator.mediaSession.setActionHandler('play', () => resume());
      navigator.mediaSession.setActionHandler('pause', () => pause());
      navigator.mediaSession.setActionHandler('previoustrack', () => handlePrevious());
      navigator.mediaSession.setActionHandler('nexttrack', () => handleNext());
    }

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      howl.unload();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.id]);

  // Sync play/pause state
  useEffect(() => {
    if (!howlRef.current) return;
    if (isPlaying && !howlRef.current.playing()) {
      howlRef.current.play();
    } else if (!isPlaying && howlRef.current.playing()) {
      howlRef.current.pause();
    }
  }, [isPlaying]);

  // Sync volume
  useEffect(() => {
    if (!howlRef.current) return;
    howlRef.current.volume(isMuted ? 0 : volume);
  }, [volume, isMuted]);

  const handleSeek = useCallback((newProgress: number) => {
    if (!howlRef.current) return;
    const dur = howlRef.current.duration();
    howlRef.current.seek(newProgress * dur);
    setProgress(newProgress);
  }, [setProgress]);

  const handleNext = useCallback(() => {
    if (currentTrack) addToHistory(currentTrack);
    const next = getNext();
    if (next) play(next);
  }, [currentTrack, addToHistory, getNext, play]);

  const handlePrevious = useCallback(() => {
    // If more than 3 seconds in, restart; otherwise go to previous
    if (howlRef.current && (howlRef.current.seek() as number) > 3) {
      howlRef.current.seek(0);
      setProgress(0);
      return;
    }
    const prev = getPrevious();
    if (prev) play(prev);
  }, [getPrevious, play, setProgress]);

  if (!currentTrack) return null;

  const artistNames = currentTrack.artists.map(a => a.artist.name).join(', ');

  return (
    <>
      {/* Now Playing expanded view */}
      <AnimatePresence>
        {isExpanded && (
          <NowPlaying
            track={currentTrack}
            isPlaying={isPlaying}
            progress={progress}
            duration={duration}
            repeatMode={repeatMode}
            isShuffled={isShuffled}
            onPlayPause={togglePlay}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSeek={handleSeek}
            onToggleShuffle={toggleShuffle}
            onCycleRepeat={cycleRepeat}
            onClose={() => setExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Queue drawer */}
      <QueueDrawer />

      {/* Player bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-30 bg-player-bg/95 backdrop-blur-xl border-t border-border"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        role="complementary"
        aria-label="Audio player"
      >
        {/* Mobile progress bar (thin, at top of player) */}
        <div className="md:hidden">
          <ProgressBar progress={progress} duration={duration} onSeek={handleSeek} compact />
        </div>

        <div className="max-w-[1280px] mx-auto px-3 sm:px-4">
          {/* Desktop layout */}
          <div className="hidden md:flex items-center gap-4 h-[72px]">
            {/* Track info */}
            <div className="flex items-center gap-3 w-[240px] shrink-0">
              <button onClick={toggleExpanded} className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 group" aria-label="Expand player">
                <Image src={currentTrack.coverImage} alt={`${currentTrack.title} cover art`} fill className="object-cover" sizes="48px" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <ChevronUp size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
              <div className="min-w-0">
                <Link href={`/track/${currentTrack.id}`} className="block text-sm font-medium text-text-primary truncate hover:underline">
                  {currentTrack.title}
                </Link>
                <p className="text-xs text-text-secondary truncate">{artistNames}</p>
              </div>
            </div>

            {/* Center controls */}
            <div className="flex-1 flex flex-col items-center gap-1 max-w-xl">
              <PlayerControls
                isPlaying={isPlaying}
                repeatMode={repeatMode}
                isShuffled={isShuffled}
                onPlayPause={togglePlay}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onToggleShuffle={toggleShuffle}
                onCycleRepeat={cycleRepeat}
                compact
              />
              <ProgressBar progress={progress} duration={duration} onSeek={handleSeek} />
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2 w-[200px] justify-end shrink-0">
              <VolumeControl
                volume={volume}
                isMuted={isMuted}
                onVolumeChange={setVolume}
                onToggleMute={toggleMute}
              />
              <button
                onClick={toggleQueue}
                className={`p-2 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
                  isQueueOpen ? 'text-accent' : 'text-text-secondary hover:text-text-primary'
                }`}
                aria-label="Toggle queue"
                aria-expanded={isQueueOpen}
              >
                <ListMusic size={18} />
              </button>
            </div>
          </div>

          {/* Mobile layout */}
          <div className="flex md:hidden items-center gap-3 h-14">
            <button onClick={toggleExpanded} className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0" aria-label="Expand player">
              <Image src={currentTrack.coverImage} alt={`${currentTrack.title} cover art`} fill className="object-cover" sizes="40px" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {currentTrack.title} <span className="text-text-secondary font-normal">— {artistNames}</span>
              </p>
            </div>
            <PlayerControls
              isPlaying={isPlaying}
              repeatMode={repeatMode}
              isShuffled={isShuffled}
              onPlayPause={togglePlay}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onToggleShuffle={toggleShuffle}
              onCycleRepeat={cycleRepeat}
              compact
            />
          </div>
        </div>

        {/* Live region for screen readers */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {isPlaying ? `Now playing: ${currentTrack.title} by ${artistNames}` : 'Paused'}
        </div>
      </motion.div>
    </>
  );
}
