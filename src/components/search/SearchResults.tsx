'use client';

import { useState } from 'react';
import { Track } from '@/types/track';
import { Artist } from '@/types/artist';
import { Tabs } from '@/components/ui/Tabs';
import { TrackGrid } from '@/components/music/TrackGrid';
import { ArtistCard } from '@/components/artist/ArtistCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { MediaType } from '@/types/platform';

interface SearchResultsProps {
  tracks: Track[];
  artists: (Artist & { trackCount?: number })[];
  episodes: Track[];
  query: string;
  totalHits: number;
}

export function SearchResults({ tracks, artists, episodes, query, totalHits }: SearchResultsProps) {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All', count: totalHits },
    { id: 'tracks', label: 'Tracks', count: tracks.length },
    { id: 'artists', label: 'Artists', count: artists.length },
    { id: 'episodes', label: 'Episodes', count: episodes.length },
  ];

  if (totalHits === 0) {
    return (
      <EmptyState
        icon="search"
        title={`No results for "${query}"`}
        description="Try a different search term or browse the catalog."
      />
    );
  }

  return (
    <div>
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} className="mb-6" />

      {(activeTab === 'all' || activeTab === 'tracks') && tracks.length > 0 && (
        <section className="mb-8">
          {activeTab === 'all' && <h2 className="text-lg font-semibold text-text-primary mb-4">Tracks</h2>}
          <TrackGrid tracks={tracks} />
        </section>
      )}

      {(activeTab === 'all' || activeTab === 'artists') && artists.length > 0 && (
        <section className="mb-8">
          {activeTab === 'all' && <h2 className="text-lg font-semibold text-text-primary mb-4">Artists</h2>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {artists.map(artist => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>
      )}

      {(activeTab === 'all' || activeTab === 'episodes') && episodes.length > 0 && (
        <section className="mb-8">
          {activeTab === 'all' && <h2 className="text-lg font-semibold text-text-primary mb-4">Episodes</h2>}
          <TrackGrid tracks={episodes} variant="episode" columns="video" />
        </section>
      )}
    </div>
  );
}
