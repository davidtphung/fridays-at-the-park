import { Track } from '@/types/track';
import { TrackGrid } from '@/components/music/TrackGrid';

interface ArtistDiscographyProps {
  tracks: Track[];
}

export function ArtistDiscography({ tracks }: ArtistDiscographyProps) {
  if (tracks.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg font-semibold text-text-primary mb-4">
        Discography ({tracks.length})
      </h2>
      <TrackGrid tracks={tracks} />
    </section>
  );
}
