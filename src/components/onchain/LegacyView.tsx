'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight, Wallet, Boxes, Link2, Gem, ScrollText } from 'lucide-react';

interface PortfolioItem { name: string; address: string; type: string; meta: string }
interface PortfolioGroup { group: string; note: string; chain: string; items: PortfolioItem[] }
interface TimelineEvent { date: string; title: string; body: string; chain: string; kind?: string }
interface LegacyData {
  title: string;
  tagline: string;
  profile: {
    ens: string; baseName: string; address: string;
    ethereum: { type: string; balanceEth: number; txs: number };
    base: { type: string; balanceEth: number; nonce: number };
    linkedWallets: { label: string; address: string; role: string }[];
  };
  stats: { label: string; value: number }[];
  genesis: { name: string; symbol: string; address: string; chain: string; type: string; date: string; note: string; explorer: string };
  portfolio: PortfolioGroup[];
  timeline: TimelineEvent[];
  pitch: string;
}

const fmt = (n: number) => n.toLocaleString('en-US');
const short = (a: string) => (a.startsWith('0x') ? `${a.slice(0, 6)}…${a.slice(-4)}` : a);
const CHAIN_COLOR: Record<string, string> = { Base: 'text-chain-base', Ethereum: 'text-accent', Zora: 'text-success' };

function explorer(chain: string, address: string) {
  if (!address.startsWith('0x')) return `https://${address}`;
  if (chain === 'Ethereum') return `https://etherscan.io/address/${address}`;
  return `https://basescan.org/address/${address}`;
}

