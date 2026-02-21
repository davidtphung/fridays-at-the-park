'use client';

import { Platform, Chain, PLATFORM_LABELS, CHAIN_LABELS, ONCHAIN_PLATFORMS } from '@/types/platform';

interface FilterBarProps {
  platform?: string;
  chain?: string;
  season?: string;
  sort?: string;
  onPlatformChange: (platform: string) => void;
  onChainChange: (chain: string) => void;
  onSeasonChange: (season: string) => void;
  onSortChange: (sort: string) => void;
  seasons?: string[];
  showPlatformFilter?: boolean;
}

export function FilterBar({
  platform = '',
  chain = '',
  season = '',
  sort = 'newest',
  onPlatformChange,
  onChainChange,
  onSeasonChange,
  onSortChange,
  seasons = [],
  showPlatformFilter = true,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {showPlatformFilter && (
        <select
          value={platform}
          onChange={(e) => onPlatformChange(e.target.value)}
          className="bg-bg-tertiary text-text-primary text-sm rounded-lg px-3 py-2 border border-border focus:outline-none focus:ring-2 focus:ring-accent min-h-[44px]"
          aria-label="Filter by platform"
        >
          <option value="">All Platforms</option>
          {ONCHAIN_PLATFORMS.map(p => (
            <option key={p} value={p}>{PLATFORM_LABELS[p]}</option>
          ))}
        </select>
      )}

      <select
        value={chain}
        onChange={(e) => onChainChange(e.target.value)}
        className="bg-bg-tertiary text-text-primary text-sm rounded-lg px-3 py-2 border border-border focus:outline-none focus:ring-2 focus:ring-accent min-h-[44px]"
        aria-label="Filter by chain"
      >
        <option value="">All Chains</option>
        <option value={Chain.ETHEREUM}>{CHAIN_LABELS[Chain.ETHEREUM]}</option>
        <option value={Chain.BASE}>{CHAIN_LABELS[Chain.BASE]}</option>
      </select>

      {seasons.length > 0 && (
        <select
          value={season}
          onChange={(e) => onSeasonChange(e.target.value)}
          className="bg-bg-tertiary text-text-primary text-sm rounded-lg px-3 py-2 border border-border focus:outline-none focus:ring-2 focus:ring-accent min-h-[44px]"
          aria-label="Filter by season"
        >
          <option value="">All Seasons</option>
          {seasons.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      )}

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="bg-bg-tertiary text-text-primary text-sm rounded-lg px-3 py-2 border border-border focus:outline-none focus:ring-2 focus:ring-accent min-h-[44px] ml-auto"
        aria-label="Sort by"
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="most_collected">Most Collected</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>
  );
}
