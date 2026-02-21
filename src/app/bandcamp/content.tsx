'use client';

import { useState } from 'react';
import { AlbumGrid } from '@/components/bandcamp/AlbumGrid';
import { BandcampEmbed } from '@/components/bandcamp/BandcampEmbed';
import { getBandcampAlbums } from '@/lib/mock-data';
import { BandcampAlbum } from '@/components/bandcamp/AlbumCard';

export function BandcampContent() {
  const albums = getBandcampAlbums();
  const [selectedAlbum, setSelectedAlbum] = useState<BandcampAlbum | null>(null);

  return (
    <>
      {selectedAlbum && (
        <BandcampEmbed album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />
      )}
      {!selectedAlbum && (
        <AlbumGrid albums={albums} onAlbumClick={setSelectedAlbum} />
      )}
    </>
  );
}
