'use client';

import { useState, useMemo } from 'react';
import { TrackGrid } from '@/components/music/TrackGrid';
import { FilterBar } from '@/components/music/FilterBar';
import { getMockTracksByPlatform, getSeasons } from '@/lib/mock-data';
import { Platform, Chain } from '@/types/platform';

export function OnchainContent() {
  const [platform, setPlatform] = useState('');
  const [chain, setChain] = useState('');
  const [season, setSeason] = useState('');
  const [sort, setSort] = useState('newest');

  const allTracks = getMockTracksByPlatform('onchain');
  const seasons = getSeasons();

  const filteredTracks = useMemo(() => {
    let tracks = [...allTracks];

    if (platform) {
      tracks = tracks.filter(t => t.platform === platform);
    }
    if (chain) {
      tracks = tracks.filter(t => t.chain === chain);
    }
    if (season) {
      tracks = tracks.filter(t => t.season === season);
    }

    switch (sort) {
      case 'oldest':
        tracks.sort((a, b) => new Date(a.releaseDate || 0).getTime() - new Date(b.releaseDate || 0).getTime());
        break;
      case 'most_collected':
        tracks.sort((a, b) => (b.totalMints || 0) - (a.totalMints || 0));
        break;
      case 'price_asc':
        tracks.sort((a, b) => parseFloat(a.mintPrice || '0') - parseFloat(b.mintPrice || '0'));
        break;
      case 'price_desc':
        tracks.sort((a, b) => parseFloat(b.mintPrice || '0') - parseFloat(a.mintPrice || '0'));
        break;
      default: // newest
        tracks.sort((a, b) => new Date(b.releaseDate || 0).getTime() - new Date(a.releaseDate || 0).getTime());
    }

    return tracks;
  }, [allTracks, platform, chain, season, sort]);

  return (
    <>
      <FilterBar
        platform={platform}
        chain={chain}
        season={season}
        sort={sort}
        onPlatformChange={setPlatform}
        onChainChange={setChain}
        onSeasonChange={setSeason}
        onSortChange={setSort}
        seasons={seasons}
      />
      <TrackGrid tracks={filteredTracks} variant="onchain" />
    </>
  );
}
