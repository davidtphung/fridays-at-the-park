'use client';

import Image from 'next/image';
import { Track } from '@/types/track';
import { formatDuration } from '@/lib/format';

interface BandcampAlbum {
  name: string;
  slug: string;
  coverImage: string;
  tracks: Track[];
  trackCount: number;
  totalDuration: number;
}

interface AlbumCardProps {
  album: BandcampAlbum;
  onClick: (album: BandcampAlbum) => void;
}

export function AlbumCard({ album, onClick }: AlbumCardProps) {
  return (
    <button
      onClick={() => onClick(album)}
      className="group text-left w-full focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 rounded-card"
    >
      <div className="relative aspect-square rounded-card overflow-hidden bg-bg-tertiary mb-3 shadow-lg group-hover:shadow-xl transition-shadow">
        <Image
          src={album.coverImage}
          alt={`${album.name} — album cover`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
        />
      </div>
      <h3 className="text-base font-semibold text-text-primary leading-snug mb-1">{album.name}</h3>
      <p className="text-xs text-text-secondary">
        {album.trackCount} tracks · {formatDuration(album.totalDuration)}
      </p>
    </button>
  );
}

export type { BandcampAlbum };
