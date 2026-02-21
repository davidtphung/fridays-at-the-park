'use client';

import { ArtistProfile } from '@/components/artist/ArtistProfile';
import { ArtistDiscography } from '@/components/artist/ArtistDiscography';
import { Artist } from '@/types/artist';
import { Track } from '@/types/track';

interface ArtistPageContentProps {
  artist: Artist;
  tracks: Track[];
}

export function ArtistPageContent({ artist, tracks }: ArtistPageContentProps) {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
      <ArtistProfile artist={artist} />
      <ArtistDiscography tracks={tracks} />
    </div>
  );
}
