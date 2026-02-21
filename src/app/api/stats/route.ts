import { NextResponse } from 'next/server';
import { MOCK_TRACKS, MOCK_ARTISTS, getSeasons } from '@/lib/mock-data';

export async function GET() {
  const totalTracks = MOCK_TRACKS.length;
  const totalArtists = MOCK_ARTISTS.length;
  const seasons = getSeasons();
  const totalMints = MOCK_TRACKS.reduce((sum, t) => sum + (t.totalMints || 0), 0);

  const platformCounts: Record<string, number> = {};
  MOCK_TRACKS.forEach(t => {
    platformCounts[t.platform] = (platformCounts[t.platform] || 0) + 1;
  });

  return NextResponse.json({
    totalTracks,
    totalArtists,
    totalSeasons: seasons.length,
    totalMints,
    platformCounts,
  });
}
