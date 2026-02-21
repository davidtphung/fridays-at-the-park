import { NextRequest, NextResponse } from 'next/server';
import { MOCK_ARTISTS, MOCK_TRACKS } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get('sort') || 'name';

  const artists = MOCK_ARTISTS.map(artist => ({
    ...artist,
    trackCount: MOCK_TRACKS.filter(t => t.artists.some(a => a.artistId === artist.id)).length,
  }));

  if (sort === 'appearances') {
    artists.sort((a, b) => b.trackCount - a.trackCount);
  } else {
    artists.sort((a, b) => a.name.localeCompare(b.name));
  }

  return NextResponse.json({ artists });
}
