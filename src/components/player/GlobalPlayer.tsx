'use client';

import { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Howl } from 'howler';
import { ListMusic, ChevronUp } from 'lucide-react';
import { usePlayerStore } from '@/stores/playerStore';
import { useQueueStore } from '@/stores/queueStore';
import { fastIpfsUrl } from '@/lib/fast-ipfs';
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
    pendingSeek, clearPendingSeek,
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

  // ─── Create / tear down the Howl when the track changes ───
  //
  // The body of this effect ONLY creates the Howl. It does NOT call
  // `howl.play()` - that's the job of the play/pause-sync effect below.
  // Doing it here used to race with the sync effect: both could call
  // play() on the same Howl in quick succession, and with html5: true
  // Howler would register two starts → audible double playback.
  useEffect(() => {
    if (!currentTrack?.audioUrl) return;

    // Make sure we don't have a stale Howl (or stale fallback Howl from a
    // prior onloaderror) still hanging around with audio attached.
    if (howlRef.current) {
      howlRef.current.unload();
      howlRef.current = null;
    }

    const fastUrl = fastIpfsUrl(currentTrack.audioUrl);
    const howl = new Howl({
      // html5: true → streams as it downloads (plays in ~200ms even for large files).
      src: [fastUrl],
      html5: true,
      preload: true,
      xhr: { withCredentials: false },
      volume: isMuted ? 0 : volume,
      onload: () => {
        setDuration(howl.duration());
        setIsLoading(false);
        const pending = usePlayerStore.getState().pendingSeek;
        if (pending != null && pending > 0 && pending < 1) {
          howl.seek(pending * howl.duration());
          setProgress(pending);
          clearPendingSeek();
        }
      },
      // ── Howler → store sync (two-way) ──
      // The store is the "should we be playing" intent. Howler is the
      // "are we actually playing" truth. They can diverge in cases the
      // user doesn't control: browser autoplay block, background-tab
      // auto-pause, end of queue, network stall. When that happens the
      // play/pause button shows the wrong icon. Push Howler's state
      // back to the store so the UI always reflects reality.
      onplay: () => {
        setIsLoading(false);
        resume();
        animFrameRef.current = requestAnimationFrame(updateProgress);
      },
      onpause: () => {
        cancelAnimationFrame(animFrameRef.current);
        pause();
      },
      onend: () => {
        cancelAnimationFrame(animFrameRef.current);
        if (repeatMode === 'one') {
          howl.seek(0);
          howl.play();
        } else {
          // Try to advance to the next queued track. If the queue is empty,
          // explicitly mark the store paused so the play button flips back
          // to its play-state icon (otherwise it'd show "pause" forever).
          const nextTrack = useQueueStore.getState().queue[0];
          if (nextTrack) {
            handleNext();
          } else {
            pause();
            setProgress(0);
          }
        }
      },
      onloaderror: () => {
        setIsLoading(false);
        // Fall back to the raw IPFS URL (in case dweb.link rejects the CID).
        // We do call fallback.play() directly here when isPlaying, because
        // the sync effect below has already run for this track and won't
        // fire again for the swapped Howl.
        if (fastUrl !== currentTrack.audioUrl) {
          const fallback = new Howl({
            src: [currentTrack.audioUrl!],
            html5: true,
            volume: isMuted ? 0 : volume,
            onload: () => { setDuration(fallback.duration()); setIsLoading(false); },
            onplay: () => { setIsLoading(false); resume(); animFrameRef.current = requestAnimationFrame(updateProgress); },
            onpause: () => { cancelAnimationFrame(animFrameRef.current); pause(); },
            onend: () => {
              cancelAnimationFrame(animFrameRef.current);
              if (repeatMode === 'one') {
                fallback.seek(0);
                fallback.play();
              } else if (useQueueStore.getState().queue[0]) {
                handleNext();
              } else {
                pause();
                setProgress(0);
              }
            },
            onloaderror: () => { setIsLoading(false); pause(); },
          });
          // Make sure any earlier Howl we set into the ref is fully torn
          // down before swapping in the fallback.
          if (howlRef.current && howlRef.current !== fallback) {
            howlRef.current.unload();
          }
          howlRef.current = fallback;
          if (usePlayerStore.getState().isPlaying) {
            fallback.play();
          }
        }
      },
    });

    howlRef.current = howl;

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
      // Unload whatever is *currently* in the ref (the original Howl OR a
      // fallback that onloaderror swapped in), not the closure-captured
      // original. Then null out the ref so the next effect run can't see
      // a dead instance.
      if (howlRef.current) {
        howlRef.current.unload();
        howlRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.id]);

  // ─── Single play/pause sync ───
  //
  // This is the ONLY place we call howl.play() for the primary Howl. It
  // fires when isPlaying flips OR when the track changes (so the freshly
  // created Howl from effect 1 above gets played here, never in effect 1's
  // body - eliminating the double-play race).
  useEffect(() => {
    const howl = howlRef.current;
    if (!howl) return;
    if (isPlaying && !howl.playing()) {
      howl.play();
    } else if (!isPlaying && howl.playing()) {
      howl.pause();
    }
  }, [isPlaying, currentTrack?.id]);

  // Sync volume
  useEffect(() => {
    if (!howlRef.current) return;
    howlRef.current.volume(isMuted ? 0 : volume);
  }, [volume, isMuted]);

  // ─── Multi-tab coordination ───
  //
  // When the user opens the same site in two tabs and presses play in one,
  // the other tab would otherwise keep its own audio running - double
  // playback. We use BroadcastChannel to broadcast "this tab is now the
  // playback owner"; every other tab receiving that message pauses itself.
  //
  // Two important correctness details:
  //
  // 1. SAME instance for send + listen. Per spec, a BroadcastChannel does
  //    NOT receive messages from ITSELF - but it DOES receive messages from
  //    other BroadcastChannel instances in the same tab. Earlier we created
  //    a separate channel for the sender effect, which meant the listener
  //    in the same tab heard our own "claim" and paused us immediately -
  //    so pressing play looked like "music player not working". Fix:
  //    keep one channel in a ref, reuse it for both directions.
  //
  // 2. tabId guard. Defensive: we still tag our messages with a stable
  //    per-tab id and ignore messages whose tabId matches our own - covers
  //    any edge cases where multiple channel instances exist (StrictMode
  //    double-mount, future refactors, etc.).
  //
  // No-op in environments without BroadcastChannel (older Safari, SSR).
  const tabIdRef = useRef<string>('');
  if (!tabIdRef.current && typeof window !== 'undefined') {
    tabIdRef.current = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') return;
    const channel = new BroadcastChannel('fatp-player-leader');
    channel.onmessage = (event) => {
      const data = event.data;
      if (!data) return;
      if (data.tabId === tabIdRef.current) return; // ignore self
      if (data.type === 'claim' && usePlayerStore.getState().isPlaying) {
        pause();
      }
    };
    channelRef.current = channel;
    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, [pause]);

  // Claim playback ownership whenever this tab transitions to playing.
  // Reuses the channel above so the spec's same-instance exclusion applies
  // (and we don't pause ourselves).
  useEffect(() => {
    if (!isPlaying) return;
    const ch = channelRef.current;
    if (!ch) return;
    ch.postMessage({ type: 'claim', tabId: tabIdRef.current, at: Date.now() });
  }, [isPlaying]);

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
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-30 glass border-t border-border/60"
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
                {currentTrack.title} <span className="text-text-secondary font-normal">- {artistNames}</span>
              </p>
            </div>
            <VolumeControl
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={setVolume}
              onToggleMute={toggleMute}
              iconOnly
            />
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
