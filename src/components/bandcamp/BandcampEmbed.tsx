'use client';

import { Track } from '@/types/track';
import { TrackCard } from '@/components/music/TrackCard';
import { Button } from '@/components/ui/Button';
import { ExternalLink } from 'lucide-react';
import { formatDuration } from '@/lib/format';
import { BandcampAlbum } from './AlbumCard';

interface BandcampEmbedProps {
  album: BandcampAlbum;
  onClose: () => void;
}

export function BandcampEmbed({ album, onClose }: BandcampEmbedProps) {
  return (
    <div className="bg-bg-secondary rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-text-primary">{album.name}</h2>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            rightIcon={<ExternalLink size={14} />}
            onClick={() => window.open(`https://thepark.bandcamp.com/album/${album.slug}`, '_blank')}
          >
            Buy on Bandcamp
          </Button>
          <button
            onClick={onClose}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Track list */}
      <div className="space-y-1">
        {album.tracks.map((track, index) => (
          <div
            key={track.id}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-bg-tertiary transition-colors"
          >
            <span className="text-sm text-text-secondary w-6 text-right tabular-nums">{track.trackNumber || index + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{track.title}</p>
              <p className="text-xs text-text-secondary truncate">
                {track.artists.map(a => a.artist.name).join(', ')}
              </p>
            </div>
            <span className="text-xs text-text-secondary tabular-nums">{formatDuration(track.duration)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
