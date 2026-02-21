'use client';

import { TrackDetail } from '@/components/music/TrackDetail';
import { RelatedTracks } from '@/components/music/RelatedTracks';
import { Track } from '@/types/track';

interface TrackDetailContentProps {
  track: Track;
  relatedTracks: Track[];
}

export function TrackDetailContent({ track, relatedTracks }: TrackDetailContentProps) {
  return (
    <>
      <TrackDetail track={track} />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pb-16">
        <RelatedTracks tracks={relatedTracks} />
      </div>
    </>
  );
}
