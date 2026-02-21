'use client';

import { useRouter } from 'next/navigation';
import { CoverFlow } from '@/components/music/CoverFlow';
import { getMockFeaturedTracks } from '@/lib/mock-data';

export function CoverFlowSection() {
  const router = useRouter();
  const featured = getMockFeaturedTracks();

  return (
    <CoverFlow
      tracks={featured}
      onSelect={(track) => router.push(`/track/${track.id}`)}
    />
  );
}
