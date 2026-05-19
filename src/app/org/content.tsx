'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { usePlayerStore } from '@/stores/playerStore';

const ORG_URL = 'https://fridaysatthepark.org/';

/**
 * Full-bleed embed of fridaysatthepark.org so people can browse the org site
 * without leaving works.fridaysatthepark.org. fridaysatthepark.org is served by
 * Gamma — it sends no `X-Frame-Options` and no `frame-ancestors` CSP directive,
 * so iframe embedding works browser-side once we add the host to our own
 * `frame-src` allowlist in next.config.ts.
 *
 * Height: 100svh minus the sticky header (h-14 mobile / h-16 desktop ≈ 56–64 px)
 * minus the global player bar when a track is loaded (≈ 56 px mobile / 72 px
 * desktop). Falls back to `100vh` if the browser doesn't support `100svh`
 * (which would over-extend on mobile under the URL bar, but still works).
 */
export function ORGEmbed() {
  const [loaded, setLoaded] = useState(false);
  const hasTrack = usePlayerStore((s) => s.currentTrack !== null);

  // Header heights: 56 px (h-14, default) / 64 px (sm:h-16).
  // Player heights: 56 px on mobile (h-14) / 72 px on desktop (h-[72px]) when
  // a track is playing. We cancel <main>'s pb-[72px] via a -mb wrapper at the
  // page level so this iframe truly fills the visible viewport.
  const heightClasses = hasTrack
    ? 'h-[calc(100svh-56px-56px)] sm:h-[calc(100svh-64px-72px)]'
    : 'h-[calc(100svh-56px)] sm:h-[calc(100svh-64px)]';

  return (
    <div className={`relative w-full bg-bg-primary -mb-[72px] ${heightClasses}`}>
      {/* Skeleton shimmer while the iframe is fetching its first paint. */}
      {!loaded && (
        <div
          className="absolute inset-0 animate-shimmer flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <p className="text-text-secondary text-sm">Loading fridaysatthepark.org…</p>
        </div>
      )}

      <iframe
        src={ORG_URL}
        title="Fridays at the Park — Organization"
        onLoad={() => setLoaded(true)}
        loading="eager"
        // `allow-scripts` + `allow-same-origin` give the Gamma site enough to
        // run; `allow-popups` lets in-page links open new tabs; `allow-forms`
        // for any embed contact forms.
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 w-full h-full border-0"
      />

      {/* Accessible fallback: assistive tech can jump straight to the source
          site if the iframe doesn't render. Visually hidden until focused. */}
      <a
        href={ORG_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3 py-2 rounded-full glass border border-border/60 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors min-h-[36px]"
        aria-label="Open fridaysatthepark.org in a new tab"
      >
        <ExternalLink size={12} aria-hidden="true" />
        Open in new tab
      </a>
    </div>
  );
}

// Re-export with the old name so any external links / sitemaps still resolve.
export const ORGContent = ORGEmbed;
