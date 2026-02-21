'use client';

import { AlbumCard, BandcampAlbum } from './AlbumCard';

interface AlbumGridProps {
  albums: BandcampAlbum[];
  onAlbumClick: (album: BandcampAlbum) => void;
}

export function AlbumGrid({ albums, onAlbumClick }: AlbumGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {albums.map(album => (
        <AlbumCard key={album.slug} album={album} onClick={onAlbumClick} />
      ))}
    </div>
  );
}
