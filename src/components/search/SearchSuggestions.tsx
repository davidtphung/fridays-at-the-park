import { Track } from '@/types/track';
import { Artist } from '@/types/artist';
import Link from 'next/link';
import Image from 'next/image';

interface SearchSuggestionsProps {
  tracks: Track[];
  artists: Artist[];
  isVisible: boolean;
  onClose: () => void;
}

export function SearchSuggestions({ tracks, artists, isVisible, onClose }: SearchSuggestionsProps) {
  if (!isVisible || (tracks.length === 0 && artists.length === 0)) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-bg-secondary border border-border rounded-xl shadow-xl overflow-hidden z-50">
      {tracks.length > 0 && (
        <div className="p-2">
          <p className="text-xs text-text-secondary px-2 py-1 font-medium">Tracks</p>
          {tracks.slice(0, 5).map(track => (
            <Link
              key={track.id}
              href={`/track/${track.id}`}
              onClick={onClose}
              className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-bg-tertiary transition-colors"
            >
              <div className="relative w-8 h-8 rounded overflow-hidden bg-bg-tertiary shrink-0">
                <Image src={track.coverImage} alt="" fill className="object-cover" sizes="32px" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-text-primary truncate">{track.title}</p>
                <p className="text-xs text-text-secondary truncate">{track.artists.map(a => a.artist.name).join(', ')}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
      {artists.length > 0 && (
        <div className="p-2 border-t border-border">
          <p className="text-xs text-text-secondary px-2 py-1 font-medium">Artists</p>
          {artists.slice(0, 3).map(artist => (
            <Link
              key={artist.id}
              href={`/artist/${artist.slug}`}
              onClick={onClose}
              className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-bg-tertiary transition-colors"
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-bg-tertiary shrink-0 flex items-center justify-center text-text-secondary text-sm font-bold">
                {artist.name.charAt(0)}
              </div>
              <p className="text-sm text-text-primary truncate">{artist.name}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
