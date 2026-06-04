'use client';

import { useEffect, useRef } from 'react';

interface HlsVideoProps {
  /** HLS (.m3u8) source - preferred for fast adaptive streaming. */
  hlsUrl?: string;
  /** Fallback progressive source (e.g. IPFS .mp4/.mov) when no HLS. */
  fallbackUrl?: string;
  poster?: string;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  'aria-label'?: string;
}

/**
 * Video element that streams via HLS when available.
 *
 * Why: Zora content coins ship a Cloudflare Stream HLS manifest that starts
 * playing almost instantly and adapts quality to the connection. The raw IPFS
 * source for the same coin is a large QuickTime .mov served from a public
 * gateway - slow to first frame on a cold cache. We prefer HLS and only fall
 * back to the progressive file when no manifest exists (e.g. the older
 * music-video drops on other contracts).
 *
 * Playback path:
 *  1. hlsUrl + native HLS support (Safari / iOS)  -> set src directly.
 *  2. hlsUrl + MSE browser (Chrome / Firefox)     -> lazy-load hls.js, attach.
 *  3. no hlsUrl                                    -> fallbackUrl on the element.
 *
 * hls.js is dynamically imported, so it only ships to users who actually play
 * an HLS video on a non-Safari browser - zero cost to everyone else.
 */
export function HlsVideo({
  hlsUrl,
  fallbackUrl,
  poster,
  className,
  controls = true,
  autoPlay = false,
  muted = false,
  loop = false,
  preload = 'metadata',
  'aria-label': ariaLabel,
}: HlsVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // No HLS - use the progressive fallback directly.
    if (!hlsUrl) {
      if (fallbackUrl && video.src !== fallbackUrl) video.src = fallbackUrl;
      return;
    }

    // Native HLS (Safari, iOS, some smart TVs).
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl;
      return;
    }

    // MSE path - lazy-load hls.js.
    let destroyed = false;
    // Use a loose type; hls.js ships its own types but we import dynamically.
    let hls: { destroy: () => void } | null = null;
    import('hls.js')
      .then(({ default: Hls }) => {
        if (destroyed || !videoRef.current) return;
        if (Hls.isSupported()) {
          const instance = new Hls({ enableWorker: true, lowLatencyMode: false });
          hls = instance;
          instance.loadSource(hlsUrl);
          instance.attachMedia(videoRef.current);
          instance.on(Hls.Events.ERROR, (_evt, data) => {
            // On fatal error, fall back to the progressive source if we have one.
            if (data.fatal && fallbackUrl && videoRef.current) {
              instance.destroy();
              hls = null;
              videoRef.current.src = fallbackUrl;
            }
          });
        } else if (fallbackUrl) {
          videoRef.current.src = fallbackUrl;
        }
      })
      .catch(() => {
        if (!destroyed && videoRef.current && fallbackUrl) videoRef.current.src = fallbackUrl;
      });

    return () => {
      destroyed = true;
      if (hls) hls.destroy();
    };
  }, [hlsUrl, fallbackUrl]);

  return (
    <video
      ref={videoRef}
      poster={poster}
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline
      preload={preload}
      className={className}
      aria-label={ariaLabel}
    />
  );
}
