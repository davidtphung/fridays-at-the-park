'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Search, Copy, Check, Crown, Gavel } from 'lucide-react';
import { formatAddress } from '@/lib/format';

interface DaoToken {
  id: number;
  owner: string;
  ens: string | null;
  image: string;
  inAuction: boolean;
}

interface TopHolder {
  owner: string;
  ens: string | null;
  count: number;
}

interface DaoData {
  contract: string;
  chain: string;
  name: string;
  symbol: string;
  totalSupply: number;
  uniqueOwners: number;
  description: string;
  openseaUrl: string;
  basescanUrl: string;
  nounsBuilder: string;
  crawledAt: string;
  topHolders: TopHolder[];
  tokens: DaoToken[];
}

const PAGE = 60;

function ownerLabel(owner: string, ens: string | null) {
  return ens || formatAddress(owner);
}

function InlineCopy({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="text-text-secondary hover:text-accent transition-colors shrink-0"
      aria-label="Copy contract address"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}

export function TokenGallery() {
  const [data, setData] = useState<DaoData | null>(null);
  const [error, setError] = useState(false);
  const [visible, setVisible] = useState(PAGE);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch('/data/dao-tokens.json')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: DaoData) => {
        if (!cancelled) setData(d);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    if (!q) return data.tokens;
    return data.tokens.filter(
      (t) =>
        String(t.id) === q ||
        String(t.id).includes(q) ||
        t.owner.toLowerCase().includes(q) ||
        (t.ens || '').toLowerCase().includes(q),
    );
  }, [data, query]);

  useEffect(() => {
    setVisible(PAGE);
  }, [query]);

  if (error) {
    return (
      <div className="bg-card-bg border border-border rounded-xl p-6 text-sm text-text-secondary">
        Could not load the token collection. View it on{' '}
        <a href="https://opensea.io/collection/the-park-dao-1" className="text-accent hover:text-accent-hover" target="_blank" rel="noopener noreferrer">
          OpenSea
        </a>
        .
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-card-bg border border-border rounded-xl p-6 animate-pulse">
        <div className="h-4 w-40 bg-bg-tertiary rounded mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square bg-bg-tertiary rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const shown = filtered.slice(0, visible);

  return (
    <div className="space-y-6">
      {/* Collection metadata */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card-bg border border-border rounded-xl p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Collection</h2>
            <p className="text-sm text-text-secondary mt-1">
              {data.totalSupply} tokens minted, held by {data.uniqueOwners} members
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={data.openseaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors"
            >
              OpenSea <ArrowUpRight size={14} />
            </a>
            <a
              href={data.basescanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent transition-colors"
            >
              BaseScan <ArrowUpRight size={14} />
            </a>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <dt className="text-[10px] uppercase tracking-widest text-text-secondary font-medium mb-1">Name</dt>
            <dd className="text-text-primary">{data.name}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-widest text-text-secondary font-medium mb-1">Symbol</dt>
            <dd className="text-text-primary font-mono">{data.symbol}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-widest text-text-secondary font-medium mb-1">Standard</dt>
            <dd className="text-text-primary">ERC-721 · Base</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-[10px] uppercase tracking-widest text-text-secondary font-medium mb-1">Contract</dt>
            <dd className="text-text-primary font-mono flex items-center gap-1.5">
              {formatAddress(data.contract)}
              <InlineCopy text={data.contract} />
            </dd>
          </div>
        </dl>
      </motion.div>

      {/* Top holders */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card-bg border border-border rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Crown size={16} className="text-accent" />
          <h2 className="text-lg font-semibold text-text-primary">Top Holders</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {data.topHolders.map((h, i) => (
            <a
              key={h.owner}
              href={`https://basescan.org/address/${h.owner}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 rounded-lg border border-border bg-bg-tertiary/40 px-3 py-2 hover:border-accent/40 transition-colors group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-text-secondary w-4 shrink-0">{i + 1}</span>
                <span className="text-sm text-text-primary truncate">{ownerLabel(h.owner, h.ens)}</span>
              </div>
              <span className="text-xs font-semibold text-accent shrink-0">{h.count}</span>
            </a>
          ))}
        </div>
      </motion.div>

      {/* Token gallery */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card-bg border border-border rounded-xl p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <h2 className="text-lg font-semibold text-text-primary">All Tokens</h2>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search token # or holder"
              className="pl-9 pr-3 py-2 text-sm rounded-lg bg-bg-tertiary border border-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent/50 w-full sm:w-64"
              aria-label="Search tokens by number or holder"
            />
          </div>
        </div>

        {shown.length === 0 ? (
          <p className="text-sm text-text-secondary py-8 text-center">No tokens match &ldquo;{query}&rdquo;.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {shown.map((t) => (
              <a
                key={t.id}
                href={`${data.nounsBuilder}/${t.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-lg overflow-hidden border border-border bg-bg-tertiary/40 hover:border-accent/40 transition-colors"
              >
                <div className="relative aspect-square bg-bg-tertiary overflow-hidden">
                  {/* Nouns Builder renderer (external, allowed in CSP img-src) - plain img for lazy loading. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.image}
                    alt={`the park dao #${t.id}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  {t.inAuction && (
                    <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded-full bg-accent/90 text-bg-primary text-[10px] font-semibold px-2 py-0.5">
                      <Gavel size={10} /> Live
                    </span>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="text-sm font-semibold text-text-primary">#{t.id}</p>
                  <p className="text-xs text-text-secondary truncate" title={t.owner}>
                    {t.inAuction ? 'In auction' : ownerLabel(t.owner, t.ens)}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}

        {visible < filtered.length && (
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE)}
              className="px-6 py-2.5 rounded-lg border border-border text-sm font-medium text-text-primary hover:border-accent/50 hover:text-accent transition-colors"
            >
              Load more ({filtered.length - visible} remaining)
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
