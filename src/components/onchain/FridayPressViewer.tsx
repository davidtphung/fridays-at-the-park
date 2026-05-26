'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Track } from '@/types/track';
import { fastIpfsUrl } from '@/lib/fast-ipfs';

interface FridayPressViewerProps {
  /** All Friday Press tracks — used so the viewer can navigate between issues. */
  tracks: Track[];
  /** ID of the currently-open issue, or null when the viewer is closed. */
  openId: string | null;
  onClose: () => void;
  onChangeId: (id: string) => void;
}

/**
 * Full-bleed PDF viewer for FRIDAY PRESS issues. Renders an iframe pointing
 * at the IPFS-hosted PDF (via dweb.link gateway) so the browser's native
 * PDF renderer handles every page — pagination, zoom, search, print, all
 * for free.
 *
 * Why iframe + native renderer instead of pdf.js: pdf.js would add ~200KB
 * to the bundle for a feature only used in this modal, and most modern
 * browsers (Chrome, Edge, Safari, Firefox) ship a great native PDF
 * viewer that handles touch gestures and accessibility correctly. The
 * iframe's `sandbox` keeps the PDF context isolated from our origin.
 *
 * The CSP allows `frame-src https://dweb.link https://*.ipfs.dweb.link`
 * (set in next.config.ts) so the iframe is permitted to load.
 */
export function FridayPressViewer({ tracks, openId, onClose, onChangeId }: FridayPressViewerProps) {
  const currentIndex = tracks.findIndex((t) => t.id === openId);
  const current = currentIndex >= 0 ? tracks[currentIndex] : null;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < tracks.length - 1;

  // Keyboard nav: ESC closes, ←/→ moves between issues.
  useEffect(() => {
    if (!current) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onChangeId(tracks[currentIndex - 1].id);
      if (e.key === 'ArrowRight' && hasNext) onChangeId(tracks[currentIndex + 1].id);
    };
    window.addEventListener('keydown', onKey);
    // Lock body scroll while the viewer is open.
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [current, currentIndex, hasPrev, hasNext, onChangeId, onClose, tracks]);

  if (!current) return null;
  // PDF lives in track.videoUrl (videoMime: 'application/pdf').
  // fastIpfsUrl rewrites pinata → dweb.link if needed.
  const pdfUrl = fastIpfsUrl(current.videoUrl || '');
  // `#view=FitH` is a PDF Open Parameter most native renderers respect —
  // fits the page width to the viewport for the first paint.
  const iframeSrc = pdfUrl ? `${pdfUrl}#view=FitH&toolbar=1&navpanes=0` : '';

  return (
    <AnimatePresence>
      <motion.div
        key={openId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label={`FRIDAY PRESS viewer: ${current.title}`}
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-white/10 shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1 pl-1 pr-3 py-2 -ml-1 rounded-lg text-white/80 hover:text-white active:scale-[0.96] transition-all min-h-[44px]"
            aria-label="Close viewer"
          >
            <ChevronLeft size={22} aria-hidden="true" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="min-w-0 flex-1 text-center">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-accent">
              FRIDAY PRESS · {currentIndex + 1} of {tracks.length}
            </p>
            <p className="text-sm sm:text-base font-semibold text-white truncate">{current.title}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {/* Direct download / open in new tab */}
            <a
              href={pdfUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Download PDF"
            >
              <Download size={18} />
            </a>
            {current.mintUrl && (
              <a
                href={current.mintUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-accent hover:text-bg-primary hover:bg-accent text-xs font-semibold transition-colors min-h-[40px]"
                aria-label="Collect on Zora"
              >
                <ExternalLink size={14} aria-hidden="true" />
                Collect
              </a>
            )}
            <button
              onClick={onClose}
              className="flex items-center justify-center w-10 h-10 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Pager — prev / next between issues */}
        <div className="flex items-center justify-center gap-2 px-4 py-2 border-b border-white/10 shrink-0">
          <button
            onClick={() => hasPrev && onChangeId(tracks[currentIndex - 1].id)}
            disabled={!hasPrev}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-[36px]"
            aria-label="Previous issue"
          >
            <ChevronLeft size={14} aria-hidden="true" />
            {hasPrev ? tracks[currentIndex - 1].title : 'Prev'}
          </button>
          <button
            onClick={() => hasNext && onChangeId(tracks[currentIndex + 1].id)}
            disabled={!hasNext}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-[36px]"
            aria-label="Next issue"
          >
            {hasNext ? tracks[currentIndex + 1].title : 'Next'}
            <ChevronRight size={14} aria-hidden="true" />
          </button>
        </div>

        {/* PDF iframe — flex-1 to take all remaining height */}
        <div className="flex-1 relative bg-[#525659]">
          {pdfUrl ? (
            <iframe
              key={current.id}
              src={iframeSrc}
              title={`${current.title} — PDF`}
              className="absolute inset-0 w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-downloads allow-popups"
              referrerPolicy="strict-origin-when-cross-origin"
              loading="eager"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/60 text-sm">
              No PDF source.
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
