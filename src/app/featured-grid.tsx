'use client';

import { TrackGrid } from '@/components/music/TrackGrid';
import { getMockFeaturedTracks } from '@/lib/mock-data';

export function FeaturedGrid() {
  const tracks = getMockFeaturedTracks();
  return <TrackGrid tracks={tracks} />;
}
