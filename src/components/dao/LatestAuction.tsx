'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wallet, ArrowUpRight } from 'lucide-react';

const DAO = {
  tokenAddress: '0x72b31421a462996f559ffb7fc5dfaca94e754d89',
  // Baseline known-good tokenId. Real live tokenId is resolved at runtime
  // by probing tokenURI(baseline + n) — see findLiveAuctionTokenId() below.
  baselineTokenId: 610,
  nounsBuilderBase:
    'https://nouns.build/dao/base/0x72b31421a462996f559ffb7fc5dfaca94e754d89',
};

interface TokenArtwork {
  name: string;
  image: string;
  description: string;
}

async function rpcCallTokenURI(tokenId: number): Promise<{ ok: boolean; meta?: TokenArtwork }> {
  const hexId = tokenId.toString(16).padStart(64, '0');
  try {
    const resp = await fetch('https://mainnet.base.org', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_call',
        params: [{ to: DAO.tokenAddress, data: '0xc87b56dd' + hexId }, 'latest'],
        id: 1,
      }),
    });
    const json = await resp.json();
    if (!json.result || json.error) return { ok: false };
    const raw = json.result.slice(2);
    if (raw.length < 128) return { ok: false };
    const length = parseInt(raw.slice(64, 128), 16);
    if (length === 0) return { ok: false };
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = parseInt(raw.slice(128 + i * 2, 130 + i * 2), 16);
    }
    const uri = new TextDecoder().decode(bytes);
    const prefix = 'data:application/json;base64,';
    if (!uri.startsWith(prefix)) return { ok: false };
    const meta = JSON.parse(atob(uri.slice(prefix.length)));
    return {
      ok: true,
      meta: { name: meta.name ?? '', image: meta.image ?? '', description: meta.description ?? '' },
    };
  } catch {
    return { ok: false };
  }
}

// Probe upward from a baseline tokenId in parallel to find the highest
// currently-minted token. Nouns Builder DAOs mint one auction token per
// cycle (usually 24 h) so this stays small in practice — only a handful
// of new IDs since `baselineTokenId` was last shipped. Stops on the first
// gap so we don't probe beyond the live edge.
async function findLiveAuctionTokenId(baseline: number, lookahead = 10): Promise<{
  tokenId: number;
  meta: TokenArtwork | null;
}> {
  const candidates = Array.from({ length: lookahead + 1 }, (_, i) => baseline + i);
  const results = await Promise.all(candidates.map((id) => rpcCallTokenURI(id)));
  // Find the highest contiguous tokenId that exists starting from baseline.
  // (Nouns Builder reserves some IDs for founders, but in practice the
  // public auction IDs are contiguous from a known point onward.)
  let highest = -1;
  let bestMeta: TokenArtwork | null = null;
  for (let i = 0; i < results.length; i++) {
    if (results[i].ok) {
      highest = candidates[i];
      bestMeta = results[i].meta ?? bestMeta;
    } else if (highest !== -1) {
      // First gap — auction edge found, stop.
      break;
    }
  }
  if (highest === -1) return { tokenId: baseline, meta: null };
  return { tokenId: highest, meta: bestMeta };
}

interface LatestAuctionProps {
  /** When 'card' (default), renders a full Live Auction card matching the
   *  /dao page styling. When 'compact', renders a small horizontal strip
   *  better suited for the home page. */
  variant?: 'card' | 'compact';
}

export function LatestAuction({ variant = 'card' }: LatestAuctionProps) {
  const [artwork, setArtwork] = useState<TokenArtwork | null>(null);
  const [tokenId, setTokenId] = useState<number>(DAO.baselineTokenId);

  useEffect(() => {
    let cancelled = false;
    findLiveAuctionTokenId(DAO.baselineTokenId).then(({ tokenId: id, meta }) => {
      if (cancelled) return;
      setTokenId(id);
      setArtwork(meta);
    });
    return () => { cancelled = true; };
  }, []);

  const nounsBuilderUrl = `${DAO.nounsBuilderBase}/${tokenId}`;

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 p-3 sm:p-4 rounded-2xl bg-card-bg border border-border hover:border-accent/30 transition-colors"
      >
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-bg-tertiary">
          {artwork?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={artwork.image}
              alt={artwork.name}
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
              decoding="async"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-text-secondary text-xs">…</div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-widest font-semibold text-accent">Live Auction</p>
          <p className="font-bold text-text-primary text-base sm:text-lg truncate">
            {artwork?.name || `the park dao #${tokenId}`}
          </p>
          <Link href="/dao" className="text-xs text-text-secondary hover:text-text-primary transition-colors">
            View DAO details →
          </Link>
        </div>
        <a
          href={nounsBuilderUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-accent text-bg-primary rounded-full font-semibold text-xs sm:text-sm transition-all hover:bg-accent-hover active:scale-95 min-h-[40px]"
          aria-label="Bid on Nouns Builder"
        >
          <Wallet size={14} aria-hidden="true" />
          Bid
          <ArrowUpRight size={12} aria-hidden="true" />
        </a>
      </motion.div>
    );
  }

  // Default 'card' variant — kept for /dao to reuse in the future, identical
  // shape to the existing inline card in /dao/content.tsx.
  return (
    <div className="bg-card-bg border border-border rounded-xl p-6">
      <p className="text-xs uppercase tracking-widest text-accent mb-2">Live Auction</p>
      <div className="aspect-square max-w-[280px] mx-auto bg-bg-tertiary rounded-xl mb-6 overflow-hidden border border-border relative">
        {artwork?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={artwork.image}
            alt={artwork.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-text-secondary text-sm">Loading…</p>
          </div>
        )}
      </div>
      {artwork?.name && (
        <p className="text-center text-text-primary font-semibold mb-4">{artwork.name}</p>
      )}
      <div className="flex items-center justify-center">
        <a
          href={nounsBuilderUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-3.5 bg-accent text-bg-primary rounded-lg font-semibold hover:bg-accent-hover transition-colors flex items-center gap-2"
        >
          <Wallet size={18} />
          Bid on Nouns Builder
        </a>
      </div>
    </div>
  );
}
