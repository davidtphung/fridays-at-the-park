import Image from 'next/image';
import Link from 'next/link';
import { Artist } from '@/types/artist';

interface ArtistCardProps {
  artist: Artist & { trackCount?: number };
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link
      href={`/artist/${artist.slug}`}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-bg-tertiary transition-colors group"
    >
      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-bg-tertiary shrink-0">
        {artist.avatarUrl ? (
          <Image
            src={artist.avatarUrl}
            alt={`${artist.name} avatar`}
            fill
            className="object-cover"
            sizes="48px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-secondary text-lg font-bold">
            {artist.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors truncate">{artist.name}</p>
        {artist.trackCount !== undefined && (
          <p className="text-xs text-text-secondary">{artist.trackCount} tracks</p>
        )}
      </div>
    </Link>
  );
}
