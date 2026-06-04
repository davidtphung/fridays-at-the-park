'use client';

import { useState, useMemo } from 'react';
import { Newspaper, Sparkles, Film } from 'lucide-react';
import { TrackGrid } from '@/components/music/TrackGrid';
import { FilterBar } from '@/components/music/FilterBar';
import { PlaylistRail } from '@/components/music/PlaylistRail';
import { MusicVideoGrid } from '@/components/music/MusicVideoGrid';
import { FridayPressGrid } from '@/components/onchain/FridayPressGrid';
import {
  getMockTracksByPlatform,
  getSeasons,
  getMockPlaylists,
  getMockFridayPressTracks,
  getMockMusicVideoTracks,
} from '@/lib/mock-data';

type Tab = 'all' | 'music-videos' | 'friday-press';

export function OnchainContent() {
  const [tab, setTab] = useState<Tab>('all');
  const [platform, setPlatform] = useState('');
  const [chain, setChain] = useState('');
  const [season, setSeason] = useState('');
  const [sort, setSort] = useState('newest');

  const allTracks = getMockTracksByPlatform('onchain');
  const seasons = getSeasons();
  const fridayPressTracks = getMockFridayPressTracks();
  const musicVideoTracks = getMockMusicVideoTracks();

  const filteredTracks = useMemo(() => {
    let tracks = [...allTracks];

    if (platform) tracks = tracks.filter((t) => t.platform === platform);
    if (chain) tracks = tracks.filter((t) => t.chain === chain);
    if (season) tracks = tracks.filter((t) => t.season === season);

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
      default:
        tracks.sort((a, b) => new Date(b.releaseDate || 0).getTime() - new Date(a.releaseDate || 0).getTime());
    }

    return tracks;
  }, [allTracks, platform, chain, season, sort]);

  const playlists = getMockPlaylists();

  return (
    <>
      {/* ─── Tab strip ───
          Switches between the full onchain catalog and the FRIDAY PRESS
          editorial series. Same /onchain URL - no route change - so the
          GlobalPlayer's audio + queue + scroll position stays untouched. */}
      <div
        role="tablist"
        aria-label="Onchain sections"
        className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'all'}
          onClick={() => setTab('all')}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 active:scale-[0.97] flex items-center gap-1.5 min-h-[40px] ${
            tab === 'all'
              ? 'bg-accent text-bg-primary'
              : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
          }`}
        >
          <Sparkles size={14} aria-hidden="true" />
          All Onchain
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'music-videos'}
          onClick={() => setTab('music-videos')}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 active:scale-[0.97] flex items-center gap-1.5 min-h-[40px] ${
            tab === 'music-videos'
              ? 'bg-accent text-bg-primary'
              : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
          }`}
        >
          <Film size={14} aria-hidden="true" />
          Music Videos
          {musicVideoTracks.length > 0 && (
            <span
              className={`ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold ${
                tab === 'music-videos' ? 'bg-bg-primary/20 text-bg-primary' : 'bg-accent/15 text-accent'
              }`}
            >
              {musicVideoTracks.length}
            </span>
          )}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'friday-press'}
          onClick={() => setTab('friday-press')}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 active:scale-[0.97] flex items-center gap-1.5 min-h-[40px] ${
            tab === 'friday-press'
              ? 'bg-accent text-bg-primary'
              : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
          }`}
        >
          <Newspaper size={14} aria-hidden="true" />
          FRIDAY PRESS
          {fridayPressTracks.length > 0 && (
            <span
              className={`ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold ${
                tab === 'friday-press' ? 'bg-bg-primary/20 text-bg-primary' : 'bg-accent/15 text-accent'
              }`}
            >
              {fridayPressTracks.length}
            </span>
          )}
        </button>
      </div>

      {tab === 'all' && (
        <>
          {/* Curated playlists rail */}
          <div className="mb-8">
            <PlaylistRail playlists={playlists} />
          </div>
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
      )}
      {tab === 'music-videos' && <MusicVideosSection tracks={musicVideoTracks} />}
      {tab === 'friday-press' && <FridayPressSection tracks={fridayPressTracks} />}
    </>
  );
}

/**
 * Music Videos - onchain video drops with inline press-to-play playback.
 * The grid uses dweb.link gateway URLs so first-byte is ~250 ms; clicking
 * play swaps the poster card for a real <video> element with `autoplay`.
 */
function MusicVideosSection({ tracks }: { tracks: ReturnType<typeof getMockMusicVideoTracks> }) {
  return (
    <section aria-label="Music videos">
      {/* Header card */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card-bg p-6 sm:p-8 mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/5 pointer-events-none" />
        <div className="relative flex items-start gap-4 max-w-2xl">
          <div className="w-12 h-12 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
            <Film size={22} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-accent mb-1">
              Onchain Series
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary leading-tight">Music Videos</h2>
            <p className="text-sm text-text-secondary mt-2 leading-relaxed">
              Onchain music videos and lyric video walls. Press play - they stream from a fast
              IPFS gateway so first frame lands in under a second.
            </p>
          </div>
        </div>
      </div>

      {tracks.length > 0 ? (
        <MusicVideoGrid tracks={tracks} />
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-8 sm:p-12 text-center">
          <Film size={32} className="mx-auto text-text-secondary mb-3" aria-hidden="true" />
          <h3 className="text-base sm:text-lg font-semibold text-text-primary">
            Music videos coming soon
          </h3>
          <p className="text-sm text-text-secondary max-w-md mx-auto mt-2 leading-relaxed">
            Drop Zora collect URLs to populate this section.
          </p>
        </div>
      )}
    </section>
  );
}

/**
 * FRIDAY PRESS - The Park's onchain publication series on Zora.
 * Renders the resolved artifacts when present; otherwise shows an inviting
 * empty state with the canonical Zora link so the user can mint directly
 * while we wait on a proper catalog crawl.
 */
function FridayPressSection({ tracks }: { tracks: ReturnType<typeof getMockFridayPressTracks> }) {
  return (
    <section aria-label="FRIDAY PRESS artifacts">
      {/* Header card */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card-bg p-6 sm:p-8 mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/5 pointer-events-none" />
        <div className="relative flex items-start gap-4 max-w-2xl">
          <div className="w-12 h-12 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
            <Newspaper size={22} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-accent mb-1">
              Onchain Series
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary leading-tight">FRIDAY PRESS</h2>
            <p className="text-sm text-text-secondary mt-2 leading-relaxed">
              The Park&apos;s onchain publication - issues, notes, broadsides, and ephemera minted on Zora.
              Each artifact is a moment in the cadence of every Friday.
            </p>
            <a
              href="https://zora.co/@thepark"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
            >
              See the full FRIDAY PRESS tab on Zora →
            </a>
          </div>
        </div>
      </div>

      {tracks.length > 0 ? (
        <FridayPressGrid tracks={tracks} />
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-8 sm:p-12 text-center">
          <Newspaper size={32} className="mx-auto text-text-secondary mb-3" aria-hidden="true" />
          <h3 className="text-base sm:text-lg font-semibold text-text-primary">
            FRIDAY PRESS artifacts coming soon
          </h3>
          <p className="text-sm text-text-secondary max-w-md mx-auto mt-2 leading-relaxed">
            The catalog crawl needs Zora API access to resolve every issue. Browse them directly on
            Zora for now - they&apos;ll surface here automatically once the catalog is populated.
          </p>
          <a
            href="https://zora.co/@thepark"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full bg-accent text-bg-primary font-semibold text-sm transition-all hover:bg-accent-hover active:scale-[0.97] min-h-[40px]"
          >
            <Newspaper size={14} aria-hidden="true" />
            Browse on Zora
          </a>
        </div>
      )}
    </section>
  );
}
