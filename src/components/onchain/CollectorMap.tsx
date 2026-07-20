'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Sparkles, Link2, Boxes, ArrowUpRight, Info } from 'lucide-react';

interface PlatformRow {
  key: string;
  label: string;
  sub: string;
  wallets: number;
  collections: number;
  metric: string;
}
interface CollectionRow {
  name: string;
  chain: string;
  platform: string;
  standard: string;
  collectors: number;
  address: string;
}
interface OpenSeaRow { slug: string; label: string; wallets: number; url: string }
interface CollectorData {
  generatedAt: string;
  headline: { uniqueWallets: number; baseWallets?: number; totalMints?: number; collections: number; chains: number; platforms: number };
  chains: { name: string; note: string }[];
  platforms: PlatformRow[];
  openseaCollections: OpenSeaRow[];
  topCollections: CollectionRow[];
  topCoins: CollectionRow[];
  methodology: string;
}

const fmt = (n: number) => n.toLocaleString('en-US');

const CHAIN_COLOR: Record<string, string> = {
  Base: 'text-chain-base',
  Ethereum: 'text-accent',
  Zora: 'text-success',
};

function scanUrl(chain: string, address: string) {
  if (chain === 'Base') return `https://basescan.org/address/${address}`;
  if (chain === 'Ethereum') return `https://etherscan.io/address/${address}`;
  return `https://explorer.zora.energy/address/${address}`;
}

export function CollectorMap() {
  const [data, setData] = useState<CollectorData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/data/onchain-collectors.json')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: CollectorData) => { if (!cancelled) setData(d); })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, []);

  if (error) {
    return <div className="bg-card-bg border border-border rounded-xl p-6 text-sm text-text-secondary">Could not load collector data.</div>;
  }
  if (!data) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-28 bg-bg-tertiary rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-bg-tertiary rounded-xl" />)}
        </div>
      </div>
    );
  }

  const maxCollectors = Math.max(...data.topCollections.map((c) => c.collectors));

  return (
    <div className="space-y-8">
      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-accent/10 via-card-bg to-card-bg p-6 sm:p-8"
      >
        <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">Onchain collector map</p>
        <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
          <span className="text-5xl sm:text-6xl font-bold text-text-primary tabular-nums">{fmt(data.headline.uniqueWallets)}</span>
          <span className="text-lg text-text-secondary mb-1">unique wallets</span>
        </div>
        <p className="text-sm text-text-secondary mt-3 max-w-2xl leading-relaxed">
          have minted or collected something from The Park and Fridays at the Park onchain, across{' '}
          <strong className="text-text-primary">{fmt(data.headline.collections)}</strong> collections on{' '}
          <strong className="text-text-primary">{data.headline.chains}</strong> chains (Base, Ethereum, Zora),
          deduplicated across every contract.
          {data.headline.baseWallets != null && (
            <>
              {' '}
              <strong className="text-chain-base">{fmt(data.headline.baseWallets)}</strong> of them are on Base
              (Coinbase L2), where nearly the entire community lives.
            </>
          )}
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {data.chains.map((c) => (
            <span key={c.name} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-tertiary/50 px-3 py-1 text-xs text-text-secondary">
              <span className={`font-semibold ${CHAIN_COLOR[c.name] || 'text-text-primary'}`}>{c.name}</span>
              <span className="opacity-60">{c.note}</span>
            </span>
          ))}
        </div>
      </motion.div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Users, label: 'Unique wallets', value: fmt(data.headline.uniqueWallets), color: 'text-accent' },
          { icon: Link2, label: 'On Base (Coinbase L2)', value: data.headline.baseWallets != null ? fmt(data.headline.baseWallets) : '-', color: 'text-chain-base' },
          { icon: Sparkles, label: 'Total mints', value: data.headline.totalMints != null ? fmt(data.headline.totalMints) : fmt(data.headline.collections), color: 'text-success' },
          { icon: Boxes, label: 'Collections', value: fmt(data.headline.collections), color: 'text-text-primary' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card-bg border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <s.icon size={15} className={s.color} />
              <span className="text-[10px] uppercase tracking-widest text-text-secondary font-medium">{s.label}</span>
            </div>
            <p className="font-bold text-text-primary text-2xl tabular-nums">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Platform breakdown */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">By platform</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.platforms.map((p, i) => (
            <motion.div
              key={p.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card-bg border border-border rounded-xl p-4 hover:border-accent/30 transition-colors"
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-semibold text-text-primary">{p.label}</p>
                <span className="text-xl font-bold text-accent tabular-nums">{fmt(p.wallets)}</span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">{p.sub}</p>
              <p className="text-[11px] text-text-secondary mt-2">
                {fmt(p.collections)} {p.collections === 1 ? 'collection' : 'collections'} · {p.metric}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top collections bar chart */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Most collected drops</h2>
        <div className="bg-card-bg border border-border rounded-xl p-4 sm:p-5 space-y-2.5">
          {data.topCollections.map((c) => (
            <a
              key={c.address + c.name}
              href={scanUrl(c.chain, c.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="flex items-center justify-between gap-3 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm text-text-primary truncate group-hover:text-accent transition-colors">{c.name}</span>
                  <span className={`text-[10px] font-semibold shrink-0 ${CHAIN_COLOR[c.chain] || 'text-text-secondary'}`}>{c.chain}</span>
                </div>
                <span className="text-sm font-semibold text-text-primary tabular-nums shrink-0">{fmt(c.collectors)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-bg-tertiary overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent/70 group-hover:bg-accent transition-colors"
                  style={{ width: `${Math.max(2, (c.collectors / maxCollectors) * 100)}%` }}
                />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* OpenSea collections + top coins */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4">On OpenSea</h2>
          <div className="bg-card-bg border border-border rounded-xl p-4 space-y-3">
            {data.openseaCollections.map((o) => (
              <a
                key={o.slug}
                href={o.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 rounded-lg border border-border bg-bg-tertiary/40 px-3 py-2.5 hover:border-accent/40 transition-colors group"
              >
                <span className="text-sm text-text-primary truncate">{o.label}</span>
                <span className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-semibold text-accent tabular-nums">{fmt(o.wallets)}</span>
                  <ArrowUpRight size={13} className="text-text-secondary group-hover:text-accent transition-colors" />
                </span>
              </a>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Top content coins</h2>
          <div className="bg-card-bg border border-border rounded-xl p-4 space-y-2">
            {data.topCoins.slice(0, 8).map((c) => (
              <div key={c.address} className="flex items-center justify-between gap-2">
                <span className="text-sm text-text-secondary truncate">{c.name}</span>
                <span className="text-sm font-semibold text-text-primary tabular-nums shrink-0">{fmt(c.collectors)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Methodology */}
      <div className="flex items-start gap-2 text-xs text-text-secondary leading-relaxed border-t border-border pt-4">
        <Info size={14} className="shrink-0 mt-0.5" />
        <p>
          {data.methodology} Snapshot {data.generatedAt}.
        </p>
      </div>
    </div>
  );
}
