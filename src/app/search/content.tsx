'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchResults } from '@/components/search/SearchResults';
import { searchMockData } from '@/lib/mock-data';
import { MediaType } from '@/types/platform';

export function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const data = searchMockData(query);
    const audioTracks = data.tracks.filter(t => t.mediaType !== MediaType.VIDEO);
    const videoEpisodes = data.tracks.filter(t => t.mediaType === MediaType.VIDEO);
    return {
      tracks: audioTracks,
      artists: data.artists.map(a => ({ ...a, trackCount: data.tracks.filter(t => t.artists.some(ta => ta.artistId === a.id)).length })),
      episodes: videoEpisodes,
      query,
      totalHits: audioTracks.length + data.artists.length + videoEpisodes.length,
    };
  }, [query]);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">Search</h1>
        <SearchBar initialQuery={query} onSearch={setQuery} autoFocus />
      </div>

      {results && (
        <SearchResults
          tracks={results.tracks}
          artists={results.artists}
          episodes={results.episodes}
          query={results.query}
          totalHits={results.totalHits}
        />
      )}

      {!query.trim() && (
        <p className="text-text-secondary text-center py-12">
          Search for tracks, artists, or episodes...
        </p>
      )}
    </>
  );
}