export function LegacyView() {
  const [data, setData] = useState<LegacyData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/data/onchain-legacy.json')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: LegacyData) => { if (!cancelled) setData(d); })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, []);

  if (error) return <div className="bg-card-bg border border-border rounded-xl p-6 text-sm text-text-secondary">Could not load the legacy data.</div>;
  if (!data) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-64 bg-bg-tertiary rounded-2xl" />
      <div className="h-40 bg-bg-tertiary rounded-2xl" />
    </div>
  );

  const p = data.profile;

  return (
    <div className="space-y-10">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-accent/12 via-card-bg to-card-bg p-8 sm:p-12"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-3">Onchain legacy</p>
        <h1 className="text-3xl sm:text-5xl font-bold text-text-primary leading-[1.05] max-w-3xl">{data.title}</h1>
        <p className="text-lg text-text-secondary mt-4 italic">{data.tagline}</p>
        <p className="text-sm text-text-secondary mt-6 max-w-2xl leading-relaxed">{data.pitch}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
          {data.stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-bg-primary/40 px-4 py-3">
              <p className="text-2xl sm:text-3xl font-bold text-text-primary tabular-nums">{fmt(s.value)}</p>
              <p className="text-[11px] uppercase tracking-wider text-text-secondary mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Deployer identity */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Wallet size={16} className="text-accent" />
          <h2 className="text-lg font-semibold text-text-primary">The deployer</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 bg-card-bg border border-border rounded-2xl p-6">
            <p className="text-2xl font-bold text-text-primary">{p.ens}</p>
            <p className="text-xs text-text-secondary font-mono mt-1 break-all">{p.address}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-bg-tertiary/50 px-2.5 py-1 text-[11px] text-text-secondary">
                <span className="text-accent font-semibold">Ethereum</span> {p.ethereum.type}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-bg-tertiary/50 px-2.5 py-1 text-[11px] text-text-secondary">
                <span className="text-chain-base font-semibold">Base</span> {p.base.type}
              </span>
            </div>
          </div>
          <div className="lg:col-span-2 bg-card-bg border border-border rounded-2xl p-6">
            <p className="text-[10px] uppercase tracking-widest text-text-secondary font-medium mb-3">Wallet cluster</p>
            <div className="space-y-2.5">
              {p.linkedWallets.map((w) => (
                <a
                  key={w.address}
                  href={`https://basescan.org/address/${w.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-bg-tertiary/30 px-3 py-2.5 hover:border-accent/40 transition-colors group"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-text-primary">{w.label}</p>
                    <p className="text-xs text-text-secondary font-mono">{short(w.address)}</p>
                  </div>
                  <span className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-text-secondary">{w.role}</span>
                    <ArrowUpRight size={13} className="text-text-secondary group-hover:text-accent transition-colors" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Genesis */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-accent" />
          <h2 className="text-lg font-semibold text-text-primary">The genesis</h2>
        </div>
        <a
          href={data.genesis.explorer}
          target="_blank"
          rel="noopener noreferrer"
          className="block group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-accent/10 to-card-bg p-6 sm:p-8 hover:border-accent/40 transition-colors"
        >
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold text-text-primary">{data.genesis.name}</span>
            <span className="text-sm font-mono text-text-secondary">{data.genesis.symbol}</span>
            <span className="text-xs font-semibold text-accent">{data.genesis.type}</span>
            <span className="text-xs font-semibold text-accent">{data.genesis.date}</span>
          </div>
          <p className="text-sm text-text-secondary mt-3 max-w-2xl leading-relaxed">{data.genesis.note}</p>
          <div className="flex items-center gap-1.5 mt-4 text-sm text-accent">
            <span className="font-mono text-xs">{short(data.genesis.address)}</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </a>
      </section>

      {/* Contract portfolio */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Boxes size={16} className="text-accent" />
          <h2 className="text-lg font-semibold text-text-primary">Contract portfolio</h2>
        </div>
        <div className="space-y-5">
          {data.portfolio.map((grp) => (
            <div key={grp.group} className="bg-card-bg border border-border rounded-2xl p-5 sm:p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
                  {grp.group}
                  <span className={`text-[10px] font-semibold ${CHAIN_COLOR[grp.chain] || 'text-text-secondary'}`}>{grp.chain}</span>
                </h3>
                <span className="text-xs text-text-secondary">{grp.items.length} {grp.items.length === 1 ? 'contract' : 'contracts'}</span>
              </div>
              <p className="text-xs text-text-secondary mb-4">{grp.note}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {grp.items.map((it) => (
                  <a
                    key={it.address + it.name}
                    href={explorer(grp.chain, it.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 rounded-lg border border-border bg-bg-tertiary/30 px-3 py-2.5 hover:border-accent/40 transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-text-primary truncate">{it.name}</p>
                      <p className="text-xs text-text-secondary font-mono">{short(it.address)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[11px] text-accent font-medium">{it.type}</p>
                      {it.meta && <p className="text-[11px] text-text-secondary">{it.meta}</p>}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <ScrollText size={16} className="text-accent" />
          <h2 className="text-lg font-semibold text-text-primary">Timeline</h2>
        </div>
        <div className="relative pl-6 sm:pl-8">
          <div className="absolute left-[7px] sm:left-[11px] top-1 bottom-1 w-px bg-border" />
          <div className="space-y-6">
            {data.timeline.map((e, i) => (
              <motion.div
                key={e.date + e.title}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.03 }}
                className="relative"
              >
                <span
                  className={`absolute -left-[21px] sm:-left-[29px] top-1 h-3.5 w-3.5 rounded-full border-2 border-bg-primary ${
                    e.kind === 'genesis' ? 'bg-accent' : e.chain === 'Base' ? 'bg-chain-base' : 'bg-text-secondary'
                  }`}
                />
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-sm font-semibold text-text-primary">{e.title}</span>
                  <span className="text-xs font-mono text-text-secondary">{e.date}</span>
                  <span className={`text-[10px] font-semibold ${CHAIN_COLOR[e.chain] || 'text-text-secondary'}`}>{e.chain}</span>
                </div>
                <p className="text-sm text-text-secondary mt-1 leading-relaxed max-w-2xl">{e.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing / funder line */}
      <section className="rounded-2xl border border-border bg-gradient-to-br from-card-bg to-accent/5 p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <Gem size={18} className="text-accent shrink-0 mt-1" />
          <div>
            <p className="text-base sm:text-lg text-text-primary font-medium leading-relaxed">{data.pitch}</p>
            <div className="flex flex-wrap gap-3 mt-4">
              <a href="https://zora.co/@thepark" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors">
                @thepark on Zora <ArrowUpRight size={14} />
              </a>
              <a href="https://etherscan.io/address/0x589FFBbdA0EaCD5A9C2BA208b379c886B2630503" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent transition-colors">
                <Link2 size={14} /> Etherscan
              </a>
              <a href="https://basescan.org/address/0x589FFBbdA0EaCD5A9C2BA208b379c886B2630503" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent transition-colors">
                <Link2 size={14} /> BaseScan
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
