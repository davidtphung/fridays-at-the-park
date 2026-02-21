import Image from 'next/image';
import { Artist } from '@/types/artist';
import { ExternalLink } from '@/components/ui/ExternalLink';

interface ArtistProfileProps {
  artist: Artist;
}

export function ArtistProfile({ artist }: ArtistProfileProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
      {/* Avatar */}
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-bg-tertiary shrink-0">
        {artist.avatarUrl ? (
          <Image src={artist.avatarUrl} alt={`${artist.name} avatar`} fill className="object-cover" sizes="128px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-secondary text-4xl font-bold">
            {artist.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">{artist.name}</h1>
        {artist.ensName && (
          <p className="text-sm text-text-secondary font-mono mb-2">{artist.ensName}</p>
        )}
        {artist.bio && (
          <p className="text-sm text-text-secondary leading-relaxed mb-4 max-w-2xl">{artist.bio}</p>
        )}
        <div className="flex items-center gap-4 flex-wrap">
          {artist.twitter && <ExternalLink href={`https://x.com/${artist.twitter}`} className="text-sm">Twitter</ExternalLink>}
          {artist.instagram && <ExternalLink href={`https://instagram.com/${artist.instagram}`} className="text-sm">Instagram</ExternalLink>}
          {artist.warpcast && <ExternalLink href={`https://warpcast.com/${artist.warpcast}`} className="text-sm">Warpcast</ExternalLink>}
          {artist.website && <ExternalLink href={artist.website} className="text-sm">Website</ExternalLink>}
        </div>
      </div>
    </div>
  );
}
